import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Profile | Agaram Foundation",
    description: "View your profile and donation history on Agaram Foundation.",
    robots: { index: false, follow: false },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
    return children;
}
