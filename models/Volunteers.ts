import mongoose from "mongoose";

const VolunteerSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        gender: { type: String },
        dateOfBirth: { type: Date },

        country: { type: String, required: true },
        state: { type: String, required: true },
        city: { type: String, required: true },
        address: { type: String, required: true },
        pincode: { type: String, required: true },

        commCountry: { type: String },
        commState: { type: String },
        commCity: { type: String },
        commAddress: { type: String },
        commPincode: { type: String },

        sameAsPermanent: { type: Boolean, required: true },

        relevantSkills: { type: String, required: true },
        previousExperience: { type: String },
        languages: { type: [String] },

        attendedTraining: { type: Boolean, required: true },
        agreedToTerms: { type: Boolean, required: true }
    },
    { timestamps: true }
);

export const Volunteer =
    mongoose.models.Volunteer || mongoose.model("Volunteer", VolunteerSchema);
