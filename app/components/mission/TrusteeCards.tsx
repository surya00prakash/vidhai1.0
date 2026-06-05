'use client'

import { Card, CardBody } from "@heroui/react"
import { motion } from "framer-motion"

const trustees = [
    {
        name: "Mr. S Suriya",
        role: "Founder Trustee",
    },
    {
        name: "Mr. Si Karthi",
        role: "Trustee",
    },
    {
        name: "Mr. TJ Gnanavel",
        role: "Secretary Trustee",
    },
    {
        name: "Ms. Jaishree Damodaran",
        role: "Managing Trustee",
    }
]

export default function TrusteeCards() {
    return (
        <section className="max-w-7xl mx-auto px-4 py-10">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-2">The Trust</h2>
                <p className="text-muted-foreground text-base max-w-xl mx-auto">
                    Our mission is taken forward by our trust backed by the following accomplished individuals.
                </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {trustees.map((person, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="w-full"
                    >
                        <Card className="rounded-2xl shadow-xl p-4 text-center bg-white/80 backdrop-blur-md">
                            <CardBody className="flex flex-col items-center gap-3">

                                <div className="text-lg font-semibold text-foreground">{person.name}</div>
                                <div className="text-sm text-muted-foreground">{person.role}</div>
                            </CardBody>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    )
}
