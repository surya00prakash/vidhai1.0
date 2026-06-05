import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login | Agaram Foundation",
    description:
        "Log in to your Agaram Foundation account to manage your donations and profile.",
    robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return children;
}
