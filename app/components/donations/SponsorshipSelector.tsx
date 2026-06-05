"use client";

import React, { useEffect, useState } from "react";
import { Divider, RadioGroup, Select, SelectItem } from "@heroui/react";
import { cn } from "@heroui/react";

export const sponsorshipOptions = [
    {
        id: "arts",
        label: "Arts and Humanities Students",
        monthlyAmount: 5000,
        onceAmounts: {
            "12": 60000,
            "24": 120000,
            "36": 180000,
        },
        durations: ["12", "24", "36"],
    },
    {
        id: "professional",
        label: "Professional Course Students",
        monthlyAmount: 8500,
        onceAmounts: {
            "12": 100000,
            "24": 200000,
            "36": 300000,
            "48": 400000,
        },
        durations: ["12", "24", "36", "48"],
    },
] as const;

const durationLabels: Record<string, string> = {
    "12": "1 Year",
    "24": "2 Years",
    "36": "3 Years",
    "48": "4 Years",
};

export default function SponsorshipSelector({
    mode,
    selectedId,
    selectedDuration,
    onSelectOption,
    onSelectDuration,
}: {
    mode: "once" | "monthly";
    selectedId: string;
    selectedDuration: string;
    onSelectOption: (id: string) => void;
    onSelectDuration: (duration: string) => void;
}) {
    const [showDurationError, setShowDurationError] = useState(false);

    const selectedOption = sponsorshipOptions.find((opt) => opt.id === selectedId);

    const safeAmount =
        mode === "once" && selectedOption
            ? selectedOption.onceAmounts[selectedDuration as keyof typeof selectedOption.onceAmounts]
            : mode === "monthly"
                ? selectedOption?.monthlyAmount
                : undefined;

    useEffect(() => {
        if (selectedOption && !selectedDuration) {
            const defaultDuration = selectedOption.durations.includes("12")
                ? "12"
                : selectedOption.durations[0];
            onSelectDuration(defaultDuration);
        }
    }, [selectedId]);

    return (
        <div className="space-y-6">
            <RadioGroup value={selectedId} onValueChange={onSelectOption}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {sponsorshipOptions.map((option) => {
                        const isSelected = selectedId === option.id;
                        const showAmount =
                            mode === "monthly"
                                ? `₹${option.monthlyAmount.toLocaleString()} / month`
                                : isSelected && safeAmount !== undefined
                                    ? `₹${safeAmount.toLocaleString()} total`
                                    : null;

                        return (
                            <label
                                key={option.id}
                                htmlFor={option.id}
                                className={cn(
                                    "relative flex items-start gap-3 cursor-pointer rounded-lg border-1 border-default-300 p-4 transition-all",
                                    "hover:border-primary/70",
                                    isSelected && "border-1 border-primary bg-primary-50/10 ring-1 ring-primary/40"
                                )}
                            >
                                {/* Custom radio circle */}
                                <div
                                    className={cn(
                                        "mt-1 w-5 h-5 rounded-full border-1 flex items-center justify-center",
                                        isSelected ? "border-primary bg-primary" : "border-default-300 bg-white"
                                    )}
                                >
                                    {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                                </div>

                                {/* Text content */}
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-default-900">{option.label}</span>
                                    {showAmount && (
                                        <>
                                            <Divider className="my-1" />
                                            <span className="text-sm text-default-600 font-semibold">{showAmount}</span>
                                        </>
                                    )}
                                </div>

                                {/* Hidden input for accessibility */}
                                <input
                                    type="radio"
                                    id={option.id}
                                    name="sponsorship"
                                    value={option.id}
                                    checked={isSelected}
                                    onChange={() => onSelectOption(option.id)}
                                    className="hidden"
                                />
                            </label>
                        );
                    })}
                </div>
            </RadioGroup>

            {/* Duration Selector */}
            {selectedOption?.durations?.length ? (
                <div className="max-w-xs">
                    <Select
                        label="Select Duration"
                        selectedKeys={[selectedDuration]}
                        onSelectionChange={(keys) => {
                            const [key] = Array.from(keys);
                            onSelectDuration(key as string);
                            setShowDurationError(false);
                        }}
                        variant="flat"
                        radius="md"
                        isInvalid={showDurationError}
                        errorMessage={showDurationError ? "Please select a valid duration." : undefined}
                    >
                        {selectedOption.durations.map((d) => (
                            <SelectItem key={d}>{durationLabels[d]}</SelectItem>
                        ))}
                    </Select>
                </div>
            ) : null}
        </div>
    );
}
