"use client";

import React from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Divider,
    Image,
    Button
} from "@heroui/react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Building2,
    Target,
    Handshake,
    Quote,
    Heart,
    ChevronRight,
    Star,
    Globe,
    Zap,
    Mail,
    GraduationCap,
    TrendingUp,
    BarChart3,
    Eye,
    Users,
    Rocket
} from "lucide-react";
import CorporateDonorForm from "@/components/join-us/CorporateForm";

const allPartners = [
    {
        name: "Amphenol Omni Connect India Pvt. Ltd.",
        logo: "/assets/images/partners/amphenol_omniconnect_india_pvt_ltd.webp",
        impact: "A partner in progress since 2016. Invested in schools, COVID resilience, and teacher training. Building dreams and futures.",
        tags: ["Infrastructure", "Resilience"]
    },
    {
        name: "Antcorp Technologies Private Limited",
        logo: "/assets/images/partners/antcorp_technologies_private_limited.png",
        impact: "Tech support for STEM, website development, and building the Agaram mobile app.",
        tags: ["App Dev", "STEM Tech"]
    },
    {
        name: "Appian Computer Technologies India Private Limited",
        logo: "/assets/images/partners/partner_default.png",
        impact: "Started with a bold statement—full sponsorship for 18 students. A powerful beginning to a purposeful journey.",
        tags: ["Full Support"]
    },
    {
        name: "AQR Capital India Services LLP",
        logo: "/assets/images/partners/partner_default.png",
        impact: "Consistently sponsored students through the Vidhai and SOS programs since 2021, directly impacting the lives of first-generation learners and helping them stay on course.",
        tags: ["Sponsorship", "Vidhai", "SOS"]
    },
    {
        name: "Bank of America Corporation",
        logo: "/assets/images/partners/bank_of_america.png",
        impact: "Equipped students with placement and communication skill training, fostering professionalism for real-world careers.",
        tags: ["Skill Training"]
    },
    {
        name: "Basilic Fly Studio Ltd.",
        logo: "/assets/images/partners/basilic_fly_studio_pvt_ltd.png",
        impact: "Sponsored students to unlock access to education and paving the way toward meaningful careers.",
        tags: ["Access", "Vocational"]
    },
    {
        name: "BNP Paribas",
        logo: "/assets/images/partners/bnp_paribas_india.png",
        impact: "Since 2018, initiatives like 'Inai' and 'Namathu Gramam' have echoed deeply in rural hearts, shaping self-reliant learners.",
        tags: ["Rural Outreach", "Empowerment"]
    },
    {
        name: "BNY Mellon",
        logo: "/assets/images/partners/partner_default.png",
        impact: "Supported a comprehensive suite of programs including digital literacy, leadership, and employability training, alongside student sponsorships, empowering hundreds of students with 21st-century skills.",
        tags: ["Training", "Digital Literacy", "Employability"]
    },
    {
        name: "Boston Consulting Group India Private Limited",
        logo: "/assets/images/partners/partner_default.png",
        impact: "Conducted an impactful one-day training workshop for students across multiple batches, equipping them with industry insights and career readiness skills.",
        tags: ["Workshop", "Career Readiness"]
    },
    {
        name: "Fujitsu Limited",
        logo: "/assets/images/partners/partner_default.png",
        impact: "Made a significant contribution in the Vidhai program in 2026, expanding opportunities for undergraduate students and reinforcing commitment to education.",
        tags: ["Vidhai", "Scholarship"]
    },
    {
        name: "GEA BGR Energy System India Limited",
        logo: "/assets/images/partners/gea_bgr_energy_system_india_limited.png",
        impact: "Since 2024, sponsored 18 first-generation graduates in their first year. Supporting students and their family legacies.",
        tags: ["Scholarship", "Legacies"]
    },
    /*  {
         name: "Gyso Ecom Services",
         logo: "/assets/images/partners/partner_default.png",
         impact: "Contributed to website development, strengthening outreach and sponsorship coordination.",
         tags: ["Web Support"]
     }, */
    {
        name: "Infinitesol",
        logo: "/assets/images/partners/infinitesol.png",
        impact: "Facilitated placement and internship opportunities, equipping students with real-world exposure beyond the classroom.",
        tags: ["Internships"]
    },
    {
        name: "KOYO SMS",
        logo: "/assets/images/partners/partner_default.png",
        impact: "Inspired over 600 students through hands-on workshops and academic aid since 2022.",
        tags: ["Workshops"]
    },
    {
        name: "Mr. Cooper Group Inc.",
        logo: "/assets/images/partners/mr_cooper_group.png",
        impact: "Enriched sports-focused playground infrastructure, championed placement and training initiatives, and facilitated internships.",
        tags: ["Sports", "Career Readiness"]
    },
    {
        name: "NCR Solutions LLC",
        logo: "/assets/images/partners/partner_default.png",
        impact: "Developed a custom portal and integrated database to support continuous impact monitoring.",
        tags: ["Technology", "Portal"]
    },
    {
        name: "R.R. Donnelley India Outsource Private Limited",
        logo: "/assets/images/partners/partner_default.png",
        impact: "Provided  funding for student sponsorships in 2018, ensuring that Vidhai scholars could continue their educational journey with confidence.",
        tags: ["Sponsorship", "Vidhai"]
    },
    {
        name: "Sagent M&C India Pvt Ltd.",
        logo: "/assets/images/partners/sagent_leading_technologies.png",
        impact: "Provided targeted training and skill upgrades that led to the successful placement of Agaram students.",
        tags: ["Placement"]
    },
    {
        name: "Sharpwire Industries (India) Private Limited",
        logo: "/assets/images/partners/sharpwire_industries_india_private_limited.png",
        impact: "Extended academic support through the Vidhai Program, fostering continuous learning and building lasting confidence.",
        tags: ["Confidence", "Vidhai"]
    },
    {
        name: "Shiftco Shipping & Logistics India Private Limited",
        logo: "/assets/images/partners/partner_default.png",
        impact: "Sponsored Agaram students to gain vital access to education, opening doors to promising careers and transformation.",
        tags: ["Socio-Economic"]
    },
    {
        name: "Tekion India",
        logo: "/assets/images/partners/tekion_india_private_limited.png",
        impact: "Supported Induction Workshops, academic assistance, and the Women in STEM Conclave, inspiring over 500 students.",
        tags: ["STEM", "Diversity"]
    },
    {
        name: "vFocus HR Solutions",
        logo: "/assets/images/partners/partner_default.png",
        impact: "Ensuring swift responses to student needs and reinforcing a dependable ecosystem of care and empowerment.",
        tags: ["Agility", "Care"]
    },
    {
        name: "Watertec India Private Limited",
        logo: "/assets/images/partners/partner_default.png",
        impact: "A long-term partner since 2011, consistently supporting student sponsorships through the Vidhai program. They supported 12 students, enabling them to pursue their education without financial barriers.",
        tags: ["Long-term", "Sponsorship", "Vidhai"]
    },
    {
        name: "W3global India Private Limited",
        logo: "/assets/images/partners/w3global_india_private_limited.png",
        impact: "Ensured 10 students across two batches could study without pause, helping them chase goals fearlessly.",
        tags: ["Continuous Learning"]
    }
];

