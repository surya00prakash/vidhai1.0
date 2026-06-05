"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/react";
import { Button } from "@heroui/react";
import Image from "next/image";

const programs = [
    {
        title: "Namadhu Palli",
        description:
            "Namadhu Palli aims to transform government schools by enhancing infrastructure, teaching quality, and student engagement. It brings modern tools, improved sanitation, and learning materials to underserved schools. The initiative works closely with teachers and communities to create impactful changes. Emphasis is placed on joyful, interactive learning. The program helps students dream big in a vibrant school environment.",
        image: "/assets/images/programs/namadhu_palli.jpg",
    },

];


export default function CharityPrograms() {
    return (
        <section className="py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {programs.map((program, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            whileHover={{
                                scale: 1.04,
                                transition: { type: "spring", stiffness: 200, damping: 15 },
                            }}
                            className="flex h-full"
                        >
                            <Card className="flex flex-col h-full rounded-md overflow-hidden transition-all duration-300 ease-in-out">
                                {/* Image */}
                                <div className="relative w-full h-48">
                                    <Image
                                        src={program.image}
                                        alt={program.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>

                                {/* Content */}
                                <CardBody className="flex flex-col justify-between flex-grow">
                                    <div>
                                        <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                                            {program.title}
                                        </h3>
                                        <p className="text-sm text-gray-700 mb-4 text-justify">
                                            {program.description}
                                        </p>
                                    </div>

                                    {/* Optional button block */}
                                    {/* <div className="mt-auto">
        <Button
          size="sm"
          variant="flat"
          className="border-primary-300 text-primary-800 hover:bg-primary-100 font-bold"
        >
          Learn More
        </Button>
      </div> */}
                                </CardBody>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
