"use client";

import React, { useRef, useEffect } from "react";
import { Card, Image } from "@heroui/react";
import { corporate_partners as data } from "@/data/partners";

const CorporatePartners = () => {
    const scrollRef = useRef<HTMLDivElement | null>(null);
    const speed = "slow";

    const getSpeed = (sp: "normal" | "slow" | "fast") =>
        sp === "slow" ? 0.3 : sp === "fast" ? 1.2 : 0.6;

    const useInfiniteScroll = (
        ref: React.RefObject<HTMLDivElement | null>,
        direction: "left" | "right",
        speedPx: number
    ) => {
        useEffect(() => {
            const el = ref.current;
            if (!el) return;

            let offset = 0;
            let animationFrameId: number;

            const scroll = () => {
                offset += direction === "left" ? -speedPx : speedPx;
                if (Math.abs(offset) >= el.scrollWidth / 2) {
                    offset = 0;
                }

                el.style.transform = `translateX(${offset}px)`;
                animationFrameId = requestAnimationFrame(scroll);
            };

            animationFrameId = requestAnimationFrame(scroll);
            return () => cancelAnimationFrame(animationFrameId);
        }, [ref, direction, speedPx]);
    };

    const scrollSpeed = getSpeed(speed);
    const duplicatedData = [...data, ...data];

    useInfiniteScroll(scrollRef, "left", scrollSpeed);

    return (
        <div className="w-full py-8 space-y-20">
            <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-center text-secondary mb-12">
                    Corporate Partners
                </h2>
                <div className="overflow-hidden w-full [mask-image:linear-gradient(to_right,transparent,white_10%,white_90%,transparent)]">
                    <div ref={scrollRef} className="flex gap-8 w-max">
                        {duplicatedData.map((partner, index) => (
                            <Card
                                key={index}
                                className="bg-white rounded-2xl shadow-none flex flex-col justify-between flex-shrink-0 w-45"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <Image
                                        src={
                                            partner.logo ||
                                            "/assets/images/partners/partner_default.png"
                                        }
                                        alt={`${partner.name} Logo`}
                                        width={150}
                                        height={150}
                                        className="object-contain"
                                    />
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CorporatePartners;