export default function CorporateCSR() {
    return (
        <div className="min-h-screen bg-white font-sans selection:bg-primary-100">
            {/* Minimalist Header / Breadcrumb alternative */}
            <div className="bg-slate-50 border-b border-slate-200 py-3">
                <div className="max-w-7xl mx-auto px-4 flex items-center gap-2 text-sm text-slate-500">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <ChevronRight className="h-3 w-3" />
                    <Link href="/partners" className="hover:text-primary transition-colors">Partners</Link>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-slate-900 font-medium">Corporate Social Responsibility</span>
                </div>
            </div>

            {/* Hero Section - Left Aligned */}
            <section className="relative py-24 lg:py-32 overflow-hidden bg-[#0A0F1E] flex items-center justify-start text-left">
                <div className="absolute inset-0 z-0 opacity-10">
                    <Globe className="absolute -right-20 -bottom-20 h-96 w-96 text-primary-500 animate-pulse" />
                    <Zap className="absolute left-10 top-20 h-40 w-40 text-secondary-500 animate-bounce duration-[3000ms]" />
                </div>

                <div className="relative z-10 mx-auto max-w-7xl px-4 text-white w-full text-center flex flex-col items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex flex-col items-center"
                    >

                        <h1 className="text-3xl md:text-6xl lg:text-6xl font-black tracking-tight mb-8">
                            CSR Partnerships <br />
                            <span className="text-primary-500">For Impact.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                            Every partnership mentioned below represents a milestone in someone's life, a student gaining
                            access to a world once deemed unreachable.
                        </p>
                    </motion.div>
                </div>
            </section>

            <CorporateDonorForm />


            {/* Partners Grid - Heading Centered, Boxes 3 per row properly aligned */}
            <section className="py-20 max-w-[1400px] mx-auto px-6">
                <div className="flex flex-col items-center text-center mb-20 gap-6 w-full">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 uppercase tracking-tight">Our Collaborative Force</h2>
                        <div className="h-1.5 w-32 bg-primary-500 rounded-full mx-auto" />
                    </div>
                    <p className="text-slate-500 max-w-2xl text-lg leading-relaxed">
                        Driving socio-economic transformation through education, infrastructure, technology, and mentorship across these partnerships.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                    {allPartners.map((partner, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="h-full border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-primary-100/30 transition-all duration-500 group overflow-hidden bg-white">
                                <CardBody className="p-0 flex flex-col items-start">
                                    {/* Logo Header - 70% width, centered with 15% side spacing, stretched to fit */}
                                    {/* <div className="w-full h-32 relative overflow-hidden border-b border-slate-50 group-hover:border-primary-50 transition-all duration-500 flex items-center justify-center bg-slate-50/10">
                                        <div className="w-[70%] h-full flex items-center justify-center">
                                            <Image
                                                src={partner.logo}
                                                alt={partner.name}
                                                className="w-full h-full object-fill transition-all duration-500 rounded-none brightness-100"
                                                removeWrapper
                                            />
                                        </div>
                                    </div> */}
                                    {/* Content - Aligned to top-left of the box area */}
                                    <div className="p-8 flex flex-col items-start text-left w-full">
                                        {/* <div className="flex gap-2 mb-5 flex-wrap">
                                            {partner.tags.map(tag => (
                                                <span key={tag} className="text-[10px] uppercase font-black tracking-widest text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md border border-primary-100">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div> */}
                                        <h3 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-primary-600 transition-colors">
                                            {partner.name}
                                        </h3>
                                        <p className="text-slate-600 text-sm leading-relaxed">
                                            {partner.impact}
                                        </p>
                                    </div>
                                </CardBody>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>



            {/* Final CTA - Premium Redesign */}
            <section className="py-14 relative overflow-hidden bg-white border-t border-slate-100">
                {/* Decorative Background Elements */}
                <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-100/20 rounded-full blur-[120px]" />
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-50/30 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary-50/50 rounded-full blur-3xl opacity-50" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">
                    {/* Centered Heading Block */}
                    <div className="flex flex-col items-center text-center w-full mb-16">

                        <div className="max-w-4xl">
                            <span className="text-primary-600 font-black tracking-[0.2em] text-sm uppercase mb-6 block">Get Involved</span>
                            <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]">
                                Lead the <span className="text-primary-600">Change.</span>
                            </h2>
                        </div>
                    </div>

                    {/* Left-Aligned Body Block */}
                    <div className="max-w-4xl w-full text-left mb-0">
                        <p className="text-xl md:text-2xl text-slate-500 leading-relaxed font-medium mb-6">
                            We are looking for bold partners to expand our reach. Collaborate with us to design a CSR program
                            that transforms communities and builds legacies.
                        </p>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-10 w-full mb-12">
                            <Button
                                size="lg"
                                className="bg-slate-900 text-white font-black px-12 py-8 rounded-2xl shadow-2xl shadow-slate-200 hover:bg-primary-600 transition-all hover:scale-105 active:scale-95 text-lg w-full md:w-auto cursor-pointer"
                                onPress={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            >
                                PARTNER WITH US
                            </Button>

                            <div className="flex p-2 rounded-2xl bg-white border border-slate-100 shadow-xl shadow-slate-100/50 items-center pr-8 w-full md:w-auto">
                                <div className="h-14 w-14 rounded-xl bg-slate-50 flex items-center justify-center text-primary-600 mr-4">
                                    <Mail className="h-6 w-6" />
                                </div>
                                <div className="text-left">
                                    <a href="mailto:csr@agaram.in" className="text-xl font-bold text-slate-900 hover:text-primary-600 transition-colors">
                                        csr@agaram.in
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}