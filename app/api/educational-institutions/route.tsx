import { connectDB } from "@/lib/mongoose";
import { EducationalInstitutionDonor } from "@/models/EducationalInstitutions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        await connectDB();

        const data = await req.json();

        const requiredFields = [
            "collegeName", "email", "phone", "contactPerson",
            "address", "country", "state", "city", "pincode",
            "supportTypes", "agreed"
        ];

        const missingFields = requiredFields.filter((field) => {
            const value = data[field];
            if (typeof value === "string") return !value.trim();
            if (Array.isArray(value)) return value.length === 0;
            if (typeof value === "boolean") return value === false;
            return value === undefined || value === null;
        });

        if (missingFields.length > 0) {
            return NextResponse.json(
                { message: `Missing required fields: ${missingFields.join(", ")}` },
                { status: 400 }
            );
        }

        const savedDonor = await EducationalInstitutionDonor.create(data);

        return NextResponse.json(savedDonor, { status: 201 });

    } catch (error: any) {
        return NextResponse.json(
            { message: "Error submitting form", error: error.message },
            { status: 500 }
        );
    }
}
