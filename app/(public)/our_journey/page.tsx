"use client"

import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { LuCalendar, LuUsers, LuGraduationCap, LuAward, LuBookOpen, LuBuilding, LuPlay, LuTarget, LuHeart, LuGlobe } from 'react-icons/lu';
import { Badge, Divider } from '@heroui/react';
import Image from 'next/image';
import TwoColumnHorizontalCarousel from '@/components/journey/TwoColumnHorizontalCarousel';

const timelineData = [
    {
        id: '01',
        date: '2006',
        title: 'Non-Profit Registration',
        description: 'Registered as a non-profit organization, marking the beginning of Agaram’s mission to use education as a tool for social transformation.',
        icon: LuBuilding,
        color: '#00abc0',
        position: 'top'
    },
    {
        id: '02',
        date: '2007',
        title: 'School Adoption in Palur',
        description: 'Adopted and restored the Government Adi Dravidar Welfare School in Palur, Chengalpattu, setting up a library and improving education quality.',
        icon: LuBookOpen,
        color: '#00d4aa',
        position: 'bottom'
    },
    {
        id: '03',
        date: '2008',
        title: 'Learning Centres & Awareness Film',
        description: 'Launched Agaram Learning Centres to provide post-school coaching and skills for rural children and released "Herova? Zerova?", a short film to fight school dropouts.',
        icon: LuPlay,
        color: '#0088cc',
        position: 'top'
    },
    {
        id: '04',
        date: '2009',
        title: 'Vazhikattigal Mentorship Program',
        description: 'Introduced Vazhikattigal, a mentorship program for students in remote Tamil Nadu, offering guidance, resources, and continuous support for education.',
        icon: LuGraduationCap,
        color: '#00b3d4',
        position: 'bottom'
    },
    {
        id: '05',
        date: '2010',
        title: 'Vidhai Initiative Launch',
        description: 'Launched Vidhai to sponsor deserving rural students for higher education and mentoring: 160 students from 32 districts formed the first batch.',
        icon: LuTarget,
        color: '#00c7b7',
        position: 'top'
    },
    {
        id: '06',
        date: '2015',
        title: 'Thai & 36 Vayadhinile Initiatives',
        description: 'Started Thai, providing skills training for rural youth, and 36 Vayadhinile for women’s empowerment. Continued expanding Vidhai student support and mentoring.',
        icon: LuHeart,
        color: '#009fc7',
        position: 'bottom'
    },
    {
        id: '07',
        date: '2016',
        title: 'Yadhum Oorae & School Restorations',
        description: 'Introduced the Yadhum Oorae environmental program, rehabilitated three flood-hit villages, and restored two government schools to improve learning conditions.',
        icon: LuGlobe,
        color: '#00abc0',
        position: 'top'
    },
    {
        id: '08',
        date: '2017',
        title: 'Namathu Palli & Irula Village Development',
        description: 'Adopted additional schools under Namathu Palli and upgraded infrastructure in Irula villages, enabling community certifications for residents.',
        icon: LuAward,
        color: '#0088cc',
        position: 'bottom'
    },
    {
        id: '09',
        date: '2018',
        title: 'Book Publication & School Expansion',
        description: 'Published "Aaram Seyya Virumbu" and adopted three more government schools under Namathu Palli.',
        icon: LuBookOpen,
        color: '#00d4aa',
        position: 'top'
    },
    {
        id: '10',
        date: '2020',
        title: 'COVID-19 Relief & Education Support',
        description: 'Published "Ulagam Pirandhadhu Namakaga" and "Vithyasamthan Azhagu", and provided COVID-19 education relief: 500 smartphones and fees for over 2,500 students.',
        icon: LuCalendar,
        color: '#00b3d4',
        position: 'bottom'
    },
    {
        id: '11',
        date: '2021',
        title: 'Agaram Alumni Association',
        description: 'Formed the Agaram Alumni Association to connect graduates and strengthen community ties.',
        icon: LuUsers,
        color: '#00d4aa',
        position: 'top'
    },
    {
        id: '12',
        date: '2022',
        title: 'Namadhu Palli Fellowship Launch',
        description: 'Launched Agaram Namadhu Palli Fellowship in Jawadhu Hills, placing four fellows in four schools to improve rural education.',
        icon: LuGraduationCap,
        color: '#0088cc',
        position: 'bottom'
    },
    {
        id: '13',
        date: '2023',
        title: 'Fellowship Expansion',
        description: 'Expanded the fellowship to 33 fellows across 32 schools, scaling rural education impact.',
        icon: LuTarget,
        color: '#00b3d4',
        position: 'top'
    },
    {
        id: '14',
        date: '2024',
        title: 'EmpowHer & Fellowship Growth',
        description: 'Organized EmpowHer, an international conclave for women in STEM, published two Tamil books, and expanded the fellowship to 50 fellows in 49 schools.',
        icon: LuHeart,
        color: '#00d4aa',
        position: 'bottom'
    }
];


