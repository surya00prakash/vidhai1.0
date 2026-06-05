import mongoose from "mongoose";

const donorSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    queryType: { type: String, enum: ["Receipt", "Enquiry", "Others"], required: true },
    inquiry: { type: String }, // optional
  },
  {
    timestamps: true,
  }
);

export const Donor = mongoose.models.Donor || mongoose.model("Donor", donorSchema);
