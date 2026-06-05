"use client";

import dynamic from "next/dynamic";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "./components/home/AboutSection";
import VisionSection from "./components/home/VisionSection";
import FounderMessage from "./components/home/FounderMessage";
import Script from "next/script";

// Lazy-load heavy below-the-fold sections to reduce initial JS bundle
const ProgramsGrid = dynamic(() => import("./components/home/ProgramsGrid"));
const AgaramAchievers = dynamic(() => import("./components/home/AgaramAchievers"));
const SuccessStoriesCarousel = dynamic(() => import("./components/home/SuccessStoriesSection"));
const CounterSection = dynamic(() => import("./components/home/CounterSection"));

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <AboutSection />
            <VisionSection />
            <FounderMessage />
            <ProgramsGrid />
            <AgaramAchievers />
            <SuccessStoriesCarousel />
            <CounterSection />
            <Script
                id="zsiqscript"
                src="https://salesiq.zohopublic.com/widget?wc=siq32630185bdbd9d073855411a60009ef635b5ebfdaf6a749df177117901d0b15b"
                strategy="lazyOnload"
            />
        </>
    );
}
