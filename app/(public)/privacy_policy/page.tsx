"use client";

import { Card, CardBody, CardHeader } from "@heroui/react";

export default function PrivacyPolicyPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <Card className="shadow-lg rounded-2xl border border-gray-200">
                <CardHeader className="text-3xl font-bold text-gray-800">
                    Privacy Policy
                </CardHeader>
                <CardBody className="space-y-6 text-gray-700 text-base leading-relaxed">
                    <p>
                        Agaram Foundation takes your privacy seriously and treats all financial information about any transaction you have with the Foundation as highly confidential.
                    </p>
                    <p>
                        In addition, Agaram Foundation does not share e-mail addresses or phone numbers of any of our donors or constituents. The Foundation deeply values all contributions to sustain our mission.
                    </p>
                    <p>
                        To protect the privacy of our donors and their special relationship with Agaram Foundation, we maintain the following policies:
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-2">
                        <li>
                            We may request personal information online, such as name, address, phone number, email address, and account details for the purposes of accepting donations to Agaram Foundation.
                        </li>
                        <li>
                            We will not release or use this information for any other purpose unless we have your consent.
                        </li>
                        <li>
                            We do not trade or sell your personal information with other organisations.
                        </li>
                        <li>
                            Donors may request to not receive certain mailings, such as our newsletter.
                        </li>
                        <li>
                            Personal information stored in Agaram Foundation&apos;s database is protected with a secured login with authentication, assignment of a unique ID to each person with computer access and user IDs are deactivated or terminated as needed.
                        </li>
                    </ul>
                    <p>
                        To assure that philanthropy merits the respect and trust of the general public, and that donors and prospective donors can have full confidence in the not-for-profit organisations and causes they are asked to support, we assure the following:
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-2">
                        <li>
                            To be informed of the foundation&apos;s mission, of the way the foundation intends to use donated resources, and of its capacity to use donations effectively for their intended purposes
                        </li>
                        <li>
                            To have access to the foundation&apos;s most recent financial statements
                        </li>
                        <li>
                            To receive appropriate acknowledgment
                        </li>
                        <li>
                            To be assured that information about their donations is handled with respect and with confidentiality to the extent provided by law
                        </li>
                    </ul>
                    <h2 className="text-xl font-semibold pt-4">
                        For Indian Passport holders living outside India:
                    </h2>
                    <p>
                        You will still be treated as an Indian donor and will need to submit details of your passport along with other required details.
                    </p>

                    <h2 className="text-xl font-semibold pt-4">
                        For Non-Indian Passport holders:
                    </h2>
                    <p>
                        Your contribution will be treated as a foreign donation and routed to our FCRA account. We will need your passport details along with other donor details.
                    </p>

                    <h2 className="text-xl font-semibold pt-4">Donation Refund Policy:</h2>
                    <p>
                        Agaram Foundation doesn&apos;t encourage refund or cancellation of funds.
                    </p>

                    <p>
                        For more queries, please contact the Agaram office or email us at{" "}
                        <a
                            href="mailto:donorenquiry@agaram.in"
                            className="text-blue-600 underline"
                        >
                            donorenquiry@agaram.in
                        </a>
                    </p>
                </CardBody>
            </Card>
        </div>
    );
}
