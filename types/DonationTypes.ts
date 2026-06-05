export type DonationItem = {
    id: string;
    label: string;
    amount: number;
    detail?: string;
    duration?: number;
    name: string;
    isCustom?: boolean;
};
