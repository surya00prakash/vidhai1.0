"use client";

import React from "react";
import { motion } from "framer-motion";

const videos = [
    "https://www.youtube.com/embed/F6YtHAZ2uR4",
    "https://www.youtube.com/embed/WUfT9elbI-k",
    "https://www.youtube.com/embed/PvS_7NPg3GY",
    "https://www.youtube.com/embed/_wsqNLUy3eM"
];

export default function YouTubeCardCarousel() {
    return (
        <section className="py-12 px-4 bg-white">
            <h2 className="text-4xl font-semibold text-center mb-8 text-gray-800">
                The Face of Change
            </h2>
            <div className="flex flex-wrap justify-center gap-6 px-4">
                {videos.map((src, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ scale: 1.05 }}
                        className="w-full max-w-sm rounded-md overflow-hidden shadow-lg bg-white"
                    >
                        <iframe
                            className="w-full h-60 md:h-72"
                            src={src}
                            title={`YouTube video ${i + 1}`}
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
