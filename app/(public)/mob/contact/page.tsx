"use client"

import { Image, Link, Card, CardBody, Divider } from '@heroui/react';
import React from 'react';
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp, FaYoutube } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { LuMail, LuMapPin, LuPhone, LuClock } from 'react-icons/lu';

const ContactPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Hero Section */}
            <div className="bg-secondary-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
                    <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                        Get in touch with Agaram Foundation. We're here to help educate children and change lives.
                    </p>
                    <div style={{ fontFamily: '"Caveat", cursive' }} className='text-primary text-4xl mt-4'>
                        #change<span className='text-white'>a</span>life
                    </div>
                </div>
            </div>

            {/* Contact Information Section */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Contact Details */}
                    <div className="space-y-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">Get In Touch</h2>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                Reach out to us for any inquiries about our mission, programs, or how you can contribute to changing lives through education.
                            </p>
                        </div>

                        {/* Contact Cards */}
                        <div className="space-y-6">
                            {/* Office Address */}
                            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardBody className="p-6">
                                    <div className="flex items-start space-x-4">
                                        <div className="bg-primary/10 p-3 rounded-full">
                                            <LuMapPin size={24} className="text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Office Address</h3>
                                            <address className="not-italic text-gray-600 leading-relaxed">
                                                4/15, Arulambal Street, T.Nagar,<br />
                                                Chennai - 600 017<br />
                                                Tamil Nadu, India
                                            </address>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Email */}
                            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardBody className="p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-blue-100 p-3 rounded-full">
                                            <LuMail size={24} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Email Us</h3>
                                            <Link
                                                href="mailto:info@agaram.in"
                                                className="text-blue-600 hover:text-blue-800 transition-colors duration-200 text-lg"
                                            >
                                                info@agaram.in
                                            </Link>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* Phone */}
                            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardBody className="p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-green-100 p-3 rounded-full">
                                            <LuPhone size={24} className="text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Call Us</h3>
                                            <Link
                                                href="tel:+919841891000"
                                                className="text-green-600 hover:text-green-800 transition-colors duration-200 text-lg"
                                            >
                                                +91 98418 91000
                                            </Link>
                                            <p className="text-gray-500 text-sm mt-1">Support & General Inquiries</p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>

                            {/* WhatsApp */}
                            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                                <CardBody className="p-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-green-100 p-3 rounded-full">
                                            <FaWhatsapp size={24} className="text-green-500" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-2">WhatsApp</h3>
                                            <Link
                                                href="https://wa.me/919841891000"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-green-500 hover:text-green-700 transition-colors duration-200 text-lg"
                                            >
                                                +91 98418 91000
                                            </Link>
                                            <p className="text-gray-500 text-sm mt-1">Quick messages & support</p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </div>
                    </div>

                    {/* Organization Info & Social Media */}
                    <div className="space-y-8">
                        {/* Logo and Mission */}


                        {/* Social Media */}
                        <Card className="shadow-lg">
                            <CardBody className="p-8">
                                <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Connect With Us</h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <Link
                                        href="https://www.facebook.com/agaramfoundation"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-col items-center p-4 rounded-lg hover:bg-blue-50 transition-colors duration-200 group"
                                    >
                                        <FaFacebook className="w-8 h-8 text-gray-600 group-hover:text-blue-600 mb-2" />
                                        <span className="text-sm text-gray-600 group-hover:text-blue-600">Facebook</span>
                                    </Link>

                                    <Link
                                        href="https://x.com/agaramvision?t=2QUd1JKQWJ-bHdFAO8HZeg&s=09"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                                    >
                                        <FaXTwitter className="w-8 h-8 text-gray-600 group-hover:text-gray-800 mb-2" />
                                        <span className="text-sm text-gray-600 group-hover:text-gray-800">Twitter</span>
                                    </Link>

                                    <Link
                                        href="https://www.linkedin.com/company/agaram-foundation/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-col items-center p-4 rounded-lg hover:bg-blue-50 transition-colors duration-200 group"
                                    >
                                        <FaLinkedin className="w-8 h-8 text-gray-600 group-hover:text-blue-600 mb-2" />
                                        <span className="text-sm text-gray-600 group-hover:text-blue-600">LinkedIn</span>
                                    </Link>

                                    <Link
                                        href="https://wa.me/919841891000"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-col items-center p-4 rounded-lg hover:bg-green-50 transition-colors duration-200 group"
                                    >
                                        <FaWhatsapp className="w-8 h-8 text-gray-600 group-hover:text-green-500 mb-2" />
                                        <span className="text-sm text-gray-600 group-hover:text-green-500">WhatsApp</span>
                                    </Link>

                                    <Link
                                        href="https://www.instagram.com/agaram_foundation_official?igsh=ZDc2eHJ3dThkNmxq"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-col items-center p-4 rounded-lg hover:bg-pink-50 transition-colors duration-200 group"
                                    >
                                        <FaInstagram className="w-8 h-8 text-gray-600 group-hover:text-pink-500 mb-2" />
                                        <span className="text-sm text-gray-600 group-hover:text-pink-500">Instagram</span>
                                    </Link>

                                    <Link
                                        href="https://youtube.com/@agaramfoundation4745?si=MVOG8HIlJMFTqgv9"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex flex-col items-center p-4 rounded-lg hover:bg-red-50 transition-colors duration-200 group"
                                    >
                                        <FaYoutube className="w-8 h-8 text-gray-600 group-hover:text-red-500 mb-2" />
                                        <span className="text-sm text-gray-600 group-hover:text-red-500">YouTube</span>
                                    </Link>
                                </div>
                            </CardBody>
                        </Card>


                    </div>
                </div>

                {/* Additional Info Section */}
                <div className="mt-16">
                    <Card className="shadow-lg bg-secondary-900 text-white">
                        <CardBody className="p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h2>
                                <p className="text-gray-300 max-w-3xl mx-auto">
                                    Whether you want to donate, volunteer, or learn more about our programs, we're here to help you get involved in changing lives through education.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                                <div>
                                    <LuMail size={32} className="mx-auto mb-3 text-primary" />
                                    <h3 className="font-semibold mb-2">Email Us</h3>
                                    <p className="text-gray-300 text-sm">General inquiries & information</p>
                                </div>
                                <div>
                                    <LuPhone size={32} className="mx-auto mb-3 text-primary" />
                                    <h3 className="font-semibold mb-2">Call Us</h3>
                                    <p className="text-gray-300 text-sm">Immediate support & assistance</p>
                                </div>
                                <div>
                                    <FaWhatsapp size={32} className="mx-auto mb-3 text-primary" />
                                    <h3 className="font-semibold mb-2">WhatsApp</h3>
                                    <p className="text-gray-300 text-sm">Quick messages & updates</p>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;