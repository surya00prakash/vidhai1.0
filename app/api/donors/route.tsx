import { connectDB } from "@/lib/mongoose";
import { Donor } from "@/models/Donors"; // Ensure schema is updated accordingly
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        await connectDB();

        const data = await req.json();

        const requiredFields = [
            "firstName",
            "lastName",
            "email",
            "phone",
            "queryType"
        ];

        const missingFields = requiredFields.filter((field) => {
            const value = data[field];
            if (typeof value === "string") return !value.trim();
            return value === undefined || value === null;
        });

        if (missingFields.length > 0) {
            return NextResponse.json(
                { message: `Missing required fields: ${missingFields.join(", ")}` },
                { status: 400 }
            );
        }

        const saved = await Donor.create(data);
        return NextResponse.json(saved, { status: 201 });

    } catch (error: any) {
        return NextResponse.json(
            { message: "Error submitting donor form", error: error.message },
            { status: 500 }
        );
    }
}
