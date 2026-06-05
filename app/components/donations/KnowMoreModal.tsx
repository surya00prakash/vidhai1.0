"use client";

import React, { useState } from "react";
import {
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalFooter,
    Card,
    CardBody,
    Tabs,
    Tab,
} from "@heroui/react";

export default function KnowMoreModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [selectedTab, setSelectedTab] = useState("once");

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={onClose}
            placement="center"
            scrollBehavior="inside"
        >
            <ModalContent className="max-h-[90vh] border-1 border-default-300 rounded-lg">
                <ModalHeader className="text-lg font-semibold text-gray-800">
                    How Your Donation Helps
                </ModalHeader>

                <ModalBody className="overflow-y-auto space-y-6 px-5">
                    <Tabs
                        selectedKey={selectedTab}
                        onSelectionChange={(key) => setSelectedTab(key as string)}
                        size="md"
                        color="primary"
                    >
                        <Tab key="once" title="One Time">
                            <h3 className="text-md font-semibold mb-2"> One-Time Donation Options – Support a Student’s Future Today</h3>
                            <p className="text-sm text-muted-foreground mb-4">
                                Your one-time contribution can change the academic journey of a student. Choose the area that’s most meaningful to you.
                            </p>

                            {/* 1. General Academic Support */}
                            <h4 className="text-sm font-semibold mb-2">🎓 Academic Support – General Contribution</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                                Support pooled academic expenses such as tuition, hostel, mess, mentoring, and training across multiple students.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {[2000, 5000, 7000, 10000].map((amount) => (
                                    <span
                                        key={amount}
                                        className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm font-medium border-1 border-default-300"
                                    >
                                        ₹{amount.toLocaleString()}
                                    </span>
                                ))}
                            </div>

                            {/* 2. Learning & Development Sponsorship */}
                            <h4 className="text-sm font-semibold mb-2">💡 Learning & Development Sponsorship</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                                Support employability skill development, capacity building, and holistic training of a specific student.
                            </p>
                            <p className="text-sm text-gray-700 mb-3">₹10,000 per student</p>
                            <p className="text-xs text-muted-foreground mb-4">
                                📌 A Report will be shared upon completion of the student's training year.
                            </p>

                            {/* 3. One-Year Sponsorship */}
                            <h4 className="text-sm font-semibold mb-2">👩‍🎓 Academic Support – Individual Student Sponsorship (One Year)</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                                Fund a student’s complete academic and residential expenses for one full year.
                            </p>
                            <div className="space-y-4 mb-4">
                                <Card className="border-1 border-default-300 rounded-lg">
                                    <CardBody className="p-4 space-y-1">
                                        <p className="text-sm font-semibold text-gray-800">🎓 Arts & Sciences</p>
                                        <p className="text-sm text-gray-700">₹60,000 – Hostel Fee Support - Food and Accommodation</p>
                                    </CardBody>
                                </Card>
                                <Card className="border-1 border-default-300 rounded-lg">
                                    <CardBody className="p-4 space-y-1">
                                        <p className="text-sm font-semibold text-gray-800">🧑‍⚕️ Professional Courses</p>
                                        <p className="text-sm text-gray-700">₹1,00,000 – Tuition & Hostel Fee Support -Tution, Food and Accommodation</p>
                                    </CardBody>
                                </Card>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                📌 A Report will be shared after the first academic year.
                            </p>

                            {/* 4. Full Course Sponsorship */}
                            <h4 className="text-sm font-semibold mt-6 mb-2">👩‍🎓 Academic Support – Individual Student Sponsorship (Full Course)</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                                Support a student throughout their entire degree including academics, residential care, and training and workshops.
                            </p>
                            <div className="space-y-4 mb-4">
                                <Card className="border-1 border-default-300 rounded-lg">
                                    <CardBody className="p-4 space-y-1">
                                        <p className="text-sm font-semibold text-gray-800">🎓 Arts & Sciences</p>
                                        <p className="text-sm text-gray-700">₹2,50,000 – 3 years</p>
                                        <p className="text-sm text-gray-700">
                                            Includes Tuition, Hostel & Training Fee Support -Tution, Food, Accommodation and Training.
                                        </p>
                                    </CardBody>
                                </Card>
                                <Card className="border-1 border-default-300 rounded-lg">
                                    <CardBody className="p-4 space-y-1">
                                        <p className="text-sm font-semibold text-gray-800">🧑‍💻 Professional Courses</p>
                                        <p className="text-sm text-gray-700">₹4,50,000 – 4 years</p>
                                        <p className="text-sm text-gray-700">
                                            Includes Tuition, Hostel & Training Fee Support -Tution, Food, Accommodation and Training.
                                        </p>
                                    </CardBody>
                                </Card>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                📌 Periodic progress reports will be shared throughout the course.
                            </p>

                            {/* 5. Corpus Support */}
                            <h4 className="text-sm font-semibold mt-6 mb-2">🎯 Corpus Support – Long-Term Impact Investment</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                                Contribute to our education endowment for sustainability and future impact.
                            </p>
                            <div className="flex gap-3 mb-2">
                                {[500000].map((amount) => (
                                    <span
                                        key={amount}
                                        className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm font-medium border-1 border-default-300"
                                    >
                                        ₹{(amount / 100000).toFixed(0)} Lakh
                                    </span>
                                ))}
                            </div>

                            {/* 6. Collective Impact */}
                            <h4 className="text-sm font-semibold mt-6 mb-2">🤝 Collective Impact – </h4>
                            <p className="text-sm text-muted-foreground mb-2">
                                Supports 10 Arts & Science Students or 5 Professional Course Students
                            </p>
                            <p className="text-sm text-gray-700 mb-1">₹5,00,000 per year</p>
                            <p className="text-xs text-muted-foreground">
                                📌 Covers comprehensive academic, residential support. Report will be shared after completion.
                            </p>
                        </Tab>

                        <Tab key="monthly" title="Every Month">
                            <p className="text-md font-semibold text-gray-800">📅 Maadham 300</p>
                            <p className="text-sm text-gray-700 mb-4">Donate ₹300 per month - General Contribution</p>

                            {/* Monthly General Contribution */}
                            <h3 className="text-md font-semibold mb-2">
                                🎓 Academic Support – General Contribution
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3">
                                Monthly support for multiple students' ongoing needs.
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {[500, 1000, 2000].map((amount) => (
                                    <span
                                        key={amount}
                                        className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm font-medium border-1 border-default-300"
                                    >
                                        ₹{amount}
                                    </span>
                                ))}
                            </div>

                            {/* Monthly Sponsorship Options */}
                            <h3 className="text-md font-semibold mb-2">
                                👩‍🎓 Individual Sponsorship – Monthly
                            </h3>

                            <Card className="mb-4 border-1 border-default-300 rounded-lg">
                                <CardBody className="p-4 space-y-2">
                                    <p className="text-sm font-semibold text-gray-800">
                                        🎨 Arts / Humanities Students
                                    </p>
                                    <p className="text-sm text-gray-700">₹5,000 / month</p>
                                    <p className="text-sm text-gray-700">
                                        Duration: 12 months or full course (36 months)<br />
                                        Hostel Fee Support - Food and Accommodation
                                    </p>
                                </CardBody>
                            </Card>

                            <Card className="mb-4 border-1 border-default-300 rounded-lg">
                                <CardBody className="p-4 space-y-2">
                                    <p className="text-sm font-semibold text-gray-800">
                                        🧑‍💻 Professional Course Students
                                    </p>
                                    <p className="text-sm text-gray-700">₹8,500 / month</p>
                                    <p className="text-sm text-gray-700">
                                        Duration: 12 months or full course (48 months)<br />Tuition & Hostel Fee Support -Tution, Food and Accommodation
                                    </p>
                                </CardBody>
                            </Card>

                            <p className="text-xs text-muted-foreground mt-2">
                                📌 Report will be shared after completion.
                            </p>
                        </Tab>
                    </Tabs>
                </ModalBody>

                <ModalFooter />
            </ModalContent>
        </Modal>
    );
}
