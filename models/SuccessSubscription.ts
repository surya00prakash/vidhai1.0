// models/SuccessSubscription.ts
import mongoose from "mongoose";

const SuccessSubscriptionSchema = new mongoose.Schema(
    {
        subscriptionId: String,
        paymentId: String,
        orderId: String,
        invoiceId: String,
        method: String,
        vpa: String,
        customerId: String,
        tokenId: String,
        rrn: String,
        amount: Number,
        status: String,
        userData: Object, // store donor details
    },
    { timestamps: true }
);

export const SuccessSubscription =
    mongoose.models.SuccessSubscription ||
    mongoose.model("SuccessSubscription", SuccessSubscriptionSchema);
