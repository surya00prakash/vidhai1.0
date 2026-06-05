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
    Checkbox
} from "@heroui/react";
import { useState, useEffect } from "react";
import { LuBookOpen, LuGraduationCap, LuHandHeart, LuUserCheck, LuUsers } from "react-icons/lu";

interface FormData {
    collegeName: string;
    email: string;
    phone: string;
    contactPerson: string;
    address: string;
    country: string;
    state: string;
    city: string;
    pincode: string;
    website: string;
    supportTypes: string[];
    inquiry: string;
    agreed: boolean;
}

interface FormErrors {
    [key: string]: string;
}

const SUPPORT_OPTIONS = [
    "Seats Sponsorship",
    "Training / Placement / Internship",
    "Other Support"
];

export default function EducationalInstitutionForm() {
    const [formData, setFormData] = useState<FormData>({
        collegeName: "",
        email: "",
        phone: "",
        contactPerson: "",
        address: "",
        country: "",
        state: "",
        city: "",
        pincode: "",
        website: "",
        supportTypes: [],
        inquiry: "",
        agreed: false
    });

    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
    const [completionProgress, setCompletionProgress] = useState(0);

    useEffect(() => {
        const requiredFields: (keyof FormData)[] = [
            "collegeName", "email", "phone", "contactPerson",
            "address", "country", "state", "city", "pincode",
            "supportTypes", "agreed"
        ];

        let completed = 0;
        requiredFields.forEach(field => {
            const value = formData[field];
            if (typeof value === "string" && value.trim()) completed++;
            if (Array.isArray(value) && value.length > 0) completed++;
            if (typeof value === "boolean" && value === true) completed++;
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
            [key]: value
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
            case "collegeName":
            case "contactPerson":
            case "address":
            case "country":
            case "state":
            case "city":
            case "pincode":
                if (typeof value === "string" && !value.trim()) {
                    errors[field] = "This field is required.";
                }
                break;

            case "email":
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
                    errors.email = "Invalid email.";
                }
                break;

            case "phone":
                if (!/^\d{10,15}$/.test(String(value))) {
                    errors.phone = "Phone number must be between 10 and 15 digits.";
                }
                break;

            case "supportTypes":
                if (!Array.isArray(value) || value.length === 0) {
                    errors.supportTypes = "Please select at least one type.";
                }
                break;

            case "agreed":
                if (value !== true) {
                    errors.agreed = "You must agree to the terms.";
                }
                break;
        }

        setFormErrors(prev => ({ ...prev, ...errors }));
        return Object.keys(errors).length === 0;
    };

    const validate = () => {
        const fieldsToValidate: (keyof FormData)[] = [
            "collegeName", "email", "phone", "contactPerson", "address",
            "country", "state", "city", "pincode", "supportTypes", "agreed"
        ];

        fieldsToValidate.forEach(field => {
            validateField(field);
        });

        return Object.keys(formErrors).length === 0;
    };

    const handleSubmit = async () => {
        const allFields = new Set<keyof FormData>(["collegeName", "email", "phone", "contactPerson", "address", "country", "state", "city", "pincode", "supportTypes", "agreed"]);
        setTouchedFields(allFields);

        if (!validate()) {
            const firstError = document.querySelector('[data-invalid="true"]');
            if (firstError) firstError.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch("/api/educational-institutions", {
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

    if (submitted) {
        return (
            <Card className="max-w-xl mx-auto mt-10 border-green-500 bg-green-50 shadow-sm">
                <CardBody className="text-center space-y-4 py-8">
                    <LuUserCheck className="mx-auto h-10 w-10 text-green-600" />
                    <h3 className="text-xl font-semibold text-green-700">
                        Registration Successful!
                    </h3>
                    <p className="text-gray-700">
                        Thank you for your interest in supporting Agaram.
                        We’ll be in touch shortly.
                    </p>
                    <Button
                        variant="flat"
                        onPress={() => {
                            setFormData({
                                collegeName: "", email: "", phone: "", contactPerson: "",
                                address: "", country: "", state: "", city: "", pincode: "",
                                website: "", supportTypes: [], inquiry: "", agreed: false
                            });
                            setFormErrors({});
                            setTouchedFields(new Set());
                            setSubmitted(false);
                        }}
                    >
                        Submit Another
                    </Button>
                </CardBody>
            </Card>
        );
    }

    return (

        <><div className="bg-gradient-to-r from-slate-50 to-blue-50 py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-normal text-gray-800 leading-tight mb-6">
                            Bridge the gap to
                            <span className="text-[#0891b2] font-medium"> educational equity</span>
                        </h1>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            Partnering with Agaram offers educational institutions a meaningful way to extend their impact beyond campus walls. From scholarships and hostels to rural fellowships and school infrastructure, we provide clear pathways for academic collaboration with measurable outcomes.
                        </p>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-start space-x-3">
                                <div className="w-5 h-5 bg-[#0891b2] rounded-full mt-1 flex-shrink-0"></div>
                                <p className="text-gray-700">Create direct pathways for first-generation learners to access quality higher education</p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-5 h-5 bg-[#0891b2] rounded-full mt-1 flex-shrink-0"></div>
                                <p className="text-gray-700">Engage students and faculty in impactful community outreach and mentorship programs</p>
                            </div>
                            <div className="flex items-start space-x-3">
                                <div className="w-5 h-5 bg-[#0891b2] rounded-full mt-1 flex-shrink-0"></div>
                                <p className="text-gray-700">Build sustainable educational ecosystems that benefit rural and underserved communities</p>
                            </div>
                        </div>

                        <Button
                            className="bg-[#0891b2] text-white px-8 py-3 text-base font-medium rounded-md hover:bg-[#0e7490] transition-colors"
                            size="lg"
                        >
                            Partner with Us →
                        </Button>
                    </div>

                    {/* Right Content - Partnership showcase */}
                    <div className="lg:pl-12">
                        <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-100">
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-medium text-gray-800 mb-2">Educational Partnership</h3>
                                <p className="text-gray-600 text-sm">When academic excellence meets grassroots change</p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                                        <LuGraduationCap className="w-6 h-6 text-[#0891b2]" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-800">Student Scholarships</h4>
                                        <p className="text-sm text-gray-600">Direct support for deserving students</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                                        <LuBookOpen className="w-6 h-6 text-[#0891b2]" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-800">Academic Collaboration</h4>
                                        <p className="text-sm text-gray-600">Research partnerships and knowledge exchange</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                                        <LuUsers className="w-6 h-6 text-[#0891b2]" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-800">Community Engagement</h4>
                                        <p className="text-sm text-gray-600">Faculty and student volunteer opportunities</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                                        <LuHandHeart className="w-6 h-6 text-[#0891b2]" />
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-800">Infrastructure Support</h4>
                                        <p className="text-sm text-gray-600">Building educational foundations together</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                                <p className="text-sm text-gray-700 text-center italic">
                                    "Together, we create pathways where academic excellence meets social impact."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div><div className="p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto mb-20">
                <div className="text-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-semibold mb-2">Educational Institution Registration</h2>
                    <div className="mt-4 mb-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Progress</span>
                            <span>{Math.round(completionProgress)}% complete</span>
                        </div>
                        <Progress value={completionProgress} color="primary" />
                    </div>
                </div>

                <Card className="shadow-none border-none bg-white mb-8">
                    <CardBody className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input label="Institution Name" value={formData.collegeName} onChange={(e) => handleChange("collegeName", e.target.value)} onBlur={() => handleBlur("collegeName")} isInvalid={touchedFields.has("collegeName") && !!formErrors.collegeName} errorMessage={formErrors.collegeName} isRequired />
                        <Input label="Email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} onBlur={() => handleBlur("email")} isInvalid={touchedFields.has("email") && !!formErrors.email} errorMessage={formErrors.email} type="email" isRequired />
                        <Input type="tel" name="phone" label="Phone Number" value={formData.phone} maxLength={15} minLength={10} onChange={(e) => handleChange("phone", e.target.value)} onBlur={() => handleBlur("phone")} isInvalid={touchedFields.has("phone") && !!formErrors.phone} errorMessage={formErrors.phone} isRequired />
                        <Input label="Contact Person Name" value={formData.contactPerson} onChange={(e) => handleChange("contactPerson", e.target.value)} onBlur={() => handleBlur("contactPerson")} isInvalid={touchedFields.has("contactPerson") && !!formErrors.contactPerson} errorMessage={formErrors.contactPerson} isRequired />
                        <Input label="Address" value={formData.address} onChange={(e) => handleChange("address", e.target.value)} onBlur={() => handleBlur("address")} isInvalid={touchedFields.has("address") && !!formErrors.address} errorMessage={formErrors.address} isRequired />
                        <Input label="Country" value={formData.country} onChange={(e) => handleChange("country", e.target.value)} onBlur={() => handleBlur("country")} isInvalid={touchedFields.has("country") && !!formErrors.country} errorMessage={formErrors.country} isRequired />
                        <Input label="State" value={formData.state} onChange={(e) => handleChange("state", e.target.value)} onBlur={() => handleBlur("state")} isInvalid={touchedFields.has("state") && !!formErrors.state} errorMessage={formErrors.state} isRequired />
                        <Input label="District / City" value={formData.city} onChange={(e) => handleChange("city", e.target.value)} onBlur={() => handleBlur("city")} isInvalid={touchedFields.has("city") && !!formErrors.city} errorMessage={formErrors.city} isRequired />
                        <Input label="Pincode" value={formData.pincode} onChange={(e) => handleChange("pincode", e.target.value)} onBlur={() => handleBlur("pincode")} isInvalid={touchedFields.has("pincode") && !!formErrors.pincode} errorMessage={formErrors.pincode} isRequired />
                        <Input label="Website / LinkedIn URL" value={formData.website} onChange={(e) => handleChange("website", e.target.value)} />
                        <Select label="Type of Support" selectedKeys={formData.supportTypes} onSelectionChange={(keys) => handleChange("supportTypes", Array.from(keys))} onBlur={() => handleBlur("supportTypes")} selectionMode="multiple" isInvalid={touchedFields.has("supportTypes") && !!formErrors.supportTypes} errorMessage={formErrors.supportTypes} isRequired>
                            {SUPPORT_OPTIONS.map((type) => (
                                <SelectItem key={type}>{type}</SelectItem>
                            ))}
                        </Select>
                    </CardBody>
                </Card>

                <Card className="shadow-none border-none bg-white mb-4">
                    <CardBody className="space-y-4">
                        <Textarea label="Any other general comments or inquiries?" value={formData.inquiry} onChange={(e) => handleChange("inquiry", e.target.value)} rows={4} placeholder="Type your message here..." />
                        <Checkbox isSelected={formData.agreed} onValueChange={(value) => handleChange("agreed", value)} onBlur={() => handleBlur("agreed")} isInvalid={touchedFields.has("agreed") && !!formErrors.agreed} isRequired>
                            We agree to the Agaram terms and conditions
                        </Checkbox>
                        {touchedFields.has("agreed") && formErrors.agreed && (
                            <p className="text-sm text-red-500 mt-1">{formErrors.agreed}</p>
                        )}
                    </CardBody>
                </Card>

                <div className="text-center mt-8">
                    <Button color="primary" size="lg" className="px-8" onPress={handleSubmit} isLoading={isSubmitting} isDisabled={isSubmitting}>
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </Button>
                </div>
            </div></>
    );
}
