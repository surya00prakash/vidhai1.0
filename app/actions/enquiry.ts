"use server";

import { connectDB } from "@/lib/mongoose";
import Enquiry from "@/models/Enquiry";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d][\d\s()-]{7,15}$/;

export type EnquiryResult = {
  success: boolean;
  error?: string;
};

export async function submitEnquiry(formData: FormData): Promise<EnquiryResult> {
  const name = formData.get("name") as string | null;
  const phone = formData.get("phone") as string | null;
  const email = formData.get("email") as string | null;
  const message = formData.get("message") as string | null;
  const consent = formData.get("consent") === "on";

  // Input validation
  const errors: string[] = [];
  if (!name || name.trim().length < 2) {
    errors.push("Name is required (min 2 characters)");
  }
  if (!email || !EMAIL_RE.test(email)) {
    errors.push("Valid email is required");
  }
  if (!phone || !PHONE_RE.test(phone)) {
    errors.push("Valid phone number is required");
  }
  if (!message || message.trim().length < 5) {
    errors.push("Message is required (min 5 characters)");
  }

  if (errors.length > 0) {
    return { success: false, error: errors.join(", ") };
  }

  try {
    await connectDB();

    await Enquiry.create({
      name: name!.trim(),
      phone: phone!.trim(),
      email: email!.trim().toLowerCase(),
      message: message!.trim(),
      consent,
    });

    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: "Failed to submit enquiry. Please try again.",
    };
  }
}
