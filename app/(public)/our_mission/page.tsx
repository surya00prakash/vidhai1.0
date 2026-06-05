import type { Metadata } from "next";
import AboutSection from "@/components/mission/AboutSection";
import TrusteeCards from "@/components/mission/TrusteeCards";

export const metadata: Metadata = {
    title: "Our Mission | Agaram Foundation",
    description:
        "Discover the mission and vision of Agaram Foundation — bridging the gap between deserving students and quality education across Tamil Nadu.",
    openGraph: {
        title: "Our Mission | Agaram Foundation",
        description:
            "Discover the mission and vision of Agaram Foundation — bridging the gap between deserving students and quality education.",
    },
};

export default function OurMissionPage() {
    return (
        <div>
            <AboutSection />
            <TrusteeCards />
        </div>
    );
}
