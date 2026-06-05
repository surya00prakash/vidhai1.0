import type { Metadata } from "next";
import MissionLayoutClient from "./MissionLayoutClient";

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

export default function OurMissionLayout({ children }: { children: React.ReactNode }) {
    return <MissionLayoutClient>{children}</MissionLayoutClient>;
}
