// app/api/subscription-success/route.ts
import { connectDB } from "@/lib/mongoose";
import { SuccessSubscription } from "@/models/SuccessSubscription";
import { FailedSubscription } from "@/models/FailedSubscription";
import { SubscriptionPayments } from "@/models/SubscriptionPayment";
import Razorpay from "razorpay";

export async function POST(req: Request) {
    await connectDB();

    try {
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });
        const { subscriptionId, paymentId, signature, userData } = await req.json();

        // TODO: Add actual Razorpay signature verification here
        // verifySignature({subscriptionId, paymentId, signature});

        // Fetch payment details from Razorpay
        const payment: any = await razorpay.payments.fetch(paymentId);

        // Build reusable mapped data (without IDs to avoid TS warnings)
        const mappedData = {
            orderId: payment.order_id,
            invoiceId: payment.invoice_id,
            method: payment.method,
            vpa: payment.vpa,
            customerId: payment.customer_id,
            tokenId: payment.token_id,
            rrn: payment.acquirer_data?.rrn || null,
            amount: Number(payment.amount) / 100,
            status: payment.status,
            userData,
            rawWebhook: {
                paymentId: payment.id,
                orderId: payment.order_id,
                invoiceId: payment.invoice_id,
                method: payment.method,
                vpa: payment.vpa,
                customerId: payment.customer_id,
                tokenId: payment.token_id,
                rrn: payment.acquirer_data?.rrn || null,
            },
        };

        // Log every payment in SubscriptionPayments
        await SubscriptionPayments.findOneAndUpdate(
            { paymentId: payment.id },
            { paymentId: payment.id, subscriptionId, ...mappedData },
            { upsert: true }
        );

        if (payment.status === "captured") {
            // Store successful subscription (only first payment or recurring capture)
            await SuccessSubscription.findOneAndUpdate(
                { subscriptionId },
                { paymentId: payment.id, subscriptionId, ...mappedData },
                { upsert: true }
            );
        } else {
            // Store failed subscription
            await FailedSubscription.findOneAndUpdate(
                { paymentId: payment.id },
                { paymentId: payment.id, subscriptionId, ...mappedData },
                { upsert: true }
            );
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });

    } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
}
