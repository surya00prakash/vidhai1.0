"use client";

import { Button } from '@heroui/react';
import Link from 'next/link';
import { ReactNode } from 'react';
import { LuArrowRight, LuGraduationCap, LuHeart, LuMapPin } from 'react-icons/lu';

export default function PartnersLayoutClient({ children }: { children: ReactNode }) {
    return (
        <div className="w-full">
            {/* Hero Banner */}
            <section
                className="relative bg-cover bg-center min-h-[320px] sm:min-h-[420px] lg:min-h-[520px] flex items-center justify-center px-4 sm:px-8"
                style={{ backgroundImage: "url('/assets/images/partners/partner_banner.jpg')" }}
            >
                <div className="absolute inset-0 bg-black/60 z-0" />
                <div className="relative z-10 max-w-3xl w-full text-center text-white space-y-6 py-10 sm:py-16">
                    <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold">
                        Our Trusted Partners
                    </h1>
                    <p className="text-white text-base sm:text-lg lg:text-xl">
                        We work with organizations that care about real impact. Through strong partnerships, we bring innovation, education, and empowerment to the people who need it most.
                    </p>
                    <Button
                        as={Link}
                        size="lg"
                        href="/contact"
                        color="primary"
                        className="rounded-full text-base sm:text-lg px-6 py-4 text-white"
                        endContent={<LuArrowRight className="w-5 h-5" />}
                    >
                        Become a Partner
                    </Button>
                </div>
            </section>

            {/* Main Content Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
                <div className="max-w-6xl mx-auto">
                    {/* Impact Stats */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                            <LuHeart className="w-4 h-4" />
                            Our Partnership Impact
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-primary mb-2">4,700+</div>
                                <div className="text-secondary-light text-sm">Students Supported</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-primary mb-2">35+</div>
                                <div className="text-secondary-light text-sm">Partner Institutions</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-primary mb-2">15+</div>
                                <div className="text-secondary-light text-sm">Years of Collaboration</div>
                            </div>
                        </div>
                    </div>

                    {/* College Partners Section */}
                    <div className="mb-20">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-primary/10 rounded-xl">
                                <LuGraduationCap className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-secondary">Our Educational Partners</h2>
                                <p className="text-secondary-light">The backbone of our mission</p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 sm:p-10 mb-8">
                            <div className="grid lg:grid-cols-2 gap-8 items-center">
                                <div className="space-y-6">
                                    <p className="text-lg text-secondary leading-relaxed">
                                        Agaram&apos;s journey wouldn&apos;t be possible without our biggest backbone - <strong>the colleges that open their doors to first-generation learners.</strong> Over the years, our partner institutions across Tamil Nadu have been instrumental in transforming lives.
                                    </p>
                                    <p className="text-secondary-light">
                                        These colleges don&apos;t just provide an education; they give our students a fighting chance to rewrite their futures through comprehensive support and unwavering commitment.
                                    </p>
                                </div>
                                <div className="bg-white rounded-xl p-6 shadow-lg">
                                    <h3 className="text-lg font-semibold text-secondary mb-4">What Our Partners Provide:</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-primary rounded-full" />
                                            <span className="text-secondary-light">Full scholarships for deserving students</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-primary rounded-full" />
                                            <span className="text-secondary-light">Reserved seat allocations</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-primary rounded-full" />
                                            <span className="text-secondary-light">Hostel facilities and accommodation</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-primary rounded-full" />
                                            <span className="text-secondary-light">Dedicated academic support</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Vision Statement */}
                    <div className="text-center bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-2xl p-8 sm:p-12">
                        <div className="max-w-3xl mx-auto">
                            <h3 className="text-2xl font-bold text-secondary mb-4">
                                Together We Build the Future
                            </h3>
                            <p className="text-lg text-secondary-light leading-relaxed">
                                Together, our partners form the ecosystem that makes Agaram&apos;s vision a living, breathing reality. Every scholarship granted, every door opened, and every opportunity created brings us closer to a world where education truly has the power to transform lives.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <div>{children}</div>
        </div>
    );
}
