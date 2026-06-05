// app/api/payments/razorpay/verify/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";

type VerifyBody = {
    txnid?: string;
    razorpay_payment_id?: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
    amount?: number; // optional: amount in paise (integer)
};

const RAZORPAY_KEY_ID_1 = process.env.RAZORPAY_KEY_ID_1;
const RAZORPAY_KEY_SECRET_1 = process.env.RAZORPAY_KEY_SECRET_1;

function getErrorMessage(err: unknown): string {
    if (err instanceof Error) return err.message;
    try {
        return String(err);
    } catch {
        return "Unknown error";
    }
}

export async function POST(req: Request) {
    try {
        const body = (await req.json().catch(() => ({}))) as VerifyBody;

        const {
            txnid,
            razorpay_payment_id: paymentId,
            razorpay_order_id: orderId,
            razorpay_signature: signature,
            amount: expectedAmountPaise,
        } = body;

        if (!paymentId || !orderId || !signature) {
            return NextResponse.json(
                { ok: false, error: "Missing required parameters (razorpay_payment_id, razorpay_order_id, razorpay_signature)" },
                { status: 400 }
            );
        }

        if (!RAZORPAY_KEY_SECRET_1) {
            return NextResponse.json({ ok: false, error: "Server misconfigured" }, { status: 500 });
        }

        // compute expected signature
        const expected = crypto
            .createHmac("sha256", RAZORPAY_KEY_SECRET_1)
            .update(`${orderId}|${paymentId}`)
            .digest("hex");

        if (expected !== signature) {
            return NextResponse.json({ ok: false, error: "Invalid signature" }, { status: 400 });
        }

        // At this point signature is valid. Optionally fetch payment details from Razorpay to double-check status and amount.
        // Dynamic import of razorpay SDK to avoid top-level import issues.
        let Razorpay: any;
        try {
            const mod = await import("razorpay");
            Razorpay = (mod && (mod.default ?? mod)) as any;
        } catch (impErr: unknown) {
            // Not fatal — we already validated signature. But fetching payment gives extra safety.
            // Return success but warn in server logs, or return 500 if you require the fetch step.
            return NextResponse.json({ ok: true, warning: "Signature verified but razorpay module unavailable to fetch payment details. Update DB manually." }, { status: 200 });
        }

        const razorpay = new Razorpay({
            key_id: RAZORPAY_KEY_ID_1,
            key_secret: RAZORPAY_KEY_SECRET_1,
        });

        let paymentObj: any = null;
        try {
            paymentObj = await razorpay.payments.fetch(paymentId);
        } catch (fetchErr: unknown) {
            // Signature was valid, proceed, but you may want to mark for manual review.
            // Return success with warning so client can redirect to success page but you can investigate server-side.
            // If you want to be strict, return 500 here instead.
            return NextResponse.json({ ok: true, warning: "Signature verified but could not fetch payment details. Check server logs." }, { status: 200 });
        }

        // Basic checks on fetched payment (if available)
        if (paymentObj) {
            // status should typically be 'captured' when payment_capture = 1
            if (paymentObj.status !== "captured") {
                // You can choose to fail here or proceed marking as pending
                // return NextResponse.json({ ok: false, error: "Payment not captured" }, { status: 400 });
            }

            // If expected amount provided, compare
            if (typeof expectedAmountPaise === "number") {
                // paymentObj.amount is in paise
                if (Number(paymentObj.amount) !== Number(expectedAmountPaise)) {
                    // Decide whether to fail or proceed. We'll return an error to be safe.
                    return NextResponse.json({ ok: false, error: "Amount mismatch" }, { status: 400 });
                }
            }
        }

        // TODO: Update your DB/payment record here using txnid, receipt or orderId to mark as paid.
        // Example (Mongoose) - adapt to your project structure:
        //
        // import { connectDB } from "@/lib/mongoose";
        // import PaymentModel from "@/models/Payment";
        //
        // await connectDB();
        // await PaymentModel.findOneAndUpdate(
        //   { txnid }, // or { razorpayOrderId: orderId } depending on what you stored earlier
        //   {
        //     $set: {
        //       status: "paid",
        //       razorpayPaymentId: paymentId,
        //       razorpayOrderId: orderId,
        //       rawPayment: paymentObj,
        //       verifiedAt: new Date(),
        //     },
        //   },
        //   { upsert: false }
        // );
        //
        // If you didn't create a DB record earlier, create one now recording the payment details.

        // Everything verified — respond with success
        return NextResponse.json({ ok: true, message: "Payment verified", razorpay: { paymentId, orderId }, txnid });
    } catch (err: unknown) {
        return NextResponse.json({ ok: false, error: "Unexpected server error", details: getErrorMessage(err) }, { status: 500 });
    }
}
