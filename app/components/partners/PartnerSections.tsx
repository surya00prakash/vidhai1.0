"use client";

import React from "react";
import { Card, CardBody, Avatar } from "@heroui/react";

const categories = [
    {
        title: "Patrons",
        items: [
            { name: "NAPC Properties Ltd", location: "Chennai" },
            { name: "Ramraj Cotton", location: "Tiruppur" },
            { name: "Sakthi Masala", location: "Erode" },
            { name: "Saravana Stocks Pvt Ltd", location: "Chennai" },
            { name: "Star Vijay TV", location: "" },
            { name: "Watertec (India) Pvt Ltd", location: "Coimbatore" },
            { name: "Bank of India", location: "Educational Loan Assistance" },
        ],
    },
    {
        title: "Training Partners",
        items: [
            { name: "Dream Chasers", location: "Chennai" },
            { name: "Rane Group", location: "Chennai" },
            { name: "Shankar IAS Academy", location: "Chennai" },
            { name: "SMART's Institute for Career Assurance", location: "Chennai" },
            { name: "The ABK - AOTS DOSOKAI", location: "Chennai" },
            { name: "Worldwide Education", location: "Salem" },
        ],
    },
    {
        title: "Venue Partners",
        items: [
            { name: "APL Global School", location: "Chennai" },
            { name: "Dr. MGR Janaki College of Arts and Science for Women", location: "Chennai" },
            { name: "Sathyabama University", location: "Chennai" },
        ],
    },
];

const PartnerSection: React.FC = () => {
    return (
        <section className="w-full py-16 bg-white">
            <h2 className="text-4xl font-bold text-center text-secondary mb-12">
                Our Partners
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
                {categories.map((category, index) => (
                    <Card
                        key={index}
                        className="rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                        <CardBody className="p-6 space-y-6">
                            <h3 className="text-2xl font-semibold text-primary">
                                {category.title}
                            </h3>

                            <div className="flex flex-col gap-4">
                                {category.items.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-4 p-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition w-full"
                                    >{/* 
                                        <Avatar
                                            src={`https://i.pravatar.cc/150?u=partner-${category.title}-${i}`}
                                            radius="full"
                                            className="ring-1 ring-gray-300 w-12 h-12"
                                        /> */}
                                        <div className="text-left">
                                            <p className="font-medium text-gray-900">{item.name}</p>
                                            <p className="text-sm text-gray-500">{item.location || "—"}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardBody>
                    </Card>
                ))}
            </div>
        </section>
    );
};

export default PartnerSection;
