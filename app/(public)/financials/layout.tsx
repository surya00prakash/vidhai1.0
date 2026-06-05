import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Financials | Agaram Foundation",
    description:
        "View the financial reports, audited statements, and transparency records of Agaram Foundation.",
    openGraph: {
        title: "Financials | Agaram Foundation",
        description:
            "View the financial reports and transparency records of Agaram Foundation.",
    },
};

export default function FinancialsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
