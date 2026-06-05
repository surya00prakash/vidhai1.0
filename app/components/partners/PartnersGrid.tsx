"use client";

import React from "react";
import { Card } from "@heroui/react";
import Image from "next/image";

type Partner = {
    name: string;
    location: string;
    totalStudents?: number;
    currentStudents?: number;
    logo?: string;
};

type Props = {
    title?: string;
    data: Partner[];
};

const PartnersGrid: React.FC<Props> = ({ title = "Our Partners", data }) => {
    return (
        <section className="bg-white py-10 px-4 sm:px-6 lg:px-10">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold text-center text-secondary mb-16">
                    {title}
                </h2>

                <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {data.map((partner, index) => (
                        <Card
                            key={index}
                            className="bg-white rounded-2xl transition duration-300 p-6 flex flex-col justify-between border-2 border-gray-300 group hover:border-primary/40 shadow-none"
                        >
                            {/* Top: Logo + Info */}
                            <div className="flex flex-col items-center text-center space-y-4">

                                <div>
                                    <h3 className="text-md font-semibold">{partner.name}</h3>
                                    <p className="text-sm text-default-800">{partner.location}</p>
                                </div>
                            </div>

                            {/* Bottom: Stats */}
                            {(partner.totalStudents || partner.currentStudents) && (
                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 text-sm text-gray-700">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-500">Current Students</p>
                                        <p className="text-primary text-lg font-bold">
                                            {partner.currentStudents ?? "—"}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-500">Total Students</p>
                                        <p className="text-primary text-lg font-bold">
                                            {partner.totalStudents ?? "—"}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PartnersGrid;
