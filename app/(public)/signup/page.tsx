"use client";

import React, { JSX, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage(): JSX.Element {
    const router = useRouter();
    const [step, setStep] = useState<"signup" | "otp">("signup");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState<string>("");
    const [loading, setLoading] = useState(false);

    // If already logged in, go straight to profile
    useEffect(() => {
        if (typeof window === "undefined") return;
        const existingUser = localStorage.getItem("ag_user_id");
        if (existingUser) {
            router.replace("/profile");
        }
    }, [router]);

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage("Creating account...");
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    phoneNumber: phone,
                    countryCode: "+91",
                    deviceType: "2",
                }),
            });

            if (!res.ok) {
                const err = await res.json().catch(() => null);
                throw new Error(err?.message ?? "Signup failed. Please try again.");
            }

            const otpRes = await fetch("/api/auth/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contactType: "Email", contactValue: email }),
            });

            if (!otpRes.ok) {
                const err = await otpRes.json().catch(() => null);
                throw new Error(err?.message ?? "Failed to send OTP.");
            }

            setStep("otp");
            setMessage("OTP sent to your email.");
        } catch (err: any) {
            setMessage(err?.message ?? "Signup failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    async function handleVerifyOtp(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setMessage("Verifying OTP...");
        try {
            const res = await fetch("/api/auth/validate-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contactType: "Email",
                    contactValue: email,
                    otpHash: otp,
                    platform: "web",
                }),
            });

            const j = await res.json().catch(() => null);
            if (!res.ok) throw new Error(j?.message ?? "Invalid OTP. Please try again.");

            const accessToken: string | null =
                j?.accessToken ?? j?.token?.token ?? j?.token ?? null;
            const userId: string | null =
                j?.userId ?? j?.id ?? j?.raw?.userId ?? null;

            if (accessToken) localStorage.setItem("ag_access_token", accessToken);
            if (userId) localStorage.setItem("ag_user_id", userId);

            setMessage("Signup complete. Redirecting...");
            setTimeout(() => router.replace("/profile"), 900);
        } catch (err: any) {
            setMessage(err?.message ?? "OTP verification failed. Try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <h1 className="text-2xl font-semibold text-gray-900 text-center">
                    {step === "signup" ? "Create your Agaram Account" : "Verify OTP"}
                </h1>

                <p className="mt-2 text-sm text-gray-600 text-center">
                    {step === "signup"
                        ? "Enter your details to sign up. We’ll send an OTP to verify your email."
                        : "Please enter the 6-digit OTP sent to your email."}
                </p>

                {step === "signup" && (
                    <form onSubmit={handleSignup} className="mt-8 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Your full name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                required
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="+91 9xxxxxxxxx"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-60"
                        >
                            {loading ? "Please wait…" : "Sign up & Send OTP"}
                        </button>
                    </form>
                )}

                {step === "otp" && (
                    <form onSubmit={handleVerifyOtp} className="mt-8 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Enter OTP</label>
                            <input
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="6-digit code"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-60"
                        >
                            {loading ? "Verifying…" : "Verify OTP"}
                        </button>

                        <button
                            type="button"
                            onClick={async () => {
                                setLoading(true);
                                setMessage("Resending OTP...");
                                try {
                                    const r = await fetch("/api/auth/send-otp", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ contactType: "Email", contactValue: email }),
                                    });
                                    setMessage(r.ok ? "OTP resent." : "Failed to resend OTP.");
                                } catch {
                                    setMessage("Network error resending OTP.");
                                } finally {
                                    setLoading(false);
                                    setTimeout(() => setMessage(""), 3000);
                                }
                            }}
                            className="w-full py-2 rounded-md border text-gray-700 bg-white hover:bg-gray-50 transition"
                        >
                            Resend OTP
                        </button>
                    </form>
                )}

                {message && <p className="mt-6 text-center text-sm text-gray-700">{message}</p>}
            </div>
        </div>
    );
}
