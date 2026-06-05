// models/FailedSubscription.ts
import mongoose from "mongoose";

const FailedSubscriptionSchema = new mongoose.Schema(
    {
        subscriptionId: String,
        paymentId: String,
        reason: String,
        status: String,
        userData: Object,
        rawWebhook: Object,
    },
    { timestamps: true }
);

export const FailedSubscription =
    mongoose.models.FailedSubscription ||
    mongoose.model("FailedSubscription", FailedSubscriptionSchema);
