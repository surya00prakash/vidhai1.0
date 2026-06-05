import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/mongoose";
import { SuccessSubscription } from "@/models/SuccessSubscription";
import { FailedSubscription } from "@/models/FailedSubscription";
import { SubscriptionPayments } from "@/models/SubscriptionPayment";

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();

    // Verify webhook signature if secret is configured
    if (WEBHOOK_SECRET) {
      const receivedSignature = req.headers.get("x-razorpay-signature");
      if (!receivedSignature) {
        return NextResponse.json({ status: "unauthorized" }, { status: 401 });
      }

      const expectedSignature = crypto
        .createHmac("sha256", WEBHOOK_SECRET)
        .update(body)
        .digest("hex");

      if (expectedSignature !== receivedSignature) {
        return NextResponse.json({ status: "unauthorized" }, { status: 401 });
      }
    }

    let payload: Record<string, unknown>;
    try {
      payload = JSON.parse(body);
    } catch {
      return NextResponse.json({ status: "bad_request" }, { status: 400 });
    }

    const paymentEntity = (payload.payload as Record<string, unknown> | undefined) &&
      ((payload.payload as Record<string, Record<string, Record<string, unknown>>>)?.payment?.entity);

    if (!paymentEntity) {
      return NextResponse.json({ status: "ignored" });
    }

    await connectDB();

    const paymentId = paymentEntity.id as string;
    const subscriptionId = paymentEntity.subscription_id as string;
    const status = paymentEntity.status as string;
    const amount = (paymentEntity.amount as number) / 100;
    const method = paymentEntity.method as string;
    const createdAt = new Date((paymentEntity.created_at as number) * 1000);

    // 1. Always store in SubscriptionPayments
    await SubscriptionPayments.findOneAndUpdate(
      { paymentId },
      { paymentId, subscriptionId, status, amount, method, createdAt, rawWebhook: payload },
      { upsert: true },
    );

    // 2. Detect first subscription payment
    const sub = (payload.payload as Record<string, Record<string, Record<string, unknown>>>)?.subscription?.entity;
    const subscriptionStartTime = sub?.start_at ?? sub?.current_start ?? null;
    const isFirstPayment = subscriptionStartTime && paymentEntity.created_at === subscriptionStartTime;

    if (payload.event === "payment.captured" && isFirstPayment) {
      await SuccessSubscription.findOneAndUpdate(
        { subscriptionId },
        { subscriptionId, paymentId, status, amount, method, createdAt, rawWebhook: payload },
        { upsert: true },
      );
    }

    // 3. Failed first subscriptions
    if (
      ["payment.failed", "subscription.charged.unsuccessful"].includes(payload.event as string) &&
      isFirstPayment
    ) {
      await FailedSubscription.findOneAndUpdate(
        { paymentId },
        {
          subscriptionId,
          paymentId,
          status,
          reason: (paymentEntity.error_description as string) || "Unknown",
          amount,
          method,
          createdAt,
          rawWebhook: payload,
        },
        { upsert: true },
      );
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}
