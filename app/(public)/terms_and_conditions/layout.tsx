import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms and Conditions | Agaram Foundation",
    description:
        "Read the terms and conditions for using the Agaram Foundation website, including copyright, personal information, and content usage policies.",
    openGraph: {
        title: "Terms and Conditions | Agaram Foundation",
        description:
            "Read the terms and conditions for using the Agaram Foundation website.",
    },
};

export default function TermsAndConditionsLayout({ children }: { children: React.ReactNode }) {
    return children;
}
