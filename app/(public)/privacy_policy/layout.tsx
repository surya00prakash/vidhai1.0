import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | Agaram Foundation",
    description:
        "Learn how Agaram Foundation protects your privacy, handles donor information, and maintains data confidentiality.",
    openGraph: {
        title: "Privacy Policy | Agaram Foundation",
        description:
            "Learn how Agaram Foundation protects your privacy and handles donor information.",
    },
};

export default function PrivacyPolicyLayout({ children }: { children: React.ReactNode }) {
    return children;
}
