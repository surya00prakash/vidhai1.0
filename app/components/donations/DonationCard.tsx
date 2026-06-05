"use client";

import {
    Divider,
    cn,
    useRadio,
    VisuallyHidden,
    Input,
    Button,
} from "@heroui/react";
import { LuPlus, LuMinus } from "react-icons/lu";
import { useRef } from "react";
import { DonationItem } from "@/types/DonationTypes";

export function CustomRadioCard({
    item,
    isSelected,
    withDetail = false,
    customAmount = "",
    onCustomAmountChange,
    onSelect,
    increase,
    decrease,
    itemCounts = {},
    ...radioProps
}: {
    item: DonationItem;
    isSelected: boolean;
    withDetail?: boolean;
    value: string;
    customAmount?: string;
    onCustomAmountChange?: (id: string, value: string) => void;
    onSelect?: (id: string) => void;
    increase?: (id: string) => void;
    decrease?: (id: string) => void;
    itemCounts?: Record<string, number>;
}) {
    const {
        Component,
        getBaseProps,
        getWrapperProps,
        getInputProps,
        getLabelProps,
        getLabelWrapperProps,
        getControlProps,
    } = useRadio({ ...radioProps });

    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <Component
            {...getBaseProps()}
            onClick={() => onSelect?.(item.id)}
            className={cn(
                "group w-full cursor-pointer border-1 rounded-lg transition-all",
                "flex flex-col justify-between min-h-[50px] p-2",
                isSelected
                    ? "border-primary bg-primary-50/20 ring-1 ring-primary/40"
                    : "border-default-300 hover:border-primary-400"
            )}
        >
            <VisuallyHidden>
                <input {...getInputProps()} ref={inputRef} />
            </VisuallyHidden>

            {withDetail && (
                <>
                    <div className="text-xs text-default-500 mb-2">{item.detail}</div>
                    <Divider className="my-2" />
                </>
            )}

            <div className="flex items-center gap-3 h-full">
                <span {...getWrapperProps()}>
                    <span {...getControlProps()} />
                </span>

                <div
                    {...getLabelWrapperProps()}
                    className="flex-1 flex items-center justify-between"
                >
                    {item.isCustom ? (
                        <Input
                            type="number"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            size="sm"
                            placeholder="Enter Amount (₹)"
                            value={customAmount}
                            onClick={(e) => {
                                e.stopPropagation();
                                inputRef.current?.click();
                            }}
                            onFocus={(e) => {
                                e.stopPropagation();
                                inputRef.current?.click();
                            }}
                            onChange={(e) =>
                                onCustomAmountChange?.(item.id, e.target.value)
                            }
                            classNames={{
                                inputWrapper: "!h-9 !px-2 rounded-md",
                                input: "no-spinner text-sm",
                            }}
                        />
                    ) : (
                        <div className="flex flex-col">
                            <span
                                {...getLabelProps()}
                                className="text-sm font-semibold text-gray-900"
                            >
                                {item.label}
                            </span>

                            {["learning-dev", "collective-impact"].includes(item.id) &&
                                isSelected && (
                                    <div className="mt-2 flex items-center gap-1 bg-default-100 rounded-md px-2 py-1">
                                        <Button
                                            size="sm"
                                            variant="light"
                                            radius="full"
                                            isIconOnly
                                            className="!h-7 !w-7"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                decrease?.(item.id);
                                            }}
                                        >
                                            <LuMinus className="h-4 w-4" />
                                        </Button>

                                        <span className="text-sm font-semibold min-w-[20px] text-center">
                                            {itemCounts?.[item.id] || 1}
                                        </span>

                                        <Button
                                            size="sm"
                                            variant="light"
                                            radius="full"
                                            isIconOnly
                                            className="!h-7 !w-7"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                increase?.(item.id);
                                            }}
                                        >
                                            <LuPlus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                        </div>
                    )}
                </div>
            </div>
        </Component>
    );
}
