"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const images = [
    "/assets/images/journey/our_journey(1).jpg",
    "/assets/images/journey/our_journey(2).jpg",
    "/assets/images/journey/our_journey(3).jpg",
    "/assets/images/journey/our_journey(4).jpg",
    "/assets/images/journey/our_journey(5).jpg",
    "/assets/images/journey/our_journey(6).jpg",
    "/assets/images/journey/our_journey(7).jpg",
    "/assets/images/journey/our_journey(8).jpg",
    "/assets/images/journey/our_journey(9).jpg",
    "/assets/images/journey/our_journey(10).jpg",
    "/assets/images/journey/our_journey(11).jpg",
    "/assets/images/journey/our_journey(12).jpg",
    "/assets/images/journey/our_journey(13).jpg",
    "/assets/images/journey/our_journey(14).jpg",
];

const COLUMN_COUNT = 3;

const shuffleArray = (array: string[]) => {
    return [...array].sort(() => Math.random() - 0.5);
};

export default function AlternatingScrollCarousel() {
    const columnImages: string[][] = Array.from({ length: COLUMN_COUNT }, () =>
        shuffleArray(images)
    );

    return (
        <div className="w-full max-w-screen-xl mx-auto px-4 py-12">
            {/* Container with mask gradient on top and bottom */}
            <div
                className="grid grid-cols-3 gap-4 h-[500px] overflow-hidden relative"
                style={{
                    maskImage:
                        "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
                    WebkitMaskImage:
                        "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
                }}
            >
                {columnImages.map((column, colIdx) => {
                    const scrollSpeed = 20 + colIdx * 3;

                    return (
                        <div key={colIdx} className="relative h-full overflow-hidden">
                            <motion.div
                                className="flex flex-col gap-6"
                                animate={{ y: [0, -1000] }}
                                transition={{
                                    duration: scrollSpeed,
                                    repeat: Infinity,
                                    ease: "linear",
                                }}
                                style={{ willChange: "transform" }}
                            >
                                {[...column, ...column, ...column].map((img, idx) => (
                                    <div
                                        key={`${colIdx}-${idx}`}
                                        className="relative w-full aspect-[4/5] overflow-hidden rounded-xl shadow-md"
                                    >
                                        <Image
                                            src={img}
                                            alt={`carousel-image-${colIdx}-${idx}`}
                                            fill
                                            style={{ objectFit: "cover" }}
                                            className="rounded"
                                        />
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
