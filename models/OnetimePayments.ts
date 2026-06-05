import mongoose from "mongoose";

const OnetimePaymentsSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        pan: { type: String, required: true },
        amount: { type: Number, required: true },
        doorNo: { type: String, required: true },
        streetName: { type: String, required: true },
        taluk: { type: String, required: true },
        district: { type: String, required: true },
        pincode: { type: String, required: true },
        frequency: String,
        gateway: String,
        txnid: String,
        paymentId: { type: String },
        status: { type: String, default: "pending" },
        orderId: { type: String },
        isAlumni: { type: Boolean, default: false },

        agaramVidhaiYear: {
            type: String,
            required: function (this: any) {
                return this.isAlumni === true;
            },
        },
        collegeName: {
            type: String,
            required: function (this: any) {
                return this.isAlumni === true;
            },
        },
    },
    { timestamps: true }
);

OnetimePaymentsSchema.index({ email: 1 });
OnetimePaymentsSchema.index({ status: 1 });
OnetimePaymentsSchema.index({ txnid: 1 });

export const OnetimePayments =
    mongoose.models.OnetimePayments || mongoose.model("OnetimePayments", OnetimePaymentsSchema);