const cards = [
    {
        company: "A Legacy of Change",
        funding: "6300+ Students",
        fundingDesc: "2006 to Present",
        image: "/assets/images/partners/partner_banner.jpg",
        imageLeft: false,
    }
];

// Generate smooth wave path
const generateWavePath = (width: number, centerY: number) => {
    const points = [];
    const segments = 200;
    const amplitude = 30;
    const frequency = 3;

    for (let i = 0; i <= segments; i++) {
        const x = (i / segments) * width;
        const y = centerY + Math.sin((x / width) * Math.PI * frequency) * amplitude;
        points.push(`${x},${y}`);
    }

    return `M ${points.join(' L ')}`;
};

// Get position on wave for each timeline item
const getWavePoint = (index: number, total: number, width: number, centerY: number) => {
    const x = (index / (total - 1)) * width;
    const amplitude = 30;
    const frequency = 3;
    const y = centerY + Math.sin((x / width) * Math.PI * frequency) * amplitude;
    return { x, y };
};

const Timeline: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [containerWidth, setContainerWidth] = useState(1200);
    const [isTimelineScrolling, setIsTimelineScrolling] = useState(false);

    const scrollX = useMotionValue(0);
    const cardSpacing = 200; // Reduced spacing to prevent overlap
    const timelineWidth = timelineData.length * cardSpacing + 600;
    const maxScroll = Math.max(0, timelineWidth - containerWidth);
    const transformedX = useTransform(scrollX, [0, maxScroll], [0, -maxScroll]);
    const centerY = 180; // Adjusted center position

    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth);
            }
        };

        updateWidth();
        window.addEventListener('resize', updateWidth);
        return () => window.removeEventListener('resize', updateWidth);
    }, []);

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            const currentScrollX = scrollX.get();

            // If we can still scroll horizontally in the timeline
            if (currentScrollX < maxScroll && e.deltaY > 0) {
                e.preventDefault();
                setIsTimelineScrolling(true);

                const deltaX = e.deltaX !== 0 ? e.deltaX : e.deltaY;
                const newX = Math.max(0, Math.min(maxScroll, currentScrollX + deltaX * 1.5));
                scrollX.set(newX);

                // Update selected index based on scroll position
                const newIndex = Math.round(newX / cardSpacing);
                setSelectedIndex(Math.max(0, Math.min(newIndex, timelineData.length - 1)));

                // Reset timeline scrolling flag after a delay
                setTimeout(() => setIsTimelineScrolling(false), 100);
            } else if (currentScrollX >= maxScroll && e.deltaY > 0) {
                // Allow normal page scrolling when timeline is at the end
                setIsTimelineScrolling(false);
            } else if (currentScrollX > 0 && e.deltaY < 0) {
                // Scroll timeline backwards
                e.preventDefault();
                setIsTimelineScrolling(true);

                const deltaX = e.deltaX !== 0 ? e.deltaX : e.deltaY;
                const newX = Math.max(0, Math.min(maxScroll, currentScrollX + deltaX * 1.5));
                scrollX.set(newX);

                const newIndex = Math.round(newX / cardSpacing);
                setSelectedIndex(Math.max(0, Math.min(newIndex, timelineData.length - 1)));

                setTimeout(() => setIsTimelineScrolling(false), 100);
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
            return () => container.removeEventListener('wheel', handleWheel);
        }
    }, [scrollX, maxScroll, cardSpacing]);

    const handleItemClick = (index: number) => {
        setSelectedIndex(index);
        const targetX = index * cardSpacing;
        scrollX.set(Math.min(targetX, maxScroll));
    };

    const wavePath = generateWavePath(timelineWidth - 600, centerY);

    return (

        <>



            <div className="max-w-7xl mt-16 mx-auto grid gap-6 sm:grid-cols-1 md:grid-cols-1">
                {cards.map((card, idx) => (
                    <div
                        key={idx}
                        className="rounded-2xl overflow-hidden  flex flex-col md:flex-row items-stretch justify-between"
                    >
                        {/* LEFT IMAGE */}
                        {card.imageLeft && (
                            <div className="relative w-full md:w-1/2 h-[240px] md:h-auto">
                                <Image
                                    src={card.image}
                                    alt={card.company} layout="fill"
                                    objectFit="cover"
                                    className="rounded-xl md:rounded-none md:rounded-l-2xl"
                                />
                            </div>
                        )}

                        {/* CONTENT */}
                        <div className="p-6 flex flex-col justify-between w-full md:w-5/5 space-y-4">
                            <div className="space-y-2">
                                <h3 className="text-4xl font-semibold mb-4 text-secondary-500">{card.company}</h3>
                                <p className="text-justify text-md text-secondary-400">
                                    Agaram Foundation began in 2006 with one question: Why does education especially higher education remain out of sight and out of reach for so many first-generation learners? And if we look closer, the question goes beyond that: why does our society allow something as fundamental as education to remain out of reach for so many? The truth is, solving the first question is how we begin to answer the second. Because when we open the doors of learning to those who have been shut out, we are not just helping individuals; we are dismantling the very barriers that keep equality a distant dream.<br /><br />
                                    What started as a small group trying to bridge that gap has now grown into a movement that continues to evolve quietly, steadily, with focus.
                                    we built model to identify the most deserving students: visiting homes, speaking with families, and walking with them from application to graduation. We saw that access alone wasn’t enough. Guidance, belonging, and confidence were just as critical.<br /><br />
                                    Creating mentoring systems, residential support, training programmes, and community-led models. We began to work not just for students, but with them, shaping a network that could sustain itself.
                                    As of 2025, Agaram has supported over 6500+ students across Tamil Nadu. Many of our alumni now serve as mentors, facilitators, or fellows themselves, helping others make the same journey.
                                    We want to ensure that no student is held back by circumstance. And to keep building a future where every learner is the first, but not the last, in their family to choose their path.

                                </p>
                            </div>
                            {/* <div className="pt-4">
                                <Divider />
                                <p className="text-xl pt-4 font-bold text-primary">
                                    {card.funding}{" "}
                                    <span className="font-normal text-base text-gray-500">
                                        and still counting
                                    </span>
                                </p>
                                <p className="text-sm text-gray-400 pt-1">{card.fundingDesc}</p>
                            </div> */}
                        </div>

                        {/* RIGHT IMAGE */}
                        <TwoColumnHorizontalCarousel />
                    </div>
                ))}
            </div>



            <div className="min-h-screen">
                {/* Header */}
                <div className="pt-12 pb-8 px-8">
                </div>

                {/* Timeline Container */}
                <div
                    ref={containerRef}
                    className="relative overflow-hidden cursor-grab active:cursor-grabbing hidden md:flex"
                    style={{ height: '700px' }}
                >
                    {/* Start Label */}
                    <motion.div
                        className="absolute z-30"
                        style={{
                            x: transformedX,
                            left: '40px',
                            top: '50%',
                            transform: 'translateY(-50%)'
                        }}
                    >
                        <div className="bg-gradient-to-r from-[#00abc0] to-[#00d4aa] text-white rounded-full px-8 py-4">
                            <span className="text-sm font-bold tracking-wide">START</span>
                        </div>
                    </motion.div>

                    {/* End Label */}
                    <motion.div
                        className="absolute z-30"
                        style={{
                            x: transformedX,
                            left: `${timelineWidth - 150}px`,
                            top: '50%',
                            transform: 'translateY(-50%)'
                        }}
                    >
                        <div className="bg-gradient-to-r from-[#0088cc] to-[#00abc0] text-white rounded-full px-8 py-4">
                            <span className="text-sm font-bold tracking-wide">ONGOING</span>
                        </div>
                    </motion.div>

                    {/* Wave Timeline */}
                    <motion.div
                        className="absolute z-10"
                        style={{ x: transformedX, top: '100px', left: '300px' }}
                    >
                        <svg width={timelineWidth - 600} height="400" viewBox={`0 0 ${timelineWidth - 600} 400`}>
                            <defs>
                                <linearGradient id="timelineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#00abc0" />
                                    <stop offset="20%" stopColor="#00d4aa" />
                                    <stop offset="40%" stopColor="#0088cc" />
                                    <stop offset="60%" stopColor="#00b3d4" />
                                    <stop offset="80%" stopColor="#00c7b7" />
                                    <stop offset="100%" stopColor="#009fc7" />
                                </linearGradient>
                                <filter id="glow">
                                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            <motion.path
                                d={wavePath}
                                stroke="url(#timelineGradient)"
                                strokeWidth="2"
                                fill="none"
                                filter="url(#glow)"
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: 1 }}
                                transition={{ duration: 3, ease: "easeInOut" }}
                            />

                            {/* Timeline Items */}
                            {timelineData.map((item, index) => {
                                const isSelected = index === selectedIndex;
                                const position = getWavePoint(index, timelineData.length, timelineWidth - 600, centerY);
                                const isTop = item.position === 'top';

                                return (
                                    <g key={index}>
                                        {/* Connecting Line */}
                                        <motion.line
                                            x1={position.x}
                                            y1={position.y}
                                            x2={position.x}
                                            y2={isTop ? position.y - 60 : position.y + 60}
                                            stroke={item.color}
                                            strokeWidth="4"
                                            opacity={isSelected ? 1 : 0.7}
                                            animate={{ strokeWidth: isSelected ? 4 : 3 }}
                                        />

                                        {/* Timeline Dot */}
                                        <motion.circle
                                            cx={position.x}
                                            cy={position.y}
                                            r={isSelected ? 14 : 10}
                                            fill={item.color}
                                            stroke="white"
                                            strokeWidth="4"
                                            className="cursor-pointer"
                                            onClick={() => handleItemClick(index)}
                                            style={{
                                                filter: isSelected ? `drop-shadow(0 0 20px ${item.color}80)` : 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                                            }}
                                            animate={{
                                                r: isSelected ? 14 : 10,
                                                strokeWidth: isSelected ? 5 : 4
                                            }}
                                            transition={{ duration: 0.3 }}
                                        />

                                        {/* Icon */}
                                        <foreignObject
                                            x={position.x - 8}
                                            y={position.y - 8}
                                            width="16"
                                            height="16"
                                            className="pointer-events-none"
                                        >
                                            <item.icon
                                                size={16}
                                                color="white"
                                                style={{
                                                    filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                                                }}
                                            />
                                        </foreignObject>
                                    </g>
                                );
                            })}
                        </svg>
                    </motion.div>

                    {/* Content Cards */}
                    <motion.div
                        className="absolute z-20"
                        style={{ x: transformedX, top: '60px', left: '300px' }}
                    >
                        {timelineData.map((item, index) => {
                            const isSelected = index === selectedIndex;
                            const position = getWavePoint(index, timelineData.length, timelineWidth - 600, centerY);
                            const isTop = item.position === 'top';

                            return (
                                <motion.div
                                    key={index}
                                    className="absolute"
                                    style={{
                                        left: `${position.x - 120}px`,
                                        top: isTop ? `${position.y - 200}px` : `${position.y + 120}px`,
                                        zIndex: isSelected ? 25 : 20
                                    }}
                                    onClick={() => handleItemClick(index)}
                                >
                                    <motion.div
                                        className={`w-60 p-5 bg-white rounded-2xl shadow-md cursor-pointer transition-all duration-300 ${isSelected
                                            ? 'shadow-2xl ring-2 ring-primary'
                                            : 'hover:shadow-xl hover:-translate-y-1'
                                            }`}
                                        animate={{
                                            scale: isSelected ? 1.05 : 1,
                                            y: isSelected ? -8 : 0
                                        }}
                                        transition={{ duration: 0.3, ease: "easeOut" }}
                                    >
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-4">
                                            <span
                                                className="text-xs font-bold px-3 py-1.5 rounded-full text-white tracking-wide"
                                                style={{
                                                    background: `linear-gradient(135deg, ${item.color}, ${item.color}dd)`
                                                }}
                                            >
                                                {item.date}
                                            </span>
                                            <span className="text-2xs font-bold text-gray-400">
                                                #{item.id}
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className={`font-bold mb-3 transition-all duration-300 ${isSelected
                                            ? 'text-lg text-gray-900'
                                            : 'text-base text-gray-800'
                                            }`}>
                                            {item.title}
                                        </h3>

                                        {/* Description */}
                                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                                            {item.description}
                                        </p>

                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </div>

                {/* Scroll to continue indicator - only show when timeline is complete */}
                {selectedIndex === timelineData.length - 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-4"
                    >
                        <div className="text-sm text-gray-500">
                            Scroll down to continue reading
                        </div>
                        <motion.div
                            animate={{ y: [0, 5, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="mt-2"
                        >
                            ↓
                        </motion.div>
                    </motion.div>
                )}
            </div></>
    );
};

export default Timeline;