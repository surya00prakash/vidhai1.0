"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/react";
import { Button } from "@heroui/react";
import Image from "next/image";

const programs = [
  {
    title: "Vidhai",
    description:
      "The Vidhai programme supports first-generation learners through college by offering tuition aid, mentorship, and continuous guidance. It doesn't stop at admission; it stays with the student until they are ready to stand on their own.",
    image: "/assets/images/programs/vidhai.jpg",
  },
  {
    title: "Agaram Mentorship",
    description:
      "Mentors form the backbone of Agaram. Through regular one-on-one interactions, they help students make sense of challenges, choices, and next steps, offering not just advice but presence.",
    image: "/assets/images/programs/mentorship.jpg",
  },
  {
    title: "Agaram Hostels",
    description:
      "More than a roof over their heads, Agaram Hostels give every student a holistic learning environment fostering independence, adaptability, and growth beyond the classroom.",
    image: "/assets/images/programs/agaram_hostel.jpg",
  },
  {
    title: "Nammadhu Palli Fellowship",
    description:
      "Launched in 2022, this program places young changemakers in rural government schools to boost learning, cut dropouts, and engage communities. With 50 fellows in 49 schools, it's turning classrooms into engines of lasting change.",
    image: "/assets/images/programs/namadhu_palli.jpg",
  },
  {
    title: "Sivakumar Educational Trust",
    description:
      "Established by actor Sivakumar, this 47-year legacy laid the foundation for Agaram. It continues to support students through scholarships, awards, and a deep belief that education changes everything quietly, steadily, for the long term.",
    image: "/assets/images/programs/sivakumar_edu_trust.jpg",
  },
];

export default function CharityPrograms() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-secondary-800 mb-4"
          >
            Our Key Initiatives
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="w-24 h-1 bg-primary-400 mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-lg text-secondary-600 max-w-2xl mx-auto"
          >
            Empowering communities through education and creating lasting change
          </motion.p>
        </div>

        {/* Programs Grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8"
        >
          {programs.map((program, index) => {
            // Desktop column span logic
            let colSpan = "";
            if (index <= 2) {
              // First 3 cards: each spans 2 columns (1/3 width each)
              colSpan = "lg:col-span-2";
            } else {
              // Last 2 cards: each spans 3 columns (1/2 width each)
              colSpan = "lg:col-span-3";
            }

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3, ease: "easeOut" }
                }}
                className={`group ${colSpan}`}
              >
                <Card className="h-full bg-white border-0 shadow-lg hover:shadow-2xl transition-all duration-500 ease-out overflow-hidden">
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={program.image}
                      alt={program.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300" />
                  </div>

                  <CardBody className="p-8">
                    {/* Program Title */}
                    <h3 className="text-xl font-bold text-secondary-800 mb-4 group-hover:text-primary-600 transition-colors duration-300">
                      {program.title}
                    </h3>

                    {/* Description */}
                    <p className="text-secondary-600 leading-relaxed">
                      {program.description}
                    </p>
                  </CardBody>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}