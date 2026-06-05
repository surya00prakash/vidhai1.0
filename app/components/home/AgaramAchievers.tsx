import React from 'react';
import { Card } from '@heroui/react';
import Image from 'next/image';

const AgaramAchievers = () => {
    const achievements = [
        {
            id: 'doctors',
            number: '70+',
            label: 'Doctors',
            image: '/assets/images/achievers/doctors-min.png',
        },
        {
            id: 'engineers',
            number: '1750+',
            label: 'Engineers',
            image: '/assets/images/achievers/engineers-min.png',
        },
        {
            id: 'paramedics',
            number: '700+',
            label: 'Paramedics',
            image: '/assets/images/achievers/paramedics-min.png',
        },
        {
            id: 'diploma',
            number: '350+',
            label: 'Diploma',
            image: '/assets/images/achievers/diploma-min.png',
        },
        {
            id: 'arts',
            number: '3320+',
            label: 'Arts & Science',
            image: '/assets/images/achievers/arts-science-min.png',
        },
        {
            id: 'professional',
            number: '105+',
            label: 'Others Professionals',
            image: '/assets/images/achievers/professional-courses-min.png',
        },
    ];

    return (
        <div className="bg-gray-50 py-10 px-5">
            <div className="max-w-6xl mx-auto text-center mb-10">
                <h1
                    className="text-4xl md:text-4xl font-medium"
                >
                    Agaram Achievers
                </h1>
            </div>

            {/* Responsive layout via Tailwind grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
                {achievements.map((a) => (
                    <Card
                        key={a.id}
                        isHoverable
                        className="flex flex-col items-center justify-center p-6 text-center shadow-sm hover:-translate-y-1 transition"
                        style={{
                            backgroundColor: 'rgba(0, 171, 192, 0.08)',
                            borderColor: 'rgba(0, 171, 192, 0.15)',
                        }}
                    >
                        {/* Image */}
                        <Image
                            src={a.image}
                            alt={a.label}
                            width={120}
                            height={120}
                            className="object-contain mb-4"
                        />

                        {/* Number */}
                        <p
                            className="text-4xl font-semibold text-primary"
                        >
                            {a.number}
                        </p>

                        {/* Label */}
                        <p className="text-xl text-secondary-600 font-semibold">{a.label}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AgaramAchievers;
