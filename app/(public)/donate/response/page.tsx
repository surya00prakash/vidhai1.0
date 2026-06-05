"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { Alert, Card, CardBody } from "@heroui/react";
import { LuInfo, LuMail } from "react-icons/lu";

export default function DonateResponsePage() {
    const params = useSearchParams();

    const status = params.get("status");
    const name = params.get("name");
    const email = params.get("email");
    const amount = params.get("amount");

    useEffect(() => {
        if (status === "success") {
            // 🎉 Fire confetti
            const duration = 5 * 1000;
            const end = Date.now() + duration;

            (function frame() {
                confetti({
                    particleCount: 5,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                });
                confetti({
                    particleCount: 5,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            })();
        }
    }, [status]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
            <div
                className={`max-w-lg w-full rounded-2xl p-8 text-center space-y-6 transition-transform duration-500 ${status === "failed" ? "animate-shake" : ""
                    }`}
            >
                {status === "success" ? (
                    <>
                        <div className="text-center space-y-4">
                            {/* Success Heading */}
                            <h1 className="text-3xl font-bold text-green-600 flex items-center justify-center gap-2">
                                🎉 Payment Successful!
                            </h1>

                            {/* Thank You Message */}
                            <p className="text-gray-700 text-lg">
                                Thank you,{" "}
                                <span className="font-semibold text-primary">{name}</span>, for your generous donation of{" "}
                                <span className="font-semibold text-3xl mt-2 text-primary">₹{Number(amount).toLocaleString("en-IN")}</span>
                            </p>

                            <p className="text-gray-600 max-w-lg mx-auto">
                                Your support helps us continue our work and make a real difference!
                            </p>

                            {/* Info Card */}
                            <Card
                                shadow="none"
                                className=" bg-gradient-to-br from-primary-50 to-white rounded-xl max-w-lg mx-auto"
                            >
                                <CardBody className="flex items-start gap-3 text-gray-700 text-sm leading-relaxed">

                                    <div>
                                        <p>
                                            We will send the receipt within{" "}
                                            <span className="font-semibold text-primary-700">7 business days</span> to{" "}
                                            <span className="font-medium text-primary">{email}</span>.
                                        </p>

                                        <p className="mt-3">
                                            If you have any questions, please contact us at{" "}
                                            <a
                                                href="mailto:donorsupport@agaram.in"
                                                className="underline text-primary font-medium"
                                            >
                                                donorsupport@agaram.in
                                            </a>
                                            . We’ll be happy to assist you.
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="text-3xl font-semibold text-red-600">❌ Payment Failed</h1>
                        <p className="text-gray-700 text-lg">
                            Sorry, <span className="font-semibold">{name}</span>. Your payment of{" "}
                            <span className="font-semibold">₹{Number(amount).toLocaleString("en-IN")}</span> could not be processed.
                        </p>
                        <p className="text-gray-600">Please try again later.</p>
                    </>
                )}

                <button
                    className="mt-6 px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-lg hover:scale-105 transform transition-all duration-300"
                    onClick={() => (window.location.href = "/donate")}
                >
                    Back to Donate
                </button>
            </div>

            {/* Tailwind custom animation for failure shake */}
            <style>
                {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-10px); }
            40% { transform: translateX(10px); }
            60% { transform: translateX(-10px); }
            80% { transform: translateX(10px); }
          }
          .animate-shake {
            animation: shake 0.6s ease-in-out;
          }
        `}
            </style>
        </div>
    );
}
