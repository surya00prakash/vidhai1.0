import { sponsorshipOptions } from "@/components/donations/SponsorshipSelector";
import { DonationItem } from "@/types/DonationTypes";

// Reccuring Durations
export const duration = [
    { key: "12", label: "12 Months" },
    { key: "24", label: "24 Months" },
    { key: "36", label: "36 Months" },
    { key: "48", label: "48 Months" },
    { key: "60", label: "60 Months" },
    { key: "72", label: "72 Months" },
    { key: "84", label: "84 Months" },
    { key: "100", label: "100 Months" },
];

export const sponsorshipItems = sponsorshipOptions.map((s) => ({
    id: s.id,
    name: s.label,
    label: s.label,
    amount: s.monthlyAmount, // temporary fallback
    isCustom: false,
}));



// Monthly Payment Options
export const maadhamOptions: DonationItem[] = [
    { id: "300", label: "₹300/-", amount: 300, name: "Maadham Donation" },
];

export const academicOptions: DonationItem[] = [
    { id: "500", label: "₹500/-", amount: 500, name: "Academic Support - Basic" },
    { id: "1000", label: "₹1000/-", amount: 1000, name: "Academic Support - Standard" },
    { id: "2000", label: "₹2000/-", amount: 2000, name: "Academic Support - Extended" },
    { id: "3000", label: "₹3000/-", amount: 3000, name: "Academic Support - Extended" }

];


// One-Time Payment Options
export const donationOptions: DonationItem[] = [
    { id: "2000", label: "₹2000/-", amount: 2000, name: "One-Time Donation" },
    { id: "5000", label: "₹5000/-", amount: 5000, name: "One-Time Donation" },
    { id: "7000", label: "₹7000/-", amount: 7000, name: "One-Time Donation" },
    { id: "custom-academic-once", label: "Enter Custom Amount", name: "Custom Amount Donation", amount: 0, isCustom: true },

];

export const fulldonationOptions: DonationItem[] = [
    {
        id: "250000", label: "₹250000/-", amount: 250000, name: "Arts and Humanities Student - Full Course", detail:
            "Arts and Humanities Student - Full Course",
    },
    {
        id: "450000", label: "₹450000/-", amount: 450000, name: "Professional Courses - Full Course", detail:
            "Professional Courses - Full Course",
    }

];

export const learningOptions = [
    {
        id: "learning-dev",
        name: "Learning & Development Sponsorship",
        label: "₹10000/-",
        amount: 10000,
        detail: "Learning & Development Sponsorship",
        isCustom: false,
    },
];

export const collectiveOptions = [
    {
        id: "collective-impact",
        name: "Collective Impact: Support the Education of 10 Students",
        label: "₹500000/-",
        amount: 500000,
        detail:
            "Collective Impact: Support the Education of 10 Students",
        isCustom: false,
    },
];


export const corpusOptions: DonationItem[] = [
    {
        id: "corpus-500000",
        label: "₹500000",
        detail: "Long-term Support",
        amount: 500000,
        name: "Corpus Fund - Long-Term",
    },
    {
        id: "corpus-1000000",
        label: "₹1000000",
        detail: "Legacy Impact",
        amount: 1000000,
        name: "Corpus Fund - Legacy",
    },
];

// Combined list
export const allItems: DonationItem[] = [
    ...donationOptions,
    ...corpusOptions,
    ...maadhamOptions,
    ...academicOptions,
    ...sponsorshipItems,
    ...fulldonationOptions,
    ...learningOptions,
    ...collectiveOptions,
    ...sponsorshipItems,

];
export type { DonationItem };

