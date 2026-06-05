"use client";

import type { CardProps } from "@heroui/react";
import React from "react";
import { Card, Image, CardBody } from "@heroui/react";

export default function FounderMessage(props: CardProps) {
    return (
        <Card className="overflow-hidden rounded-none" {...props}>
            <CardBody className="flex flex-col md:flex-row p-6 md:p-20 gap-6">
                {/* Left image */}
                <div className="w-full md:w-1/3 min-w-[200px]">
                    <Image
                        removeWrapper
                        alt="Acme Creators"
                        className="h-64 md:h-full w-full object-cover object-top"
                        src="/assets/images/mission/founder-message.webp"
                    />
                </div>

                {/* Right content */}
                <div className="flex-1 px-0 md:px-6 py-2 md:py-5">
                    <h3 className="text-2xl md:text-3xl text-secondary-500 font-semibold">
                        Founder’s Message
                    </h3>
                    <div className="text-base md:text-lg text-secondary-400 flex flex-col gap-3 pt-2 leading-relaxed">
                        <p>
                            Our dream is simple: A society where everyone stands on equal ground. I call it simple because something this fundamental should be, but the reality is far from it. That’s why our fight is about more than good intentions; it’s about building a world where fairness isn’t a privilege. Not because luck favoured them, but because opportunity did. And the surest way we know to get there is through education.
                            <br /><br />
                            Why education? Because it doesn’t just change a child’s report card, it changes their horizon. It passes on the tools, the values, and the confidence to step into the world on their terms. Give it to one child, and you set in motion a ripple, a butterfly effect that shapes not just their life, but entire generations to come.
                            <br /><br />
                            At Agaram, this is the heartbeat of our work. Not just handing out degrees, but cultivating futures capable of carrying the weight of a fairer tomorrow for decades, for lifetimes. And we are doing it shoulder-to-shoulder with volunteers, well-wishers, and fellow dreamers, each adding their own thread to this fabric of change in society. An equal society isn’t a finished portrait; we have added our strokes, but the canvas still calls for many more hands, and that’s what we are working to bring together.
                        </p>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
}
