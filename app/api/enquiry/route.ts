import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Enquiry from "@/models/Enquiry";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d][\d\s()-]{7,15}$/;

export async function POST(req: Request) {
    try {
        const body = await req.json().catch(() => null);

        if (!body) {
            return NextResponse.json(
                { success: false, error: "Invalid request body" },
                { status: 400 },
            );
        }

        const { name, phone, email, message, consent } = body;

        // Input validation
        const errors: string[] = [];
        if (!name || typeof name !== "string" || name.trim().length < 2) {
            errors.push("Name is required (min 2 characters)");
        }
        if (!email || !EMAIL_RE.test(email)) {
            errors.push("Valid email is required");
        }
        if (!phone || !PHONE_RE.test(phone)) {
            errors.push("Valid phone number is required");
        }
        if (!message || typeof message !== "string" || message.trim().length < 5) {
            errors.push("Message is required (min 5 characters)");
        }

        if (errors.length > 0) {
            return NextResponse.json(
                { success: false, error: errors.join(", ") },
                { status: 400 },
            );
        }

        await connectDB();

        const newEnquiry = await Enquiry.create({
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim().toLowerCase(),
            message: message.trim(),
            consent: !!consent,
        });

        return NextResponse.json({ success: true, data: newEnquiry }, { status: 201 });
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ success: false, error: msg }, { status: 500 });
    }
}
