import { connectDB } from "@/lib/mongoose";
import { Volunteer } from "@/models/Volunteers";
import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
    try {
        const data = await req.json().catch(() => null);

        if (!data) {
            return NextResponse.json(
                { message: "Invalid request body" },
                { status: 400 },
            );
        }

        const requiredFields = [
            "name",
            "email",
            "phone",
            "country",
            "state",
            "city",
            "address",
            "pincode",
            "relevantSkills",
            "languages",
            "attendedTraining",
            "agreedToTerms",
        ];

        const missingFields = requiredFields.filter((field) => {
            const value = data[field];
            if (typeof value === "string") return !value.trim();
            if (typeof value === "boolean") return false;
            if (Array.isArray(value)) return value.length === 0;
            return value === undefined || value === null;
        });

        if (missingFields.length > 0) {
            return NextResponse.json(
                { message: `Missing required fields: ${missingFields.join(", ")}` },
                { status: 400 },
            );
        }

        // Validate email format
        if (!EMAIL_RE.test(data.email)) {
            return NextResponse.json(
                { message: "Invalid email format" },
                { status: 400 },
            );
        }

        // Must agree to terms
        if (data.agreedToTerms !== true) {
            return NextResponse.json(
                { message: "You must agree to the terms and conditions" },
                { status: 400 },
            );
        }

        await connectDB();

        const saved = await Volunteer.create({
            ...data,
            name: data.name.trim(),
            email: data.email.trim().toLowerCase(),
            phone: data.phone.trim(),
        });

        return NextResponse.json(saved, { status: 201 });
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json(
            { message: "Error submitting volunteer form", error: msg },
            { status: 500 },
        );
    }
}
