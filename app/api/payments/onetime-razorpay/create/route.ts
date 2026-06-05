import { connectDB } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { OnetimePayments } from '@/models/OnetimePayments';

export async function POST(req: Request) {
    await connectDB();

    const data = await req.json();

    try {
        await OnetimePayments.create({
            ...data,
            paymentId: "",
            orderId: "",
            status: "pending",
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to save" }, { status: 500 });
    }
}
