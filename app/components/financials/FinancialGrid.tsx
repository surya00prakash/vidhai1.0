'use client';

import { useState } from 'react';
import { LuFile, LuFolder, LuHeart, LuShield, LuTrendingUp, LuUsers } from 'react-icons/lu';
import { TbCoinRupeeFilled } from 'react-icons/tb';

type Item = {
    id: number;
    name: string;
    date: string;
    type: 'folder' | 'file';
    file: string;
};

const initialItems: Item[] = [
    { id: 1, name: 'Financial Statements', date: '2015 - 2016', type: 'folder', file: '/assets/documents/financials/FRCA_2015-2016.pdf' },
    { id: 2, name: 'Financial Statements', date: '2016 - 2017', type: 'folder', file: '/assets/documents/financials/FRCA_2016-2017.pdf' },
    { id: 3, name: 'Financial Statements', date: '2017 - 2018', type: 'folder', file: '/assets/documents/financials/FRCA_2017-2018.pdf' },
    { id: 4, name: 'Financial Statements', date: '2018 - 2019', type: 'folder', file: '/assets/documents/financials/FRCA_2018-2019.pdf' },
    { id: 5, name: 'Financial Statements', date: '2019 - 2020', type: 'folder', file: '/assets/documents/financials/FRCA_2019-2020.pdf' },
    { id: 6, name: 'Financial Statements', date: '2020 - 2021', type: 'folder', file: '/assets/documents/financials/FRCA_2020-2021.pdf' },
    { id: 7, name: 'Financial Statements', date: '2021 - 2022', type: 'folder', file: '/assets/documents/financials/FRCA_2021-2022.pdf' },
    { id: 8, name: 'Financial Statements', date: '2022 - 2023', type: 'folder', file: '/assets/documents/financials/FRCA_2022-2023.pdf' },
    { id: 9, name: 'Financial Statements', date: '2023 - 2024', type: 'folder', file: '/assets/documents/financials/FRCA_2023-2024.pdf' },
];

export default function FinancialDashboard() {
    const [items] = useState(initialItems);

    return (
        <div className="relative min-h-screen bg-gray-50 overflow-hidden">
            {/* Enhanced Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -left-16 -top-16 w-96 h-96 rounded-full bg-primary-500/8 blur-3xl" />
                <div className="absolute right-0 top-1/3 w-80 h-80 rounded-full bg-primary-500/6 blur-3xl" />
                <div className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-primary-400/4 blur-3xl" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 py-12">
                {/* Enhanced Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-500 mb-8 shadow-lg">
                        <TbCoinRupeeFilled className="h-10 w-10 text-white" />
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold text-primary-600 mb-6">
                        Financials: Local Funds & Foreign Contribution (FC)
                    </h1>

                    <div className="max-w-4xl mx-auto">
                        <p className="text-xl text-gray-700 leading-relaxed mb-8">
                            Every contribution to Agaram, whether from India or abroad, is treated with care, transparency, and purpose. We recognise that trust is built not just through results, but through accountability in how we get there.
                        </p>

                        {/* Key Points Grid */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8">
                            <div className="flex items-start space-x-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                                    <LuUsers className="h-6 w-6 text-primary-600" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-900 mb-1">Diverse Funding Sources</h3>
                                    <p className="text-gray-600 text-sm">Individual donors, corporate CSR partners, institutional grants, and foreign contributions under FCRA compliance.</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                                    <LuShield className="h-6 w-6 text-primary-600" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-900 mb-1">Full Accountability</h3>
                                    <p className="text-gray-600 text-sm">Each rupee is accounted for, audited, and directed towards programs that directly support students.</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                                    <LuTrendingUp className="h-6 w-6 text-primary-600" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-900 mb-1">Direct Impact</h3>
                                    <p className="text-gray-600 text-sm">Contributions go directly to programs reaching students and communities with real-time impact updates.</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/40">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                                    <LuHeart className="h-6 w-6 text-primary-600" />
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-900 mb-1">Transparency as Responsibility</h3>
                                    <p className="text-gray-600 text-sm">We see transparency not as a requirement but as a responsibility to our supporters.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary-50 rounded-2xl p-6 border border-primary-100">
                            <p className="text-gray-700 leading-relaxed">
                                Whether you are giving as an individual or as part of an organisation, we want you to know exactly where your support is going and what it's making possible. From tuition and hostel fees to mentorship, training, and infrastructure development in schools.
                            </p>
                        </div>
                    </div>
                </div>


                {/* Documents Section */}
                <div>
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">FCRA Financial Documents</h2>
                        <p className="text-gray-600">Filing Process FCRA - Funds received by Agaram Foundation via FCRA</p>
                    </div>

                    {/* Simple Document Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {initialItems
                            .slice()
                            .sort((a, b) => {
                                const yearA = parseInt(a.date.split(" - ")[0], 10);
                                const yearB = parseInt(b.date.split(" - ")[0], 10);
                                return yearB - yearA;
                            })
                            .map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-primary-200 transition-all duration-200"
                                >
                                    <a href={item.file} target="_blank" rel="noopener noreferrer">
                                        {/* Header */}
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="rounded-lg p-2 bg-primary-100">
                                                    {item.type === 'folder' ? (
                                                        <LuFolder className="h-5 w-5 text-primary-600" />
                                                    ) : (
                                                        <LuFile className="h-5 w-5 text-primary-600" />
                                                    )}
                                                </div>
                                                <span className="font-semibold text-gray-900">{item.date}</span>
                                            </div>
                                            <TbCoinRupeeFilled className="h-6 w-6 text-primary-500" />
                                        </div>

                                        {/* Content */}
                                        <div className="mb-4">
                                            <div className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                                                FCRA ACCOUNTS
                                            </div>
                                            <div className="text-gray-700">
                                                {item.name}
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">View Report</span>
                                            <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors duration-200">
                                                Open PDF
                                            </span>
                                        </div>
                                    </a>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}