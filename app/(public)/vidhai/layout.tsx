import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Vidhai Program | Agaram Foundation",
    description:
        "Learn about the Vidhai Program by Agaram Foundation — supporting students from rural communities with college education, mentorship, and hostel facilities.",
    openGraph: {
        title: "Vidhai Program | Agaram Foundation",
        description:
            "Learn about the Vidhai Program supporting students from rural communities.",
    },
};

export default function VidhaiLayout({ children }: { children: React.ReactNode }) {
    return children;
}
