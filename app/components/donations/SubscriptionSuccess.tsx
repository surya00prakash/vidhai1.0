// components/SuccessModal.tsx
"use client";

import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Chip,
    Divider,
    Card,
    CardBody
} from "@heroui/react";
import Link from "next/link";

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    subscriptionId: string;
    name?: string;
}

export default function SuccessModal({ isOpen, onClose, subscriptionId, name }: SuccessModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            hideCloseButton
            placement="center"
            size="md"
            backdrop="blur"
            classNames={{
                base: "bg-gradient-to-br from-white to-default-50",
                backdrop: "bg-black/50 backdrop-blur-sm",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col items-center gap-3 pb-2">
                            <div className="w-16 h-16 bg-gradient-to-br from-success-400 to-success-600 rounded-full flex items-center justify-center shadow-lg">
                                <svg
                                    className="w-8 h-8 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <div className="text-center">
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-success-600 to-success-500 bg-clip-text text-transparent">
                                    Payment Successful!
                                </h2>
                                <p className="text-sm text-default-500 mt-1">
                                    {name ? `${name}, thank you for your generous support` : "Thank you for your generous support"}
                                </p>
                            </div>
                        </ModalHeader>

                        <ModalBody className="px-6 pb-2">
                            <Card className="bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200">
                                <CardBody className="p-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-default-700">
                                                Donation Status
                                            </span>
                                            <Chip
                                                color="success"
                                                variant="flat"
                                                size="sm"
                                                startContent={
                                                    <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
                                                }
                                            >
                                                Active
                                            </Chip>
                                        </div>

                                        <Divider />

                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-default-700">
                                                Subscription Details:
                                            </p>
                                            <div className="bg-default-100 rounded-lg p-3">
                                                <p className="text-xs text-default-500 mb-1">
                                                    Subscription ID
                                                </p>
                                                <p className="font-mono text-sm text-primary-600 font-semibold break-all">
                                                    {subscriptionId}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-primary-100 to-secondary-100 rounded-lg p-3 mt-3">
                                            <p className="text-xs text-primary-700 font-medium mb-1">
                                                💡 What's Next?
                                            </p>
                                            <p className="text-xs text-primary-600">
                                                Your monthly donation will be automatically processed. You'll receive email confirmations for each transaction.<br />

                                                We will send the receipt within 7 business days. If you have any questions, please feel free to reach out to us at donorsupport@agaram.in. We’ll be happy to assist you.
                                            </p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </ModalBody>

                        <ModalFooter className="px-6 pt-2">
                            <div className="flex gap-2 w-full">
                                <Button
                                    variant="bordered"
                                    color="primary"
                                    onPress={() => {
                                        navigator.clipboard.writeText(subscriptionId);
                                        // You could add a toast notification here
                                    }}
                                    className="flex-1"
                                    size="sm"
                                >
                                    Copy ID
                                </Button>
                                <Button
                                    color="primary"
                                    className="flex-1 bg-primary-500 text-white font-semibold"
                                    size="sm"
                                    as={Link}
                                    href="/"
                                >
                                    Home
                                </Button>
                            </div>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}