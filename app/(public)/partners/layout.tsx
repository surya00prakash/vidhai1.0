import type { Metadata } from "next";
import PartnersLayoutClient from "./PartnersLayoutClient";

export const metadata: Metadata = {
    title: "Our Partners | Agaram Foundation",
    description:
        "Meet the educational institutions, corporate partners, and organizations that collaborate with Agaram Foundation to empower students through education.",
    openGraph: {
        title: "Our Partners | Agaram Foundation",
        description:
            "Meet the partners who collaborate with Agaram Foundation for education.",
    },
};

export default function PartnersLayout({ children }: { children: React.ReactNode }) {
    return <PartnersLayoutClient>{children}</PartnersLayoutClient>;
}
