// models/SubscriptionPayment.ts
import mongoose from "mongoose";

const SubscriptionPaymentSchema = new mongoose.Schema(
    {
        paymentId: String,
        subscriptionId: String,
        orderId: String,
        invoiceId: String,
        method: String,
        vpa: String,
        customerId: String,
        tokenId: String,
        rrn: String,
        amount: Number,
        status: String,
        rawWebhook: Object,
    },
    { timestamps: true }
);

export const SubscriptionPayments =
    mongoose.models.SubscriptionPayments ||
    mongoose.model("SubscriptionPayments", SubscriptionPaymentSchema);
