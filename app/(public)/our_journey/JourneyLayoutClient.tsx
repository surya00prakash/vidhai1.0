"use client";
import { ReactNode } from 'react';

export default function JourneyLayoutClient({ children }: { children: ReactNode }) {
    return (
        <div className="w-full">
            {/* Hero Section */}
            <section
                className="relative bg-cover bg-center min-h-[320px] sm:min-h-[420px] lg:min-h-[520px] flex items-center justify-center px-4 sm:px-8"
                style={{ backgroundImage: "url('/assets/images/journey/journey_banner.png')" }}
            >
                <div className="absolute inset-0 bg-black/60 z-0" />
                <div className="relative z-10 max-w-3xl w-full text-center text-white space-y-6 py-10 sm:py-16">
                    <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold">
                        Our Journey
                    </h1>
                    <p className="text-white text-base sm:text-lg lg:text-xl">
                        From humble beginnings to transformational milestones, follow Agaram Foundation&apos;s journey of empowering students through education.
                    </p>
                </div>
            </section>

            <div id="timeline">{children}</div>
        </div>
    );
}
