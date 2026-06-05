"use client";

import React, { useState } from "react";
import { Card, CardBody, Button } from "@heroui/react";
import Carousel from "@/components/partners/PartnersCollegeCarousal";
import PartnersGrid from "@/components/partners/PartnersGrid";
import { partners } from "@/data/partners";
import { Partner } from "@/types/partners";
import CorporatePartners from "@/components/partners/CorporatePartners";
import PartnerSections from "@/components/partners/PartnerSections";

const groupByType = (partnersArray: Partner[]) => {
    return partnersArray.reduce((acc: Record<string, Partner[]>, partner) => {
        partner.types.forEach((type) => {
            if (!acc[type]) acc[type] = [];
            acc[type].push(partner);
        });
        return acc;
    }, {});
};

const partners_by_type = groupByType(partners);
const tabItems = ["All", ...Object.keys(partners_by_type)];

const Partners = () => {
    const [activeTab, setActiveTab] = useState("All");

    const dataToShow =
        activeTab === "All" ? partners : partners_by_type[activeTab] || [];

    return (
        <div className="w-full">
            <section className="max-w-7xl mx-auto py-8">
                {/* Category Buttons */}
                <div className="flex flex-wrap justify-center gap-3">
                    {tabItems.map((label) => (
                        <Button
                            key={label}
                            variant={activeTab === label ? "solid" : "flat"}
                            color="primary"
                            radius="full"
                            onPress={() => setActiveTab(label)}
                            className={`${activeTab === label
                                ? "activeTab text-white"
                                : "inactiveTab"
                                } capitalize text-md font-semibold`}
                        >
                            {label}
                        </Button>
                    ))}
                </div>

                {/* Partner Display */}
                <Card className="shadow-none mt-8">
                    <CardBody className="px-0">
                        {activeTab === "All" ? (
                            <Carousel data={partners} title="Institutional Partners" />
                        ) : (
                            <PartnersGrid
                                title={`${activeTab} Partners`}
                                data={dataToShow}
                            />
                        )}
                    </CardBody>
                </Card>

            </section>
        </div>
    );
};

export default Partners;
