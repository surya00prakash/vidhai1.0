"use client";

import { Card, CardHeader, Button } from "@heroui/react";
import { sponsorshipOptions } from "./SponsorshipSelector";
import { DonationItem } from "@/types/DonationTypes";

type Props = {
    selectedItemsDetails: DonationItem[];
    itemCounts: Record<string, number>;
    customAmounts: Record<string, string>;
    selectedType: "once" | "monthly";
    duration: string;
    onContinue: () => void;
};

export default function SummaryBar({
    selectedItemsDetails,
    itemCounts,
    customAmounts,
    selectedType,
    duration,
    onContinue,
}: Props) {
    const totalAmount = selectedItemsDetails.reduce((sum, item) => {
        const quantity = itemCounts?.[item.id] ?? 1;

        const sponsor = sponsorshipOptions.find((s) => s.id === item.id);
        if (sponsor) {
            const sponsorAmount =
                selectedType === "once"
                    ? sponsor.onceAmounts[duration as keyof typeof sponsor.onceAmounts] || 0
                    : sponsor.monthlyAmount;
            return sum + sponsorAmount * quantity;
        }

        const amount = item.isCustom
            ? parseInt(customAmounts[item.id] || "0", 10)
            : item.amount;

        return sum + amount * quantity;
    }, 0);

    return (
        <Card className="fixed bottom-0 right-0 z-50 w-full md:w-[60%] xl:w-[62%] shadow-md border-t border-default-200 !rounded-b-none rounded-lg bg-white">
            <CardHeader className="flex justify-between items-center px-4 py-3">
                <div className="flex flex-col space-y-0.5">
                    <small className="text-default-500 text-sm">Total Donation Amount</small>
                    <span className="text-2xl font-semibold text-primary">
                        ₹{totalAmount.toLocaleString("en-IN")}
                    </span>
                </div>
                <Button color="primary" onPress={onContinue}>
                    Continue
                </Button>
            </CardHeader>
        </Card>
    );
}
