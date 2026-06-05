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
import { LuUserCheck } from "react-icons/lu";

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

export default function ForeignDonorForm() {
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
                if (!/^\d{10,15}$/.test(value)) {
                    errors.phone = "Please enter a valid phone number.";
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
        if (!/^\d{10,15}$/.test(formData.phone)) errors.phone = "Invalid phone number.";
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
            const res = await fetch("/api/foreign-donors", {
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
                    Submitted Successfully!
                </h3>
                <p className="text-gray-700">
                    Thank you for reaching out. Our team will respond within 48 hours.
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
                    Submit Another Response
                </Button>
            </CardBody>
        </Card>
    ) : (
        <div className="p-4 sm:p-6 md:p-8 max-w-3xl mx-auto mb-20">
            <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-semibold mb-4">Foreign Donor Registration</h2>
                <p className="text-md text-gray-500 ">If you are a passport holder of a country other than India, please fill this form.</p>
                <div className="mt-4 mb-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{Math.round(completionProgress)}% complete</span>
                    </div>
                    <Progress
                        value={completionProgress}
                        color="primary"
                        aria-label="Progress"
                        size="md"
                    />
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
                            isRequired
                        />
                        <Input
                            label="Last Name"
                            value={formData.lastName}
                            onChange={(e) => handleChange("lastName", e.target.value)}
                            onBlur={() => handleBlur("lastName")}
                            isInvalid={touchedFields.has("lastName") && !!formErrors.lastName}
                            errorMessage={touchedFields.has("lastName") ? formErrors.lastName : ""}
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
                            label="Query Type"
                            selectedKeys={[formData.queryType]}
                            onSelectionChange={(keys) =>
                                handleChange("queryType", Array.from(keys)[0] || "")
                            }
                            onBlur={() => handleBlur("queryType")}
                            isInvalid={touchedFields.has("queryType") && !!formErrors.queryType}
                            errorMessage={touchedFields.has("queryType") ? formErrors.queryType : ""}
                            isRequired
                        >
                            {["Enquiry", "Others"].map((type) => (
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
                        placeholder="Type your message here..."
                    />
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
        </div>
    );
}