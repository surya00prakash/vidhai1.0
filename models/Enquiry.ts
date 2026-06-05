import mongoose, { Schema, Document, models } from "mongoose";

export interface IEnquiry extends Document {
    name: string;
    phone: string;
    email?: string;
    message: string;
    consent: boolean;
    createdAt: Date;
}

const enquirySchema = new Schema<IEnquiry>(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String },
        message: { type: String, required: true },
        consent: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const Enquiry = models.Enquiry || mongoose.model<IEnquiry>("Enquiry", enquirySchema);

export default Enquiry;
