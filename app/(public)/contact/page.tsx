import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
    title: "Contact Us | Agaram Foundation",
    description:
        "Get in touch with Agaram Foundation. Reach out for inquiries about our mission, programs, donations, or how you can contribute to changing lives through education.",
    openGraph: {
        title: "Contact Us | Agaram Foundation",
        description:
            "Get in touch with Agaram Foundation for inquiries about our mission, programs, and donations.",
    },
};

export default function ContactPage() {
    return <ContactForm />;
}
