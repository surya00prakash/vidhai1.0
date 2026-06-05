"use client";

import React, { useEffect, useRef, useState } from "react";
import { useMotionValue, useTransform, animate, motion } from "framer-motion";

interface StatItemProps {
    label: string;
    end: number;
    suffix?: string;
    inView: boolean;
}

const StatItem = ({ label, end, suffix = "", inView }: StatItemProps) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => {
        const value = Math.floor(latest);
        if (suffix === "K+") {
            return `${Math.round(value / 1000)}K+`;
        }
        if (suffix === "+") {
            return `${value}+`;
        }
        return value.toLocaleString();
    });

    useEffect(() => {
        if (!inView) return;
        const controls = animate(count, end, {
            duration: 2,
            ease: "easeOut",
        });
        return controls.stop;
    }, [count, end, inView]);

    return (
        <div className="flex flex-col items-center px-4">
            <motion.span className="text-5xl sm:text-6xl font-extrabold text-primary-500 leading-tight">
                {rounded}
            </motion.span>
            <span className="mt-2 text-sm sm:text-base text-gray-700 tracking-wide text-center uppercase font-medium">
                {label}
            </span>
        </div>
    );
};

export default function ImpactHighlights() {
    const sectionRef = useRef<HTMLElement>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.2 },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="w-full bg-primary-50 py-20 px-4 md:px-8">
            <div className="mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-16">
                    The Force Behind
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-y-14 gap-x-6">
                    <StatItem label="Years" end={15} suffix="+" inView={inView} />
                    <StatItem label="Donors" end={10000} suffix="K+" inView={inView} />
                    <StatItem label="Volunteers" end={1000} suffix="K+" inView={inView} />
                    <StatItem label="Institutions" end={35} suffix="+" inView={inView} />
                    <StatItem label="Resources" end={100} suffix="+" inView={inView} />
                    <StatItem label="Corporates" end={25} suffix="+" inView={inView} />
                </div>
            </div>
        </section>
    );
}
