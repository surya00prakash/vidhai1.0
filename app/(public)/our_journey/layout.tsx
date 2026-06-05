import type { Metadata } from "next";
import JourneyLayoutClient from "./JourneyLayoutClient";

export const metadata: Metadata = {
    title: "Our Journey | Agaram Foundation",
    description:
        "Explore the journey of Agaram Foundation from its inception to becoming a leading education NGO in Tamil Nadu, transforming thousands of lives.",
    openGraph: {
        title: "Our Journey | Agaram Foundation",
        description:
            "Explore the journey of Agaram Foundation from inception to impact.",
    },
};

export default function OurJourneyLayout({ children }: { children: React.ReactNode }) {
    return <JourneyLayoutClient>{children}</JourneyLayoutClient>;
}
