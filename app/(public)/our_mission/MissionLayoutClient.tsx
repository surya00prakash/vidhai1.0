"use client";
import { ReactNode } from 'react';

export default function MissionLayoutClient({ children }: { children: ReactNode }) {
    return (
        <div className="w-full">
            {/* Hero Section */}
            <section
                className="relative bg-cover bg-center min-h-[320px] sm:min-h-[420px] lg:min-h-[520px] flex items-center justify-center px-4 sm:px-8"
                style={{ backgroundImage: "url('/assets/images/mission/mission_banner.png')" }}
            >
                <div className="absolute inset-0 bg-black/60 z-0" />
                <div className="relative z-10 max-w-3xl w-full text-center text-white space-y-6 py-10 sm:py-16">
                    <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold">
                        Our Mission
                    </h1>
                    <p className="text-white text-base sm:text-lg lg:text-xl">
                        Strive to bridge the gap between deserving students and quality education. Build a new generation of responsible youth with education, values, commitment & dedication to society.
                    </p>
                </div>
            </section>

            <div id="timeline">{children}</div>
        </div>
    );
}
