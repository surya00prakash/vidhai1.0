// models/CorporateDonor.ts
import mongoose from "mongoose";

const CorporateDonorSchema = new mongoose.Schema(
    {
        corporateName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        contactPerson: { type: String, required: true },
        address: { type: String, required: true },
        country: { type: String, required: true },
        state: { type: String, required: true },
        city: { type: String, required: true },
        pincode: { type: String, required: true },
        website: { type: String },
        industry: { type: String, required: true },
        supportTypes: [{ type: String, required: true }],
        referral: { type: String },
        comments: { type: String },
        agreed: { type: Boolean, required: true }
    },
    { timestamps: true }
);

// Indexes
CorporateDonorSchema.index({ email: 1 });
CorporateDonorSchema.index({ corporateName: 1 });

export const CorporateDonor =
    mongoose.models.CorporateDonor ||
    mongoose.model("CorporateDonor", CorporateDonorSchema);
