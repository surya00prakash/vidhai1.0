"use client";

import { ReactNode } from "react";
import { Image } from "@heroui/react";

export default function DonateLayoutClient({ children }: { children: ReactNode }) {
    return (
        <div className="flex w-full bg-[#f6f6f6]">
            <div className="grid w-full md:grid-cols-7">
                <div className="hidden md:flex fixed top-0 left-0 h-screen md:w-[40%] xl:w-[38%] flex-col items-center justify-between p-6 pt-24 bg-[linear-gradient(-45deg,#ffffff,#00A9B6,#ccf8ff,#00A9B6,#ffffff)] bg-[length:400%_400%] animate-waterFlow">
                    <div className="w-full flex justify-center pt-4">
                        <Image src="/assets/images/logo/agaram_logo.webp" alt="Agaram Foundation Logo" width={100} height={80} />
                    </div>
                    <div className="text-center px-4">
                        <h2 className="text-lg font-semibold text-foreground">Educate. Empower. Elevate.</h2>
                        <p className="text-sm text-default-500 mt-1">Your support helps build a stronger future.</p>
                    </div>
                    <div className="flex-grow flex items-center justify-center">
                        <Image src="/assets/images/agaram-donation-image.webp" width={500} />
                    </div>
                </div>

                <div className="absolute right-0 top-0 h-full w-full md:w-[60%] xl:w-[62%] overflow-y-auto px-2 md:px-10 lg:px-12 py-10 space-y-6 bg-primary-100 pt-25">
                    {children}
                </div>
            </div>
        </div>
    );
}
