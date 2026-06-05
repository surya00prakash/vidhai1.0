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
import { useState } from "react";
import { DonationItem } from "@/types/DonationTypes";
import { sponsorshipOptions } from "./SponsorshipSelector";
import { LuMail, LuPhone } from "react-icons/lu";

type OneTimePaymentModalProps = {
    isOpen: boolean;
    onClose: () => void;
    selectedItemsDetails: DonationItem[];
    itemCounts: Record<string, number>;
    customAmounts: Record<string, number>;
    donorDetails: {
        name: string;
        email: string;
        phone: string;
    };
}

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

// Razorpay type is declared globally in hooks/useRazorpay.ts

export default function OneTimePaymentModal({
    isOpen,
    onClose,
    selectedItemsDetails,
    donorDetails,
    itemCounts,
    customAmounts,
}: OneTimePaymentModalProps) {
    const [formData, setFormData] = useState(initialUser);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);

    const totalAmount = selectedItemsDetails.reduce((sum, item) => {
        const quantity = itemCounts?.[item.id] ?? 1;
        const sponsor = sponsorshipOptions.find((s) => s.id === item.id);

        if (sponsor) {
            // Use the sponsor's first duration key (both sponsors have "12" first)
            const key = sponsor.durations[0]; // inferred as "12"
            const sponsorAmount = sponsor.onceAmounts[key] ?? 0;
            return sum + sponsorAmount * quantity;
        }

        const itemAmount =
            item.isCustom && customAmounts[item.id]
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

    // Load Razorpay checkout script dynamically
    const loadRazorpayScript = (): Promise<boolean> =>
        new Promise((resolve) => {
            if (window.Razorpay) return resolve(true);
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });

    // Create Razorpay order via backend, then open checkout
    const makeOneTimePayment = async (txnid: string) => {
        // Create Razorpay order via backend
        const createOrderRes = await fetch("/api/payments/onetime-razorpay/create-onetime", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amount: totalAmount,
                txnid,
                currency: "INR",
                purpose: "donation",
                name: formData.name,
                email: formData.email,
                phone: formData.mobile,
            }),
        });


        if (!createOrderRes.ok) {
            const txt = await createOrderRes.text();
            alert("Failed to create razorpay order: " + txt);
            return;
        }

        const { orderId, key, amount: orderAmount } = await createOrderRes.json();

        // Load Razorpay checkout script
        const ok = await loadRazorpayScript();
        if (!ok) {
            alert("Could not load Razorpay checkout. Please try again.");
            return;
        }

        const options = {
            key,
            amount: orderAmount,
            currency: "INR",
            name: "Agaram Foundation",
            description: "One-time Donation",
            order_id: orderId,
            handler: async function (response: any) {

                const paymentId = response.razorpay_payment_id;
                const orderId = response.razorpay_order_id;

                try {
                    // Verify payment on backend
                    const verifyRes = await fetch("/api/payments/onetime-razorpay/verify", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            txnid,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            amount: orderAmount,
                        }),
                    });

                    if (!verifyRes.ok) {
                        const txt = await verifyRes.text();
                        alert("Payment verification failed: " + txt);

                        // Update donation as failed
                        await fetch("/api/payments/onetime-razorpay/update-status", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                txnid,
                                status: "failed",
                                paymentId: response.razorpay_payment_id,
                                orderId: response.razorpay_order_id,
                            }),

                        });

                        window.location.href = `/donate/response?status=failed&name=${encodeURIComponent(formData.name)}&amount=${totalAmount}&email=${encodeURIComponent(formData.email)}`;

                        return;
                    }

                    // Update donation as success
                    await fetch("/api/payments/onetime-razorpay/update-status", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            txnid,
                            status: "success",
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id,
                        }),

                    });

                    // Redirect to success page
                    window.location.href = `/donate/response?status=success&name=${encodeURIComponent(formData.name)}&amount=${totalAmount}&email=${encodeURIComponent(formData.email)}`;

                } catch (err) {
                    alert("An error occurred while verifying payment.");

                    // Update donation as failed
                    await fetch("/api/payments/onetime-razorpay/update-status", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ txnid, status: "failed", orderId: response.razorpay_order_id }),

                    });
                }
            },
            prefill: {
                name: formData.name,
                email: formData.email,
                contact: formData.mobile,
            },
            notes: { txnid },
            theme: { color: "#0ea5a4" },
            modal: {
                ondismiss: async function () {

                    // Update donation as failed/cancelled
                    await fetch("/api/payments/onetime-razorpay/update-status", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ txnid, status: "cancelled", orderId })

                    });
                },
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };


    const handleSubmit = async () => {
        if (!validateForm()) return;
        setIsSubmitting(true);

        const txnid = `${Date.now()}${Math.floor(Math.random() * 9000)}`;

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
            frequency: "once",
            gateway: "razorpay", // switched to razorpay
            txnid,
            isAlumni: formData.isAlumni,
            agaramVidhaiYear: formData.agaramVidhaiYear,
            collegeName: formData.collegeName,
        };

        // Save donation record first (same as before)
        const res = await fetch("/api/payments/onetime-razorpay/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(donationData),
        });

        if (!res.ok) {
            alert("❌ Failed to save donation");
            setIsSubmitting(false);
            return;
        }

        // Then initiate Razorpay checkout
        await makeOneTimePayment(txnid);

        setIsSubmitting(false);
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            backdrop="blur"
            scrollBehavior="inside"
            placement="center"
        >
            <ModalContent>
                {() => (
                    <>
                        {/* Header */}
                        <ModalHeader>
                            {totalAmount > 500000 ? null : "Confirm Your Donation"}
                        </ModalHeader>

                        {/* Body */}
                        <ModalBody className="space-y-6">
                            {totalAmount > 500000 ? (
                                // Donation Limit Notice
                                <Card
                                    shadow="none"
                                    className="p-6 bg-gradient-to-br from-primary-50 to-white border border-primary-100 rounded-2xl text-center"
                                >
                                    <div className="flex flex-col items-center space-y-3">
                                        {/* Icon */}
                                        <div className="bg-primary/5 p-3 rounded-full">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-8 w-8 text-primary"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                                                />
                                            </svg>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-base font-semibold text-primary">
                                            Donation Notice
                                        </h3>

                                        {/* Message */}
                                        <p className="text-default-600 text-md leading-relaxed max-w-md mx-auto">
                                            We are truly grateful for your generous support.
                                            For contributions above{" "}
                                            <span className="font-semibold text-default-700">₹5,00,000</span>, kindly contact our donor
                                            support team so we may assist you personally.
                                        </p>

                                        {/* Support Actions */}
                                        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-4">
                                            <Button
                                                as="a"
                                                href="tel:8754565555"
                                                color="primary"
                                                variant="solid"
                                                radius="sm"
                                                className="px-5 text-white font-semibold text-lg" startContent={<LuPhone />}
                                            >
                                                8754565555
                                            </Button>

                                            <Button
                                                as="a"
                                                href="mailto:csr@agaram.in"
                                                color="primary"
                                                variant="solid"
                                                radius="sm"
                                                className="px-5 text-white font-semibold text-lg"
                                                startContent={<LuMail />}
                                            >
                                                csr@agaram.in
                                            </Button>
                                        </div>
                                    </div>
                                </Card>


                            ) : (
                                <>
                                    {/* Donor Info Form */}
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
                                                <Input
                                                    key={key}
                                                    label={label}
                                                    type={type}
                                                    value={formData[key]}
                                                    placeholder={`Enter your ${label.toLowerCase()}`}
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            [key]: e.target.value,
                                                        }))
                                                    }
                                                    size="sm"
                                                    isInvalid={!!formErrors[key]}
                                                    errorMessage={formErrors[key]}
                                                    classNames={{ label: "!text-primary-700 font-medium" }}
                                                />
                                            );
                                        })}

                                        {/* Alumni Checkbox */}
                                        <Checkbox
                                            isSelected={formData.isAlumni}
                                            onValueChange={(value) =>
                                                setFormData((prev) => ({ ...prev, isAlumni: value }))
                                            }
                                            classNames={{
                                                label: "text-sm font-medium text-primary-700",
                                            }}
                                        >
                                            Are you an Agaram Alumni / Student?
                                        </Checkbox>

                                        {/* Alumni Extra Fields */}
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
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            agaramVidhaiYear: e.target.value,
                                                        }))
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
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            collegeName: e.target.value,
                                                        }))
                                                    }
                                                    size="sm"
                                                    isInvalid={!!formErrors.collegeName}
                                                    errorMessage={formErrors.collegeName}
                                                    classNames={{ label: "!text-primary-700 font-medium" }}
                                                />
                                            </>
                                        )}
                                    </div>

                                    {/* Donation Items */}
                                    {selectedItemsDetails.length === 0 ? (
                                        <Card shadow="none" className="border border-default-300 p-4">
                                            <p className="text-sm text-default-500 italic">
                                                No donation items selected
                                            </p>
                                        </Card>
                                    ) : (
                                        <Card shadow="none" className="border border-default-100">
                                            <CardHeader className="text-sm font-semibold text-primary-700">
                                                Selected Items
                                            </CardHeader>
                                            <Divider />
                                            <CardBody className="space-y-4">
                                                {selectedItemsDetails.map((item) => {
                                                    const quantity = itemCounts?.[item.id] ?? 1;
                                                    const sponsor = sponsorshipOptions.find(
                                                        (s) => s.id === item.id
                                                    );

                                                    let itemTotal = 0;
                                                    let displayAmount = 0;

                                                    if (sponsor) {
                                                        const key = sponsor.durations[0]; // first duration
                                                        const sponsorAmount = sponsor.onceAmounts[key] ?? 0;
                                                        itemTotal = sponsorAmount * quantity;
                                                        displayAmount = sponsorAmount;
                                                    } else {
                                                        const itemAmount =
                                                            item.isCustom && customAmounts[item.id]
                                                                ? customAmounts[item.id]
                                                                : item.amount;
                                                        itemTotal = itemAmount * quantity;
                                                        displayAmount = itemAmount;
                                                    }

                                                    return (
                                                        <div
                                                            key={item.id}
                                                            className="flex flex-col md:flex-row md:justify-between md:items-center pb-2"
                                                        >
                                                            <div className="flex flex-col">
                                                                <span className="text-sm font-medium text-default-700">
                                                                    {item.name || item.label}
                                                                </span>
                                                                {item.isCustom && customAmounts[item.id] && (
                                                                    <span className="text-xs text-default-500">
                                                                        Custom Amount: ₹
                                                                        {customAmounts[item.id].toLocaleString("en-IN")}
                                                                    </span>
                                                                )}
                                                                {quantity > 1 && (
                                                                    <span className="text-xs text-default-500">
                                                                        ₹{displayAmount.toLocaleString("en-IN")} ×{" "}
                                                                        {quantity}
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <span className="text-sm font-semibold text-primary">
                                                                ₹{itemTotal.toLocaleString("en-IN")}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </CardBody>

                                            <Divider />
                                            <CardFooter className="flex justify-between items-center pt-3 mt-2">
                                                <span className="text-sm font-medium text-default-700">
                                                    Total Amount
                                                </span>
                                                <span className="text-sm font-semibold text-primary">
                                                    ₹{totalAmount.toLocaleString("en-IN")}
                                                </span>
                                            </CardFooter>
                                        </Card>
                                    )}
                                </>
                            )}
                        </ModalBody>

                        {/* Footer */}
                        <ModalFooter>
                            {totalAmount > 500000 ? null : (
                                <Button
                                    fullWidth
                                    color="primary"
                                    onPress={handleSubmit}
                                    isDisabled={isSubmitting}
                                    isLoading={isSubmitting}
                                >
                                    Make Payment
                                </Button>
                            )}
                        </ModalFooter>
                    </>
                )}
            </ModalContent>

        </Modal >
    );
}
