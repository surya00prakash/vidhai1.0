// models/TechIntership.ts
import mongoose from "mongoose"

const TechIntershipSchema = new mongoose.Schema({
    fullname: { type: String, required: true, trim: true },
    name: { type: String },
    email: { type: String, required: true, trim: true, lowercase: true },
    mobile: { type: String, required: true, trim: true },
    year: { type: String },
    degree: { type: String },
    motivation: { type: String },
    resume: {
        id: { type: String }, // GridFS file id (string)
        filename: { type: String },
        contentType: { type: String },
        length: { type: Number },
    },
}, { timestamps: true })

export default (mongoose.models.TechIntership as mongoose.Model<any>) ||
    mongoose.model("TechIntership", TechIntershipSchema)
