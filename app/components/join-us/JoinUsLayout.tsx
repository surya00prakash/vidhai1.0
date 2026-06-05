"use client";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Image } from "@heroui/react";

interface JoinUsLayoutProps {
    children: ReactNode;
}

const contentMap: Record<string, { title: string; description: string; image: string }> = {
    "/join-us/educational-institutions": {
        title: "Partner with Us: Educational Institutions",
        description: "Collaborate with Agaram to uplift education across Tamil Nadu.",
        image: "/assets/images/join-us/volunteers.png",
    },
    "/join-us/volunteers": {
        title: "Join Us as a Volunteer",
        description: "Contribute your time and skills to support our mission.",
        image: "/assets/images/join-us/volunteers-banner.png",
    },
    "/join-us/sponsor": {
        title: "Become a Sponsor",
        description: "Support a child's education and transform lives.",
        image: "/assets/images/join-us/volunteers.png",
    },
    "/join-us/donors": {
        title: "Make a Donation",
        description: "Support Agaram Foundation with a one-time or recurring donation.",
        image: "/assets/images/join-us/volunteers.png",
    },
};

export default function JoinUsLayout({ children }: JoinUsLayoutProps) {
    const pathname = usePathname();

    const content = contentMap[pathname] || {
        title: "Support Our Cause",
        description: "Be a part of positive change through your contribution.",
        image: "/assets/images/join-us/volunteers-banner.png",
    };

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-primary-50 via-primary-100 to-secondary-50">
            <div className="grid grid-cols-1 lg:grid-cols-12 w-full min-h-screen relative">
                {/* DECORATIVE ELEMENTS */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-secondary-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 right-1/4 w-32 h-32 bg-primary-300/10 rounded-full blur-2xl animate-bounce delay-500"></div>
                </div>

                {/* LEFT PANEL - HERO SECTION */}
                <div className="lg:col-span-5 relative min-h-[60vh] lg:min-h-screen hidden md:flex">
                    {/* Background Image with Overlay */}
                    <div className="absolute inset-0">
                        <Image
                            src={content.image}
                            alt={content.title}
                            radius="none"
                            className="object-cover w-full h-full"
                            loading="eager"
                        />
                        {/* Dynamic gradient overlay */}
                        <div className="absolute inset-0 bg-primary/80"></div>
                    </div>

                    {/* Hero Content */}
                    <div className="relative z-20 h-full flex flex-col justify-center items-start p-8 lg:p-12 xl:p-16">

                        <div className="max-w-md space-y-6">
                            {/* Title with stagger animation effect */}
                            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
                                {content.title.split(' ').map((word, index) => (
                                    <span
                                        key={index}
                                        className="inline-block mr-3 transform transition-all duration-500 hover:scale-105"
                                        style={{
                                            animationDelay: `${index * 100}ms`,
                                            animation: 'fadeInUp 0.8s ease-out forwards'
                                        }}
                                    >
                                        {word}
                                    </span>
                                ))}
                            </h1>

                            {/* Description */}
                            <p className="text-lg text-primary-100 leading-relaxed opacity-90">
                                {content.description}
                            </p>

                        </div>
                    </div>
                </div>

                {/* RIGHT PANEL - FORM CONTENT */}
                <div className="lg:col-span-7 relative">
                    {/* Glassmorphism container */}
                    <div className="h-full bg-white/95 backdrop-blur-sm border-l border-primary-200/30">

                        {/* Children content wrapper */}
                        <div className="relative">
                            {/* Subtle background pattern */}
                            <div className="absolute inset-0 opacity-5">
                                <div className="w-full h-full"
                                    style={{
                                        backgroundImage: `radial-gradient(circle at 20px 20px, rgb(var(--primary-500)) 1px, transparent 0)`,
                                        backgroundSize: '40px 40px'
                                    }}>
                                </div>
                            </div>

                            {/* Actual form content */}
                            <div className="relative z-10">
                                {children}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}