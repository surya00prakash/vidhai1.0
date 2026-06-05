"use client";

import {
    Input,
    Select,
    SelectItem,
    Button,
    Card,
    CardBody,
    Progress,
    Textarea,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { LuBookOpen, LuGraduationCap, LuHandHeart, LuUserCheck, LuUsers } from "react-icons/lu";

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    queryType: string;
    inquiry: string;
}

interface FormErrors {
    [key: string]: string;
}

export default function DonorForm() {
    const [formData, setFormData] = useState<FormData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        queryType: "",
        inquiry: "",
    });

    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
    const [completionProgress, setCompletionProgress] = useState(0);

    useEffect(() => {
        const requiredFields: (keyof FormData)[] = [
            "firstName", "lastName", "email", "phone", "queryType"
        ];

        let completed = 0;
        requiredFields.forEach(field => {
            const value = formData[field];
            if (typeof value === "string" && value.trim()) completed++;
        });

        setCompletionProgress((completed / requiredFields.length) * 100);
    }, [formData]);

    const handleChange = (key: keyof FormData, value: any) => {
        if (formErrors[key]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[key];
                return newErrors;
            });
        }

        setFormData(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleBlur = (field: keyof FormData) => {
        setTouchedFields(prev => new Set(prev).add(field));
        validateField(field);
    };

    const validateField = (field: keyof FormData) => {
        const value = formData[field];
        const errors: FormErrors = {};

        switch (field) {
            case "firstName":
            case "lastName":
            case "queryType":
                if (!value.trim()) {
                    errors[field] = "This field is required.";
                }
                break;

            case "email":
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    errors.email = "Please enter a valid email address.";
                }
                break;

            case "phone":
                if (!/^\d{10}$/.test(value)) {
                    errors.phone = "Please enter a valid 10-digit phone number.";
                }
                break;
        }

        setFormErrors(prev => ({ ...prev, ...errors }));
        return Object.keys(errors).length === 0;
    };

    const validate = () => {
        const errors: FormErrors = {};

        if (!formData.firstName.trim()) errors.firstName = "First name is required.";
        if (!formData.lastName.trim()) errors.lastName = "Last name is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Invalid email.";
        if (!/^\d{10}$/.test(formData.phone)) errors.phone = "Invalid 10-digit phone number.";
        if (!formData.queryType.trim()) errors.queryType = "Please select a query type.";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        const allRequiredFields = new Set([
            "firstName", "lastName", "email", "phone", "queryType"
        ]);
        setTouchedFields(allRequiredFields);

        if (!validate()) {
            const firstError = document.querySelector('[data-invalid="true"]');
            if (firstError) firstError.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch("/api/donors", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Submission failed.");

            setSubmitted(true);
        } catch (error: any) {
        } finally {
            setIsSubmitting(false);
        }
    };

    return submitted ? (
        <Card className="max-w-xl mx-auto mt-10 border-green-500 bg-green-50 shadow-sm">
            <CardBody className="text-center space-y-4 py-8">
                <LuUserCheck className="mx-auto h-10 w-10 text-green-600" />
                <h3 className="text-xl font-semibold text-green-700">
                    Inquiry Sent Successfully!
                </h3>
                <p className="text-gray-700">
                    We appreciate your interest.<br />
                    Our team will respond to your query within 48 hours.
                </p>
                <Button
                    variant="flat"
                    onPress={() => {
                        setFormData({
                            firstName: "", lastName: "", email: "", phone: "", queryType: "", inquiry: ""
                        });
                        setFormErrors({});
                        setTouchedFields(new Set());
                        setSubmitted(false);
                    }}
                >
                    Register Another
                </Button>
            </CardBody>
        </Card>
    ) : (
        <><div className="bg-gradient-to-r from-slate-50 to-blue-50 py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left Content */}
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-normal text-gray-800 leading-tight mb-6">
                            Every contribution is an
                            <span className="text-[#0891b2] font-medium"> investment in opportunity</span>
                        </h1>

                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Every contribution to Agaram is an investment in equal opportunity.
                            Your funds go directly into scholarships, hostels, mentoring, and community programmes
                            that ensure students don’t just enter college, they complete it and thrive.
                        </p>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-start space-x-3">
                                <div className="w-5 h-5 bg-[#0891b2] rounded-full mt-1 flex-shrink-0"></div>
                                <p className="text-gray-700">
                                    We dedicate all resources to reach where they are needed most, with complete transparency.
                                </p>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="w-5 h-5 bg-[#0891b2] rounded-full mt-1 flex-shrink-0"></div>
                                <p className="text-gray-700">
                                    Regular audits, public reports, and real-time updates keep you informed about your impact.
                                </p>
                            </div>

                            <div className="flex items-start space-x-3">
                                <div className="w-5 h-5 bg-[#0891b2] rounded-full mt-1 flex-shrink-0"></div>
                                <p className="text-gray-700">
                                    See the results — graduates returning as mentors, communities breaking cycles, and futures opening up.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Impact Highlights */}
                    <div className="lg:pl-12">
                        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-100">
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-medium text-gray-800 mb-2">Your Impact</h3>
                                <p className="text-gray-600 text-sm">
                                    How your support transforms lives
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                                        <LuGraduationCap className="w-6 h-6 text-[#0891b2]" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-800">Scholarships</h4>
                                        <p className="text-sm text-gray-600">Opening doors to higher education</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                                        <LuBookOpen className="w-6 h-6 text-[#0891b2]" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-800">Mentorship</h4>
                                        <p className="text-sm text-gray-600">Guiding students to thrive and graduate</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                                        <LuUsers className="w-6 h-6 text-[#0891b2]" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-800">Community Programmes</h4>
                                        <p className="text-sm text-gray-600">Breaking cycles of disadvantage</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                                        <LuHandHeart className="w-6 h-6 text-[#0891b2]" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-800">Sustainable Impact</h4>
                                        <p className="text-sm text-gray-600">Futures shaped for generations</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-gray-700 text-center italic">
                                    "When you give, you are not just funding education; you are shaping generations."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div><div className="p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md max-w-3xl mx-auto mb-20">
                <div className="text-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-semibold mb-2">Donor Inquiry</h2>
                    <div className="mt-4 mb-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{Math.round(completionProgress)}% complete</span>
                        </div>
                        <Progress
                            value={completionProgress}
                            color="primary"
                            aria-label="Progress"
                            size="md" />
                    </div>
                </div>

                <Card className="shadow-none border-none bg-white mb-8">
                    <CardBody className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="First Name"
                                value={formData.firstName}
                                onChange={(e) => handleChange("firstName", e.target.value)}
                                onBlur={() => handleBlur("firstName")}
                                isInvalid={touchedFields.has("firstName") && !!formErrors.firstName}
                                errorMessage={touchedFields.has("firstName") ? formErrors.firstName : ""}
                                isRequired />
                            <Input
                                label="Last Name"
                                value={formData.lastName}
                                onChange={(e) => handleChange("lastName", e.target.value)}
                                onBlur={() => handleBlur("lastName")}
                                isInvalid={touchedFields.has("lastName") && !!formErrors.lastName}
                                errorMessage={touchedFields.has("lastName") ? formErrors.lastName : ""}
                                isRequired />
                            <Input
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                onBlur={() => handleBlur("email")}
                                isInvalid={touchedFields.has("email") && !!formErrors.email}
                                errorMessage={touchedFields.has("email") ? formErrors.email : ""}
                                isRequired />
                            <Input
                                label="Phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                onBlur={() => handleBlur("phone")}
                                isInvalid={touchedFields.has("phone") && !!formErrors.phone}
                                errorMessage={touchedFields.has("phone") ? formErrors.phone : ""}
                                isRequired />
                            <Select
                                label="Query Type"
                                selectedKeys={[formData.queryType]}
                                onSelectionChange={(keys) => handleChange("queryType", Array.from(keys)[0] || "")}
                                onBlur={() => handleBlur("queryType")}
                                isInvalid={touchedFields.has("queryType") && !!formErrors.queryType}
                                errorMessage={touchedFields.has("queryType") ? formErrors.queryType : ""}
                                isRequired
                            >
                                {["Receipt", "Enquiry", "Others"].map((type) => (
                                    <SelectItem key={type}>
                                        {type}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                    </CardBody>
                </Card>

                <Card className="shadow-none border-none bg-white mb-4">
                    <CardBody className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Additional Inquiry</h2>
                        <Textarea
                            label="Description"
                            value={formData.inquiry}
                            onChange={(e) => handleChange("inquiry", e.target.value)}
                            rows={4}
                            placeholder="Type your message here..." />
                    </CardBody>
                </Card>

                <div className="text-center mt-8">
                    <Button
                        color="primary"
                        size="lg"
                        className="px-8"
                        onPress={handleSubmit}
                        isLoading={isSubmitting}
                        isDisabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                </div>
            </div></>
    );
}
