"use client";

import {
    Input,
    Select,
    SelectItem,
    Checkbox,
    CheckboxGroup,
    Textarea,
    Button,
    Alert,
    Progress,
    Card,
    CardBody,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { LuUserCheck, LuHeart, LuUsers, LuBookOpen, LuStar } from "react-icons/lu";

const languageOptions = ["English", "Tamil", "Telugu", "Malayalam", "Kannada", "Others",];

interface FormData {
    name: string;
    email: string;
    phone: string;
    gender: string;
    dateOfBirth: string;
    country: string;
    state: string;
    city: string;
    address: string;
    pincode: string;
    commCountry: string;
    commState: string;
    commCity: string;
    commAddress: string;
    commPincode: string;
    sameAsPermanent: boolean;
    relevantSkills: string;
    previousExperience: string;
    languages: string[];
    attendedTraining: boolean;
    agreedToTerms: boolean;
}

interface FormErrors {
    [key: string]: string;
}

export default function VolunteerForm() {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        phone: "",
        gender: "",
        dateOfBirth: "",
        country: "",
        state: "",
        city: "",
        address: "",
        pincode: "",
        commCountry: "",
        commState: "",
        commCity: "",
        commAddress: "",
        commPincode: "",
        sameAsPermanent: false,
        relevantSkills: "",
        previousExperience: "",
        languages: [],
        attendedTraining: false,
        agreedToTerms: false,
    });

    const [formErrors, setFormErrors] = useState<FormErrors>({});
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());
    const [completionProgress, setCompletionProgress] = useState(0);

    useEffect(() => {
        const requiredFields: (keyof FormData)[] = [
            "name", "email", "phone", "country", "state", "city",
            "address", "pincode", "relevantSkills", "agreedToTerms",
        ];

        let completed = 0;
        requiredFields.forEach(field => {
            const value = formData[field];
            if (typeof value === "string" && value.trim()) completed++;
            else if (typeof value === "boolean" && value) completed++;
        });
        setCompletionProgress((completed / requiredFields.length) * 100);
    }, [formData]);

    const handleChange = (key: keyof FormData, value: any) => {

        let data = { ...formData };

        if (data.sameAsPermanent) {
            data.commCountry = data.country;
            data.commState = data.state;
            data.commCity = data.city;
            data.commAddress = data.address;
            data.commPincode = data.pincode;
        }

        if (formErrors[key]) {
            setFormErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[key];
                return newErrors;
            });
        }

        if (key === "sameAsPermanent") {
            if (value) {
                setFormData(prev => ({
                    ...prev,
                    sameAsPermanent: true,
                    commCountry: prev.country,
                    commState: prev.state,
                    commCity: prev.city,
                    commAddress: prev.address,
                    commPincode: prev.pincode,
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    sameAsPermanent: false,
                    commCountry: "",
                    commState: "",
                    commCity: "",
                    commAddress: "",
                    commPincode: "",
                }));
            }
        } else {
            setFormData(prev => ({
                ...prev,
                [key]: value,
            }));
        }
    };

    const handleBlur = (field: keyof FormData) => {
        setTouchedFields(prev => new Set(prev).add(field));
        validateField(field);
    };

    const validateField = (field: keyof FormData) => {
        const value = formData[field];
        const errors: FormErrors = {};

        switch (field) {
            case "name":
                if (typeof value === "string" && !value.trim()) {
                    errors.name = "Full name is required.";
                }
                break;
            case "email":
                if (typeof value === "string" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    errors.email = "Please enter a valid email address.";
                }
                break;
            case "phone":
                if (typeof value === "string" && !/^\d{10}$/.test(value)) {
                    errors.phone = "Please enter a valid 10-digit phone number.";
                }
                break;
            case "pincode":
                if (typeof value === "string" && !/^\d{6}$/.test(value)) {
                    errors.pincode = "Please enter a valid 6-digit pincode.";
                }
                break;
            case "dateOfBirth":
                if (!value) {
                    errors.dateOfBirth = "Date of birth is required.";
                }
                break;

            case "agreedToTerms":
                if (value !== true) {
                    errors.agreedToTerms = "You must agree to the terms and conditions.";
                }
                break;
            case "country":
            case "state":
            case "city":
            case "address":
            case "relevantSkills":
                if (typeof value === "string" && !value.trim()) {
                    errors[field] = "This field is required.";
                }
                break;
        }


        setFormErrors(prev => ({ ...prev, ...errors }));
        return Object.keys(errors).length === 0;
    };

    const validate = () => {
        const errors: FormErrors = {};

        if (!formData.name.trim()) errors.name = "Full name is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Please enter a valid email address.";
        if (!/^\d{10}$/.test(formData.phone)) errors.phone = "Please enter a valid 10-digit phone number.";
        if (!formData.country.trim()) errors.country = "Country is required.";
        if (!formData.state.trim()) errors.state = "State is required.";
        if (!formData.dateOfBirth) errors.dateOfBirth = "Date of birth is required.";
        if (!formData.city.trim()) errors.city = "District is required.";
        if (!formData.address.trim()) errors.address = "Address is required.";
        if (!/^\d{6}$/.test(formData.pincode)) errors.pincode = "Please enter a valid 6-digit pincode.";
        if (!formData.relevantSkills.trim()) errors.relevantSkills = "Please describe your relevant skills.";
        if (!formData.agreedToTerms) errors.agreedToTerms = "You must agree to the terms and conditions.";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        const allRequiredFields = new Set([
            "name", "email", "phone", "country", "state", "city",
            "address", "pincode", "relevantSkills", "agreedToTerms",
        ]);

        setTouchedFields(allRequiredFields);

        if (!validate()) {
            const firstError = document.querySelector('[data-invalid="true"]');
            if (firstError) firstError.scrollIntoView({ behavior: 'smooth' });
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch("/api/volunteers", {
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
                    Registration Successful! 🎉
                </h3>
                <p className="text-gray-700">
                    Thank you for registering as a volunteer.
                    <br />
                    We'll contact you soon with next steps.
                </p>
                <Button
                    variant="flat"
                    onClick={() => {
                        setFormData({
                            name: "", email: "", phone: "", gender: "", dateOfBirth: "", country: "",
                            state: "", city: "", address: "", pincode: "", commCountry: "", commState: "",
                            commCity: "", commAddress: "", commPincode: "", sameAsPermanent: false,
                            relevantSkills: "", previousExperience: "", languages: [],
                            attendedTraining: false, agreedToTerms: false
                        });
                        setFormErrors({});
                        setTouchedFields(new Set());
                        setSubmitted(false);
                    }}
                >
                    Register Another Volunteer
                </Button>
            </CardBody>
        </Card>
    ) : (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Hero Section - Matching your landing page style */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-normal text-gray-800 leading-tight mb-6">
                                Be a catalyst for
                                <span className="text-[#0891b2] font-medium"> transforming lives</span>
                            </h1>
                            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                                At Agaram, volunteers are not just helping hands, they are catalysts for change. Whether it's mentoring a first-generation learner, conducting workshops, or helping with events and activities, every hour you give ripples far beyond the moment.
                            </p>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-start space-x-3">
                                    <div className="w-5 h-5 bg-[#0891b2] rounded-full mt-1 flex-shrink-0"></div>
                                    <p className="text-gray-700">Work closely with students who are navigating college and life for the first time</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-5 h-5 bg-[#0891b2] rounded-full mt-1 flex-shrink-0"></div>
                                    <p className="text-gray-700">Conduct workshops and share skills that broaden horizons</p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-5 h-5 bg-[#0891b2] rounded-full mt-1 flex-shrink-0"></div>
                                    <p className="text-gray-700">Help with events and activities, creating lasting connections</p>
                                </div>
                            </div>
                        </div>

                        {/* Right Content - Image placeholder or illustration */}
                        <div className="lg:pl-12">
                            <div className="bg-white rounded-lg shadow-sm p-8 border border-gray-100">
                                <div className="text-center mb-6">
                                    <h3 className="text-xl font-medium text-gray-800 mb-2">Your Impact</h3>
                                    <p className="text-gray-600 text-sm">Every connection matters</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                                            <LuHeart className="w-6 h-6 text-[#0891b2]" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-800">Mentor & Guide</h4>
                                            <p className="text-sm text-gray-600">Become the "Anna" or "Akka" they can lean on</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                                            <LuBookOpen className="w-6 h-6 text-[#0891b2]" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-800">Share Knowledge</h4>
                                            <p className="text-sm text-gray-600">Conduct workshops and skill sessions</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                                            <LuUsers className="w-6 h-6 text-[#0891b2]" />
                                        </div>
                                        <div>
                                            <h4 className="font-medium text-gray-800">Build Community</h4>
                                            <p className="text-sm text-gray-600">Help organize events and activities</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-gray-700 text-center italic">
                                        "Change doesn't happen in isolation, it's built together, one connection at a time."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Volunteers are the pillars section */}
            <div className="bg-white py-12">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-2xl lg:text-3xl font-medium text-gray-800 mb-4">Volunteer Registration</h2>
                    <p className="text-gray-600 text-lg mb-8">
                        Volunteers are the pillars of strength for Agaram and they play a key role in every part of Agaram's initiatives.
                    </p>
                </div>
            </div>

            {/* Form Section */}
            <div className="max-w-4xl mx-auto px-4 pb-16">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sm:p-8">
                    {/* Progress Bar */}
                    <div className="mb-8">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Registration Progress</span>
                            <span>{Math.round(completionProgress)}% complete</span>
                        </div>
                        <Progress
                            value={completionProgress}
                            className="w-full"
                            aria-label="Progress"
                            size="sm"
                        />
                    </div>

                    {/* Personal Information Section */}
                    <div className="mb-8">
                        <h3 className="text-lg font-medium mb-6 text-gray-800 border-b border-gray-200 pb-2">
                            Personal Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Full Name"
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                onBlur={() => handleBlur("name")}
                                isInvalid={touchedFields.has("name") && !!formErrors.name}
                                errorMessage={touchedFields.has("name") ? formErrors.name : ""}
                                isRequired
                            />
                            <Input
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                onBlur={() => handleBlur("email")}
                                isInvalid={touchedFields.has("email") && !!formErrors.email}
                                errorMessage={touchedFields.has("email") ? formErrors.email : ""}
                                isRequired
                            />
                            <Input
                                label="Phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleChange("phone", e.target.value)}
                                onBlur={() => handleBlur("phone")}
                                isInvalid={touchedFields.has("phone") && !!formErrors.phone}
                                errorMessage={touchedFields.has("phone") ? formErrors.phone : ""}
                                isRequired
                            />
                            <Select
                                label="Gender"
                                selectedKeys={formData.gender ? [formData.gender] : []}
                                onSelectionChange={(val) => {
                                    const selected = Array.from(val)[0] as string ?? "";
                                    handleChange("gender", selected);
                                }}
                            >
                                <SelectItem key="male">Male</SelectItem>
                                <SelectItem key="female">Female</SelectItem>
                                <SelectItem key="other">Other</SelectItem>
                                <SelectItem key="prefer-not-to-say">Prefer not to say</SelectItem>
                            </Select>

                            <Input
                                label="Date of Birth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                                onBlur={() => handleBlur("dateOfBirth")}
                                isInvalid={touchedFields.has("dateOfBirth") && !!formErrors.dateOfBirth}
                                errorMessage={touchedFields.has("dateOfBirth") ? formErrors.dateOfBirth : ""}
                                isRequired
                            />

                            <Input
                                label="Country"
                                value={formData.country}
                                onChange={(e) => handleChange("country", e.target.value)}
                                onBlur={() => handleBlur("country")}
                                isInvalid={touchedFields.has("country") && !!formErrors.country}
                                errorMessage={touchedFields.has("country") ? formErrors.country : ""}
                                isRequired
                            />
                            <Input
                                label="State"
                                value={formData.state}
                                onChange={(e) => handleChange("state", e.target.value)}
                                onBlur={() => handleBlur("state")}
                                isInvalid={touchedFields.has("state") && !!formErrors.state}
                                errorMessage={touchedFields.has("state") ? formErrors.state : ""}
                                isRequired
                            />
                            <Input
                                label="City/District"
                                value={formData.city}
                                onChange={(e) => handleChange("city", e.target.value)}
                                onBlur={() => handleBlur("city")}
                                isInvalid={touchedFields.has("city") && !!formErrors.city}
                                errorMessage={touchedFields.has("city") ? formErrors.city : ""}
                                isRequired
                            />
                            <Input
                                label="Address"
                                value={formData.address}
                                onChange={(e) => handleChange("address", e.target.value)}
                                onBlur={() => handleBlur("address")}
                                isInvalid={touchedFields.has("address") && !!formErrors.address}
                                errorMessage={touchedFields.has("address") ? formErrors.address : ""}
                                isRequired
                                className="md:col-span-1"
                            />
                            <Input
                                label="Pincode"
                                value={formData.pincode}
                                onChange={(e) => handleChange("pincode", e.target.value)}
                                onBlur={() => handleBlur("pincode")}
                                isInvalid={touchedFields.has("pincode") && !!formErrors.pincode}
                                errorMessage={touchedFields.has("pincode") ? formErrors.pincode : ""}
                                isRequired
                            />
                        </div>
                    </div>

                    {/* Communication Section */}
                    <div className="mb-8">
                        <h3 className="text-lg font-medium mb-6 text-gray-800 border-b border-gray-200 pb-2">
                            Communication Address
                        </h3>

                        <Checkbox
                            className="mb-4"
                            isSelected={formData.sameAsPermanent}
                            onChange={(e) => handleChange("sameAsPermanent", e.target.checked)}
                        >
                            Same as permanent address
                        </Checkbox>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Country"
                                value={formData.commCountry}
                                onChange={(e) => handleChange("commCountry", e.target.value)}
                                isDisabled={formData.sameAsPermanent}
                            />
                            <Input
                                label="State"
                                value={formData.commState}
                                onChange={(e) => handleChange("commState", e.target.value)}
                                isDisabled={formData.sameAsPermanent}
                            />
                            <Input
                                label="City/District"
                                value={formData.commCity}
                                onChange={(e) => handleChange("commCity", e.target.value)}
                                isDisabled={formData.sameAsPermanent}
                            />
                            <Input
                                label="Address"
                                value={formData.commAddress}
                                onChange={(e) => handleChange("commAddress", e.target.value)}
                                isDisabled={formData.sameAsPermanent}
                            />
                            <Input
                                label="Pincode"
                                value={formData.commPincode}
                                onChange={(e) => handleChange("commPincode", e.target.value)}
                                isDisabled={formData.sameAsPermanent}
                            />
                        </div>
                    </div>

                    {/* Skills & Experience Section */}
                    <div className="mb-8">
                        <h3 className="text-lg font-medium mb-6 text-gray-800 border-b border-gray-200 pb-2">
                            Skills & Experience
                        </h3>
                        <div className="space-y-4">
                            <Textarea
                                label="What skills can you contribute?"
                                placeholder="e.g., Teaching, Communication, Project Management, Technical Skills..."
                                value={formData.relevantSkills}
                                onChange={(e) => handleChange("relevantSkills", e.target.value)}
                                onBlur={() => handleBlur("relevantSkills")}
                                isInvalid={touchedFields.has("relevantSkills") && !!formErrors.relevantSkills}
                                errorMessage={touchedFields.has("relevantSkills") ? formErrors.relevantSkills : ""}
                                minRows={3}
                                isRequired
                            />
                            <Textarea
                                label="Previous Volunteer Experience"
                                placeholder="Tell us about your previous volunteer experience (optional)"
                                value={formData.previousExperience}
                                onChange={(e) => handleChange("previousExperience", e.target.value)}
                                minRows={3}
                            />

                            <CheckboxGroup
                                label="Languages You Know"
                                description="Select all languages you're comfortable speaking"
                                value={formData.languages}
                                onChange={(val) => handleChange("languages", val)}
                                className="w-full"
                            >
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 w-full">
                                    {languageOptions.map((lang) => (
                                        <Checkbox key={lang} value={lang} className="text-sm">
                                            {lang}
                                        </Checkbox>
                                    ))}
                                </div>
                            </CheckboxGroup>
                        </div>
                    </div>

                    {/* Agreement Section */}
                    <div className="mb-8">
                        <h3 className="text-lg font-medium mb-6 text-gray-800 border-b border-gray-200 pb-2">
                            Final Steps
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-3">
                                <Checkbox
                                    isSelected={formData.attendedTraining}
                                    onChange={(e) => handleChange("attendedTraining", e.target.checked)}
                                    className="text-sm"
                                >
                                    I have previously attended Agaram volunteer training sessions
                                </Checkbox>

                                <Checkbox
                                    isSelected={formData.agreedToTerms}
                                    onBlur={() => handleBlur("agreedToTerms")}
                                    onChange={(e) => handleChange("agreedToTerms", e.target.checked)}
                                    isInvalid={touchedFields.has("agreedToTerms") && !!formErrors.agreedToTerms}
                                    isRequired
                                    className="text-sm"
                                >
                                    <span className="text-sm">
                                        I agree to the volunteer terms and conditions and commit to contributing meaningfully to Agaram's mission
                                    </span>
                                </Checkbox>
                                {touchedFields.has("agreedToTerms") && formErrors.agreedToTerms && (
                                    <p className="text-sm text-red-600 ml-6">{formErrors.agreedToTerms}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="text-center">
                        <Button
                            className="bg-[#0891b2] text-white px-8 py-3 text-base font-medium hover:bg-[#0e7490] transition-colors"
                            size="lg"
                            onPress={handleSubmit}
                            isLoading={isSubmitting}
                            isDisabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Complete Registration"}
                        </Button>
                        <p className="text-sm text-gray-500 mt-4">
                            By submitting, you agree to receive communication about volunteer opportunities
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}