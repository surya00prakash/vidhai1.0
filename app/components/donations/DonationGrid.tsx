"use client";

import { RadioGroup } from "@heroui/react";
import { CustomRadioCard } from "./DonationCard";
import { DonationItem } from "@/types/DonationTypes";

export default function DonationGrid({
    items,
    selectedItems,
    toggleItem,
    withDetail = false,
    customAmounts,
    onCustomAmountChange,
    increase,
    decrease,
    itemCounts,
}: {
    items: DonationItem[];
    selectedItems: string[];
    toggleItem: (id: string) => void;
    withDetail?: boolean;
    customAmounts?: Record<string, string>;
    onCustomAmountChange?: (id: string, value: string) => void;
    increase?: (id: string) => void;
    decrease?: (id: string) => void;
    itemCounts?: Record<string, number>;
}) {
    const selectedId = selectedItems[0] || "";

    return (
        <RadioGroup value={selectedId} onValueChange={toggleItem}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                    <CustomRadioCard
                        key={item.id}
                        item={item}
                        value={item.id}
                        isSelected={selectedId === item.id}
                        withDetail={withDetail}
                        customAmount={customAmounts?.[item.id] || ""}
                        onCustomAmountChange={onCustomAmountChange}
                        onSelect={toggleItem}
                        increase={increase}
                        decrease={decrease}
                        itemCounts={itemCounts}
                    />
                ))}
            </div>
        </RadioGroup>
    );
}
