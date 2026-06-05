// app/api/foreign-donors/route.ts
import { connectDB } from "@/lib/mongoose";
import { ForeignDonor } from "@/models/ForeignDonors";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        await connectDB();

        const data = await req.json();

        const requiredFields = ["firstName", "lastName", "email", "phone", "queryType"];

        const missingFields = requiredFields.filter((field) => {
            const value = data[field];
            if (typeof value === "string") return !value.trim();
            return value === undefined || value === null;
        });

        if (missingFields.length > 0) {
            return NextResponse.json(
                {
                    message: `Missing required fields: ${missingFields.join(", ")}`,
                },
                { status: 400 }
            );
        }

        const savedDonor = await ForeignDonor.create(data);

        return NextResponse.json(savedDonor, { status: 201 });
    } catch (error: any) {
        return NextResponse.json(
            {
                message: "Error submitting foreign donor form",
                error: error.message,
            },
            { status: 500 }
        );
    }
}
