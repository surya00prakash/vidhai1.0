"use client";

import React, { useRef, useEffect } from "react";
import { Partner } from "@/types/partners";
import { Card, Chip, Image } from "@heroui/react";

export interface InfiniteCarouselProps {
    data: Partner[];
    title: string;
    speed?: "normal" | "slow" | "fast";
}

const InfiniteCarousel: React.FC<InfiniteCarouselProps> = ({
    data,
    title,
    speed = "normal",
}) => {
    const scrollTopRef = useRef<HTMLDivElement | null>(null);
    const scrollBottomRef = useRef<HTMLDivElement | null>(null);

    const getSpeedValue = (sp: "normal" | "slow" | "fast") =>
        sp === "slow" ? 0.3 : sp === "fast" ? 1.2 : 0.6;

    const scrollSpeed = getSpeedValue(speed);

    // Shared infinite scroll logic
    const useInfiniteScroll = (
        ref: React.RefObject<HTMLDivElement | null>,
        direction: "left" | "right",
        speedPx: number
    ) => {
        useEffect(() => {
            const el = ref.current;
            if (!el) return;

            let offset = direction === "right" ? -el.scrollWidth / 2 : 0;
            let frameId: number;

            const scroll = () => {
                if (!el) return;

                offset += direction === "left" ? -speedPx : speedPx;

                const half = el.scrollWidth / 2;

                if (direction === "left" && Math.abs(offset) >= half) {
                    offset = 0;
                } else if (direction === "right" && offset >= 0) {
                    offset = -half;
                }

                el.style.transform = `translate3d(${offset}px, 0, 0)`;
                frameId = requestAnimationFrame(scroll);
            };

            frameId = requestAnimationFrame(scroll);

            return () => cancelAnimationFrame(frameId);
        }, [ref, direction, speedPx]);
    };

    useInfiniteScroll(scrollTopRef, "left", scrollSpeed);
    useInfiniteScroll(scrollBottomRef, "right", scrollSpeed);

    const duplicatedData = [...data, ...data];

    const renderCarousel = (
        ref: React.RefObject<HTMLDivElement | null>,
        keyPrefix: string
    ) => (
        <div className="overflow-hidden w-full [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
            <div ref={ref} className="flex gap-4 w-max">
                {duplicatedData.map((partner, index) => (
                    <Card
                        key={`${keyPrefix}-${partner.name}-${index}`}
                        className="bg-white rounded-2xl shadow-none p-4 flex flex-col justify-between border-2 border-gray-300 flex-shrink-0 w-72"
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div>
                                <h3 className="text-md font-semibold">{partner.name}</h3>
                                <p className="text-sm text-default-800">{partner.location}</p>
                            </div>
                        </div>
                        <div className="text-center mt-2">
                            <Chip variant="dot" color="primary">
                                {partner.types}
                            </Chip>
                        </div>
                        {(partner.totalStudents || partner.currentStudents) && (
                            <div className="grid grid-cols-2 gap-4 pt-4 mt-4 border-t border-gray-100 text-sm text-gray-700">
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">Current Students</p>
                                    <p className="text-primary text-lg font-bold">
                                        {partner.currentStudents ?? "—"}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">Total Students</p>
                                    <p className="text-primary text-lg font-bold">
                                        {partner.totalStudents ?? "—"}
                                    </p>
                                </div>
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );

    return (
        <div className="w-full py-8 space-y-10">
            <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-center text-secondary mb-12">
                    {title}
                </h2>
                {renderCarousel(scrollTopRef, "top")}
            </div>
            <div>{renderCarousel(scrollBottomRef, "bottom")}</div>
        </div>
    );
};

export default InfiniteCarousel;
