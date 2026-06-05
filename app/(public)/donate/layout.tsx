import type { Metadata } from "next";
import DonateLayoutClient from "./DonateLayoutClient";

export const metadata: Metadata = {
    title: "Donate | Agaram Foundation",
    description:
        "Make a donation to Agaram Foundation and help provide quality education to underprivileged students across Tamil Nadu. Every contribution transforms lives.",
    openGraph: {
        title: "Donate | Agaram Foundation",
        description:
            "Make a donation to help provide quality education to underprivileged students.",
    },
};

export default function DonateLayout({ children }: { children: React.ReactNode }) {
    return <DonateLayoutClient>{children}</DonateLayoutClient>;
}
