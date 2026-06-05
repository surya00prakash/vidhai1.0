"use client";

import {
    Alert,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Checkbox,
    Divider,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { duration as durationOptions } from "@/data/DonationConst";
import { DonationItem } from "@/types/DonationTypes";
import { sponsorshipOptions } from "./SponsorshipSelector";
import SuccessModal from "@/components/donations/SubscriptionSuccess";

type MonthlyPaymentModalProps = {
    isOpen: boolean;
    onClose: () => void;
    duration: string;
    setDuration: React.Dispatch<React.SetStateAction<string>>;
    razorpayReady: boolean;
    selectedItemsDetails: DonationItem[];
    itemCounts: Record<string, number>;
    customAmounts: Record<string, number>;
};

const initialUser = {
    name: "",
    email: "",
    image: "",
    mobile: "",
    pan: "",
    doorNo: "",
    streetName: "",
    taluk: "",
    district: "",
    pincode: "",
    isAlumni: false,
    agaramVidhaiYear: "",
    collegeName: "",
};

const labelMap: Record<string, string> = {
    streetName: "Street/Village Name",
    doorNo: "Door/Flat No",
    pan: "PAN Number",
    agaramVidhaiYear: "Agaram Vidhai Year",
    collegeName: "College Name",
};

const getLabel = (key: string) =>
    labelMap[key] ||
    key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

type WidenedSponsor = {
    id: string;
    label: string;
    monthlyAmount?: number;
    onceAmounts: Record<string, number>;
    durations?: string[];
};

export default function MonthlyPaymentModal({
    isOpen,
    onClose,
    duration,
    setDuration,
    razorpayReady,
    selectedItemsDetails,
    itemCounts,
    customAmounts,
}: MonthlyPaymentModalProps) {
    const [formData, setFormData] = useState(initialUser);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const [successSubscriptionId, setSuccessSubscriptionId] = useState("");

    useEffect(() => {
        const loadRazorpayScript = () => {
            if (document.getElementById("razorpay-script")) return;
            const script = document.createElement("script");
            script.id = "razorpay-script";
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => {};
            document.body.appendChild(script);
        };
        loadRazorpayScript();
    }, []);

    // compute total type-safely by widening sponsor shape before indexing onceAmounts
    const totalAmount = selectedItemsDetails.reduce((sum, item) => {
        const quantity = itemCounts?.[item.id] ?? 1;

        // widen the find result so TS knows onceAmounts is indexable
        const sponsor = (sponsorshipOptions.find((s) => s.id === item.id) as unknown) as
            | WidenedSponsor
            | undefined;

        if (sponsor) {
            const sponsorAmount =
                sponsor.monthlyAmount ??
                // safe: onceAmounts is Record<string, number> on WidenedSponsor
                sponsor.onceAmounts[duration] ??
                0;
            return sum + sponsorAmount * quantity;
        }

        const itemAmount =
            item.isCustom && customAmounts[item.id] !== undefined
                ? customAmounts[item.id]
                : item.amount;

        return sum + itemAmount * quantity;
    }, 0);

    const validateForm = () => {
        const errors: Record<string, string> = {};
        if (!formData.name.trim()) errors.name = "Name is required";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            errors.email = "Invalid email format";
        if (!/^[6-9]\d{9}$/.test(formData.mobile))
            errors.mobile = "Invalid mobile number";
        if (!formData.doorNo.trim()) errors.doorNo = "Door/Flat No. is required";
        if (!formData.streetName.trim())
            errors.streetName = "Street Name is required";
        if (!formData.taluk.trim()) errors.taluk = "Taluk is required";
        if (!formData.district.trim()) errors.district = "District is required";
        if (!/^\d{6}$/.test(formData.pincode)) errors.pincode = "Invalid pincode";
        if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan.toUpperCase()))
            errors.pan = "Invalid PAN format";

        if (formData.isAlumni) {
            if (!formData.agaramVidhaiYear.trim())
                errors.agaramVidhaiYear = "Agaram Vidhai Year is required";
            if (!formData.collegeName.trim())
                errors.collegeName = "College Name is required";
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const makeMonthlyPayment = async () => {
        const res = await fetch("/api/payments/create-subscription", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: totalAmount, duration }),
        });

        const subscription = await res.json();

        const durationMonths = Number(duration);
        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + durationMonths);

        const formatMonthYear = (date: Date) =>
            date.toLocaleString("en-IN", { month: "short", year: "numeric" });

        const donationData = {
            name: formData.name,
            email: formData.email,
            phone: formData.mobile,
            pan: formData.pan.toUpperCase(),
            amount: totalAmount,
            doorNo: formData.doorNo,
            streetName: formData.streetName,
            taluk: formData.taluk,
            district: formData.district,
            pincode: formData.pincode,
            frequency: "monthly",
            duration,
            isAlumni: formData.isAlumni,
            agaramVidhaiYear: formData.agaramVidhaiYear,
            collegeName: formData.collegeName,
            startDate: formatMonthYear(startDate),
            endDate: formatMonthYear(endDate),
        };

        const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
            name: "Agaram Foundation",
            description: "Monthly Donation",
            subscription_id: subscription.id,
            prefill: {
                name: formData.name,
                email: formData.email,
                contact: formData.mobile,
            },
            theme: { color: "#00A9B6" },
            handler: async (response: any) => {
                await fetch("/api/donate/subscription-success", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        subscriptionId: response.razorpay_subscription_id,
                        paymentId: response.razorpay_payment_id,
                        signature: response.razorpay_signature,
                        userData: donationData,
                    }),
                });

                setSuccessSubscriptionId(response.razorpay_subscription_id);
                setIsSuccessOpen(true);
            },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;
        setIsSubmitting(true);

        const txnid = Date.now().toString();

        const donationData = {
            name: formData.name,
            email: formData.email,
            phone: formData.mobile,
            pan: formData.pan.toUpperCase(),
            amount: totalAmount,
            doorNo: formData.doorNo,
            streetName: formData.streetName,
            taluk: formData.taluk,
            district: formData.district,
            pincode: formData.pincode,
            frequency: "monthly",
            gateway: "razorpay",
            txnid,
            isAlumni: formData.isAlumni,
            agaramVidhaiYear: formData.agaramVidhaiYear,
            collegeName: formData.collegeName,
        };

        const res = await fetch("/api/donate/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(donationData),
        });

        if (!res.ok) {
            alert("❌ Failed to save donation");
            setIsSubmitting(false);
            return;
        }

        await makeMonthlyPayment();
        setIsSubmitting(false);
    };

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} backdrop="blur" scrollBehavior="inside" placement="center">
                <ModalContent>
                    {() => (
                        <>
                            <ModalHeader>Confirm Your Donation</ModalHeader>
                            <ModalBody className="space-y-6">
                                <div className="grid grid-cols-1 gap-4">
                                    {(
                                        [
                                            "name",
                                            "email",
                                            "mobile",
                                            "pan",
                                            "doorNo",
                                            "streetName",
                                            "taluk",
                                            "district",
                                            "pincode",
                                        ] as const
                                    ).map((key) => {
                                        const label = getLabel(key);
                                        const type =
                                            key === "email" ? "email" : key === "mobile" ? "tel" : "text";
                                        return (
                                            <div key={key}>
                                                <Input
                                                    label={label}
                                                    type={type}
                                                    value={formData[key]}
                                                    placeholder={`Enter your ${label.toLowerCase()}`}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({ ...prev, [key]: e.target.value }))
                                                    }
                                                    size="sm"
                                                    isInvalid={!!formErrors[key]}
                                                    errorMessage={formErrors[key]}
                                                    classNames={{ label: "!text-primary-700 font-medium" }}
                                                />
                                            </div>
                                        );
                                    })}

                                    <Checkbox
                                        isSelected={formData.isAlumni}
                                        onValueChange={(value) =>
                                            setFormData((prev) => ({ ...prev, isAlumni: value }))
                                        }
                                        classNames={{
                                            label: "text-sm font-medium text-primary-700",
                                        }}
                                    >
                                        Are you a Agaram Alumni / Student?
                                    </Checkbox>

                                    {formData.isAlumni && (
                                        <>
                                            <Select
                                                className="w-full"
                                                label={getLabel("agaramVidhaiYear")}
                                                selectedKeys={
                                                    formData.agaramVidhaiYear ? [formData.agaramVidhaiYear] : []
                                                }
                                                size="sm"
                                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                                    setFormData((prev) => ({ ...prev, agaramVidhaiYear: e.target.value }))
                                                }
                                                classNames={{ label: "!text-primary-700 font-medium" }}
                                                isInvalid={!!formErrors.agaramVidhaiYear}
                                            >
                                                <>
                                                    <SelectItem key="empty">Select Year</SelectItem>
                                                    {[...Array(new Date().getFullYear() - 2010 + 1)].map((_, i) => {
                                                        const year = (2010 + i).toString();
                                                        return <SelectItem key={year}>{year}</SelectItem>;
                                                    })}
                                                </>
                                            </Select>

                                            <Input
                                                label={getLabel("collegeName")}
                                                type="text"
                                                value={formData.collegeName}
                                                placeholder="Enter your College Name"
                                                onChange={(e) =>
                                                    setFormData((prev) => ({ ...prev, collegeName: e.target.value }))
                                                }
                                                size="sm"
                                                isInvalid={!!formErrors.collegeName}
                                                errorMessage={formErrors.collegeName}
                                                classNames={{ label: "!text-primary-700 font-medium" }}
                                            />
                                        </>
                                    )}
                                </div>

                                {/* Duration selector + banner */}
                                <Select
                                    className="w-full"
                                    label="Select Months"
                                    selectedKeys={[duration]}
                                    size="sm"
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                        setDuration(e.target.value)
                                    }
                                    classNames={{ label: "!text-primary-700 font-medium" }}
                                >
                                    {durationOptions.map((d) => (
                                        <SelectItem key={d.key}>{d.label}</SelectItem>
                                    ))}
                                </Select>

                                <Alert
                                    hideIcon
                                    color="primary"
                                    className="text-sm font-semibold"
                                    description={`You will be charged ₹${totalAmount.toLocaleString("en-IN")} each month for ${duration} months.`}
                                />

                                {selectedItemsDetails.length === 0 ? (
                                    <Card shadow="none" className="border border-default-300 p-4">
                                        <p className="text-sm text-default-500 italic">No donation items selected</p>
                                    </Card>
                                ) : (
                                    <div className="space-y-4">
                                        <Card shadow="none" className="border border-default-100">
                                            <CardHeader className="text-sm font-semibold text-primary-700">Selected Items</CardHeader>
                                            <Divider />
                                            <CardBody className="space-y-4">
                                                {selectedItemsDetails.map((item) => {
                                                    const quantity = itemCounts?.[item.id] ?? 1;
                                                    const sponsor = (sponsorshipOptions.find((s) => s.id === item.id) as unknown) as
                                                        | WidenedSponsor
                                                        | undefined;

                                                    let itemTotal = 0;
                                                    let displayAmount = 0;

                                                    if (sponsor) {
                                                        const sponsorAmount =
                                                            sponsor.monthlyAmount ?? sponsor.onceAmounts[duration] ?? 0;
                                                        itemTotal = sponsorAmount * quantity;
                                                        displayAmount = sponsorAmount;
                                                    } else {
                                                        const itemAmount =
                                                            item.isCustom && customAmounts[item.id] !== undefined
                                                                ? customAmounts[item.id]
                                                                : item.amount;
                                                        itemTotal = itemAmount * quantity;
                                                        displayAmount = itemAmount;
                                                    }

                                                    return (
                                                        <div key={item.id} className="flex flex-col md:flex-row md:justify-between md:items-center pb-2">
                                                            <div className="flex flex-col">
                                                                <div className="text-sm font-medium text-default-700">{item.name || item.label}</div>
                                                                {item.isCustom && customAmounts[item.id] !== undefined && (
                                                                    <div className="text-xs text-default-500">Custom Amount: ₹{customAmounts[item.id].toLocaleString("en-IN")}</div>
                                                                )}
                                                                {quantity > 1 && <div className="text-xs text-default-500">₹{displayAmount.toLocaleString("en-IN")} × {quantity}</div>}
                                                            </div>
                                                            <div className="text-sm text-default-600">
                                                                <span className="ml-2 font-semibold text-primary">₹{itemTotal.toLocaleString("en-IN")}</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </CardBody>

                                            <Divider />
                                            <CardFooter className="flex justify-between items-center pt-3 mt-2">
                                                <div className="text-sm font-medium text-default-700">Total Amount</div>
                                                <div className="text-sm font-semibold text-primary">₹{totalAmount.toLocaleString("en-IN")}</div>
                                            </CardFooter>
                                        </Card>
                                    </div>
                                )}
                            </ModalBody>

                            <ModalFooter className="flex-col space-y-3">
                                <Button fullWidth color="primary" onPress={handleSubmit} isDisabled={isSubmitting || !razorpayReady} isLoading={isSubmitting}>
                                    Make Subscription
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <SuccessModal isOpen={isSuccessOpen} onClose={() => setIsSuccessOpen(false)} subscriptionId={successSubscriptionId} />
        </>
    );
}
