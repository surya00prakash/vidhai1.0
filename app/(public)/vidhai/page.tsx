"use client";

import React from "react";
import {
    Card,
    CardBody,
    CardHeader,
    Button,
    Tabs,
    Tab,
    Chip,
    Divider,
    Accordion,
    AccordionItem,
    Tooltip,
    Progress,
    CardFooter,
} from "@heroui/react";
import { motion } from "framer-motion";
import {
    CheckCircle2,
    ClipboardList,
    Home,
    Users2,
    Building2,
    Trophy,
    Quote,
    School,
    Search,
    FileText,
    HandCoins,
    Award,
    BookOpenCheck,
    MapPin,
    ChevronRight,
} from "lucide-react";
import AgaramAchievers from "@/components/home/AgaramAchievers";

export default function AgaramVidhaiSelectionPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
            {/* Hero */}
            <section className="relative overflow-hidden">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="grid gap-8 lg:grid-cols-2 items-center"
                    >
                        <div>
                            <h2 className="mb-4 text-4xl font-bold">
                                <span className="text-primary">Agaram</span>{" "}
                                <span className="text-secondary">Vidhai</span>
                            </h2>

                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
                                Equal opportunities for quality higher education
                            </h1>
                            <p className="mt-4 text-slate-600 text-lg">
                                Working closely with students from remote parts of Tamil Nadu
                                has helped Agaram understand ground realities and scale efforts
                                to create real, sustained impact—especially for first-generation
                                learners in rural government schools.
                            </p>
                            <div className="mt-6 flex flex-wrap gap-4">
                                <StatPill
                                    icon={<Users2 className="h-4 w-4" />}
                                    label="Students Supported"
                                    value="~6,000+"
                                />
                                <StatPill
                                    icon={<Trophy className="h-4 w-4" />}
                                    label="Since"
                                    value="2010"
                                />
                            </div>
                        </div>
                        <Card className="shadow-xl border border-slate-200/60">
                            <CardBody className="p-6">
                                <QuoteBlock />
                                <Divider className="my-6" />
                                <ProgramAtAGlance />
                            </CardBody>
                        </Card>
                    </motion.div>
                </div>
            </section>

            {/* Journey Tabs */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
                <Card className="shadow-none bg-transparent">
                    <CardHeader className="flex flex-col gap-2">
                        <h2 className="text-2xl font-semibold text-slate-900">
                            How Agaram’s Selection Works
                        </h2>
                        <p className="text-slate-600">
                            Thousands of applications undergo a fair, rigorous, and transparent
                            process to identify deserving students.
                        </p>
                    </CardHeader>
                    <CardBody>
                        <Tabs
                            aria-label="Selection stages"
                            color="primary"
                            radius="md"
                            className="w-full mb-4 text-white"
                        >
                            <Tab
                                key="apply"
                                title={<TabTitle icon={<FileText className="h-4 w-4" />} text="Receive Applications" />}
                            >
                                <StageCard
                                    title="Receiving Applications"
                                    icon={<FileText className="h-5 w-5" />}
                                    points={[
                                        "Applications open annually for higher education support.",
                                        "Priority for first-generation learners and rural government school students.",
                                        "Documents collected to verify academic and socio-economic details.",
                                    ]}
                                />
                            </Tab>
                            <Tab
                                key="interview"
                                title={<TabTitle icon={<Search className="h-4 w-4" />} text="Personal Interview" />}
                            >
                                <StageCard
                                    title="Personal Interview"
                                    icon={<Search className="h-5 w-5" />}
                                    points={[
                                        "Panel evaluates motivation, clarity of goals, and resilience.",
                                        "Opportunity for students to share achievements and challenges.",
                                        "Helps contextualize academic scores with lived realities.",
                                    ]}
                                />
                            </Tab>
                            <Tab
                                key="visit"
                                title={<TabTitle icon={<Home className="h-4 w-4" />} text="House Visit" />}
                            >
                                <StageCard
                                    title="House Visit"
                                    icon={<Home className="h-5 w-5" />}
                                    points={[
                                        "Volunteers validate socio-economic conditions and family context.",
                                        "Ensures fairness and accurate need assessment.",
                                        "Builds trust and rapport with the family.",
                                    ]}
                                />
                            </Tab>
                            <Tab
                                key="score"
                                title={<TabTitle icon={<ClipboardList className="h-4 w-4" />} text="Scoring & Selection" />}
                            >
                                <StageCard
                                    title="Scoring & Selection"
                                    icon={<ClipboardList className="h-5 w-5" />}
                                    points={[
                                        "Transparent rubric combining academic merit and financial need.",
                                        "Weightage for first-generation status, distance to college, and special circumstances.",
                                        "Final shortlisting reviewed by trustees and program leads.",
                                    ]}
                                />
                            </Tab>
                        </Tabs>
                    </CardBody>
                </Card>
            </section>

            {/* NEW: Timeline Section with Photos */}
            <SelectionProcessTimeline />

            {/* Support Provided */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
                <div className="grid gap-6 md:grid-cols-3">
                    <SupportCard
                        icon={<School className="h-5 w-5" />}
                        title="Admissions & Counseling"
                        points={[
                            "Guidance for course/college selection",
                            "Application & admission support",
                            "Document preparation help",
                        ]}
                    />
                    <SupportCard
                        icon={<Building2 className="h-5 w-5" />}
                        title="Hostel & Accommodation"
                        points={[
                            "Hostel/accommodation mapping",
                            "Mess fee and basic needs",
                            "Travel & relocation guidance",
                        ]}
                    />
                    <SupportCard
                        icon={<HandCoins className="h-5 w-5" />}
                        title="Financial Assistance"
                        points={[
                            "Tuition support based on need",
                            "Disbursal tracking & transparency",
                            "Mentor check-ins each term",
                        ]}
                    />
                </div>
            </section>

            {/* Impact Timeline */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
                <Card className=" shadow-none bg-transparent">
                    <CardHeader>
                        <h2 className="text-2xl font-semibold text-slate-900">
                            Impact Over the Years
                        </h2>
                    </CardHeader>
                    <CardBody>
                        <div className="grid gap-4 md:grid-cols-4">
                            <Milestone year="2010" title="Program Momentum" desc="Supported 160 students across Tamil Nadu & Puducherry with donor contributions." />
                            <Milestone year="2015" title="Structured Rubrics" desc="Formalized scoring model and house-visit validations for fairness." />
                            <Milestone year="2020" title="Student Success" desc="Scaled mentoring and placement guidance during challenging times." />
                            <Milestone year="Now" title="~6,000+ Students" desc="Support extends to Tamilnadu, Pondicherry, and neighboring Kerala & Andhra Pradesh." />
                        </div>
                    </CardBody>
                    <CardFooter>
                        <AgaramAchievers />
                    </CardFooter>
                </Card>
            </section>

            {/* FAQ */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20 shadow-none">
                <div className="grid gap-6 lg:grid-cols-1">
                    <Card className="lg:col-span-2 shadow-none bg-transparent">
                        <CardHeader>
                            <h2 className="text-2xl font-semibold text-slate-900">
                                Frequently Asked Questions
                            </h2>
                        </CardHeader>
                        <CardBody>
                            <Accordion variant="splitted">
                                <AccordionItem key="1" aria-label="Who can apply?" title="Who can apply?">
                                    Students pursuing higher education, with priority for
                                    first-generation learners from rural government schools in
                                    Tamil Nadu and Puducherry.
                                </AccordionItem>
                                <AccordionItem key="2" aria-label="What documents are needed?" title="What documents are needed?">
                                    Academic transcripts, ID/address proof, income certificate,
                                    community certificate (if applicable), and recommendation from
                                    school/mentor.
                                </AccordionItem>
                                <AccordionItem key="3" aria-label="How is funding decided?" title="How is funding decided?">
                                    Using a transparent scoring rubric that balances academic merit
                                    with financial need, verified through interviews and a house
                                    visit.
                                </AccordionItem>
                                <AccordionItem key="4" aria-label="Do you support living expenses?" title="Do you support living expenses?">
                                    Yes. Based on assessed need, support may include hostel/mess
                                    fees and other essential logistics.
                                </AccordionItem>
                            </Accordion>
                        </CardBody>
                    </Card>
                </div>
            </section>
        </div>
    );
}

/* --- Components --- */

function TabTitle({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm font-medium">{text}</span>
        </div>
    );
}

function StageCard({
    title,
    icon,
    points,
}: {
    title: string;
    icon: React.ReactNode;
    points: string[];
}) {
    return (
        <div className="grid gap-6 md:grid-cols-[1fr,380px] items-start">
            <div>
                <h3 className="text-xl font-semibold flex items-center gap-2">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                        {icon}
                    </span>
                    {title}
                </h3>
                <ul className="mt-4 space-y-2 text-slate-700">
                    {points.map((p, i) => (
                        <li key={i} className="flex gap-2">
                            <CheckCircle2 className="mt-1 h-4 w-4 text-success" />
                            <span>{p}</span>
                        </li>
                    ))}
                </ul>
            </div>
            <Card className="border border-slate-200/60">
                <CardHeader>
                    <h4 className="font-semibold">What we look for</h4>
                </CardHeader>
                <CardBody className="space-y-3">
                    <BadgeLine icon={<Award className="h-4 w-4" />} text="Academic consistency and effort" />
                    <BadgeLine icon={<Users2 className="h-4 w-4" />} text="First-generation / vulnerable backgrounds" />
                    <BadgeLine icon={<BookOpenCheck className="h-4 w-4" />} text="Clarity of goals and motivation" />
                    <BadgeLine icon={<MapPin className="h-4 w-4" />} text="Logistics and distance constraints" />
                </CardBody>
            </Card>
        </div>
    );
}

/* NEW: Timeline Component with Photos */
function SelectionProcessTimeline() {
    const stages = [
        {
            title: "Receiving Applications",
            icon: <FileText className="h-5 w-5" />,
            points: [
                "Applications are received annually for higher education support.",
                "Thousands of requests are carefully verified.",
                "Documents confirm academic and socio-economic details.",
            ],
            image: "/images/process/applications.jpg",
        },
        {
            title: "Personal Interview",
            icon: <Search className="h-5 w-5" />,
            points: [
                "Panel interaction with shortlisted students.",
                "Evaluates motivation, clarity of goals, and challenges.",
                "Adds context to academic performance.",
            ],
            image: "/images/process/interview.jpg",
        },
        {
            title: "House Visit",
            icon: <Home className="h-5 w-5" />,
            points: [
                "Volunteers visit homes to validate background.",
                "Confirms socio-economic conditions of the family.",
                "Ensures fairness and transparency.",
            ],
            image: "/images/process/house-visit.jpg",
        },
        {
            title: "Scoring & Selection",
            icon: <ClipboardList className="h-5 w-5" />,
            points: [
                "Rigorous scoring system combining merit and need.",
                "Factors include first-generation status and distance.",
                "Final selection is made transparently.",
            ],
            image: "/images/process/scoring.jpg",
        },
    ];

    return (
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
                Agaram’s Selection Process (Timeline View)
            </h2>

            <div className="relative border-l-2 border-slate-200">
                {stages.map((stage, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                        viewport={{ once: true }}
                        className="mb-12 ml-6"
                    >
                        {/* Step Icon */}
                        <span className="absolute -left-4 flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-white text-primary shadow-md">
                            {stage.icon}
                        </span>

                        {/* Card */}
                        <Card className="p-6 shadow-md border border-slate-200/60">
                            <h3 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                {stage.title}
                            </h3>
                            <ul className="space-y-2 text-slate-700">
                                {stage.points.map((point, i) => (
                                    <li key={i} className="flex gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-success mt-0.5" />
                                        {point}
                                    </li>
                                ))}
                            </ul>

                            {/* Photos Section */}
                            <div className="mt-6">
                                <img
                                    src={stage.image}
                                    alt={stage.title}
                                    className="rounded-xl border border-slate-200 shadow-md w-full max-h-64 object-cover"
                                />
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <span className="text-slate-500">{icon}</span>
            <span className="text-sm text-slate-600">{label}</span>
            <span className="text-sm font-semibold text-slate-900">{value}</span>
        </div>
    );
}

function ProgramAtAGlance() {
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            <FeatureLine icon={<Users2 className="h-4 w-4" />} title="First-gen focus" desc="Predominantly first-generation learners from rural govt. schools." />
            <FeatureLine icon={<School className="h-4 w-4" />} title="College pathways" desc="From application to admission with mentor guidance." />
            <FeatureLine icon={<Home className="h-4 w-4" />} title="Holistic support" desc="Includes logistics such as accommodation & mess fees." />
            <FeatureLine icon={<HandCoins className="h-4 w-4" />} title="Need-based aid" desc="Transparent disbursal aligned to the scoring model." />
        </div>
    );
}

function FeatureLine({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                {icon}
            </div>
            <div>
                <div className="font-medium text-slate-900">{title}</div>
                <div className="text-sm text-slate-600">{desc}</div>
            </div>
        </div>
    );
}

function QuoteBlock() {
    return (
        <div className="relative rounded-2xl bg-gradient-to-br from-primary-50 to-white p-5">
            <div className="absolute -top-4 -left-2 opacity-20">
                <Quote className="h-16 w-16" />
            </div>
            <blockquote className="text-lg italic text-slate-800">
                “Education is the manifestation of the perfection already in man.”
            </blockquote>
            <p className="mt-2 font-semibold text-slate-900">— Swami Vivekananda</p>
        </div>
    );
}

function SupportCard({ icon, title, points }: { icon: React.ReactNode; title: string; points: string[] }) {
    return (
        <Card className="border border-slate-200/60 shadow-sm">
            <CardHeader>
                <h3 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-secondary-100 text-secondary-700">
                        {icon}
                    </span>
                    {title}
                </h3>
            </CardHeader>
            <CardBody className="space-y-2 text-slate-700">
                {points.map((p, i) => (
                    <div key={i} className="flex gap-2">
                        <ChevronRight className="h-4 w-4 text-primary mt-1" />
                        {p}
                    </div>
                ))}
            </CardBody>
        </Card>
    );
}

function Milestone({ year, title, desc }: { year: string; title: string; desc: string }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-primary font-semibold">{year}</div>
            <div className="font-medium text-slate-900">{title}</div>
            <p className="text-sm text-slate-600">{desc}</p>
        </div>
    );
}

function BadgeLine({ icon, text }: { icon: React.ReactNode; text: string }) {
    return (
        <div className="flex items-center gap-2 text-sm text-slate-700">
            <span className="text-primary">{icon}</span>
            {text}
        </div>
    );
}
