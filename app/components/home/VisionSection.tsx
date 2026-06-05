'use client'

import React from 'react'

const VisionSection = () => {
    return (
        <section className="relative w-full mt-10 py-8 px-6 md:px-12 bg-black text-white overflow-hidden flex flex-col items-center gap-6 text-center">

            <div className="flex flex-col items-center gap-6 text-center">

                {/* Heading */}
                <h2 className="text-3xl font-bold">Vision</h2>

                {/* Paragraph */}
                <p className="text-lg max-w-xl">
                    To bring about a significant positive change in the socio-economic status of the rural society by offering quality education to the deserving individual.
                </p>
            </div>
        </section>
    )
}

export default VisionSection
