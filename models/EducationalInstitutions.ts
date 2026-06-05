import mongoose from "mongoose";

const EducationalInstitutionDonorSchema = new mongoose.Schema(
    {
        collegeName: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        contactPerson: { type: String, required: true },
        address: { type: String, required: true },
        country: { type: String, required: true },
        state: { type: String, required: true },
        city: { type: String, required: true },
        pincode: { type: String, required: true },
        website: { type: String },
        supportTypes: [{ type: String, required: true }],
        inquiry: { type: String },
        agreed: { type: Boolean, required: true }
    },
    { timestamps: true }
);

// Indexes
EducationalInstitutionDonorSchema.index({ email: 1 });
EducationalInstitutionDonorSchema.index({ collegeName: 1 });

export const EducationalInstitutionDonor =
    mongoose.models.EducationalInstitutionDonor ||
    mongoose.model("EducationalInstitutionDonor", EducationalInstitutionDonorSchema);
