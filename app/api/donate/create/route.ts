import { connectDB } from "@/lib/mongoose";
import { Donation } from "@/models/Donation"; // Make sure this path is correct
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  const data = await req.json();

  try {
    await Donation.create({
      ...data,
      paymentId: "",
      status: "pending",
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
