// models/ForeignDonor.ts
import mongoose from "mongoose";

const foreignDonorSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        queryType: {
            type: String,
            enum: ["Receipt", "Enquiry", "Others"],
            required: true,
        },
        inquiry: { type: String },
    },
    {
        timestamps: true,
        collection: "foreign_donors", // <-- 👈 explicitly name the collection
    }
);

// Important: use a unique model name and unique collection name
export const ForeignDonor =
    mongoose.models.ForeignDonor ||
    mongoose.model("ForeignDonor", foreignDonorSchema)

