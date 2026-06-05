// /app/api/payments/razorpay/update-status/route.ts
import { NextResponse } from "next/server";
import { OnetimePayments } from "@/models/OnetimePayments";
import { connectDB } from "@/lib/mongoose"; // your MongoDB connection util

export async function POST(req: Request) {
    try {
        await connectDB(); // ensure DB is connected

        const { txnid, paymentId, status, orderId } = await req.json();


        if (!txnid || !paymentId || !status) {
            return NextResponse.json(
                { success: false, message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Duplicate paymentId check
        const duplicate = await OnetimePayments.findOne({ paymentId });
        if (duplicate) {
            return NextResponse.json(
                { success: false, message: "Duplicate paymentId detected" },
                { status: 409 }
            );
        }

        // Update donation record by txnid
        const updatedDonation = await OnetimePayments.findOneAndUpdate(
            { txnid },
            {
                $set: {
                    status,
                    paymentId,
                    orderId, // store it here
                    updatedAt: new Date(),
                },
            },
            { new: true }
        );


        if (!updatedDonation) {
            return NextResponse.json(
                { success: false, message: "Donation not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Donation status updated successfully",
                donation: updatedDonation,
            },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
