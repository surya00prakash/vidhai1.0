export default function DonationSection({
    title,
    children,
}: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}) {
    return (
        <section className="w-full py-3 md:py-4 lg:py-5 border-b border-gray-100">
            <div className="max-w-5xl mx-auto space-y-2 mb-4">
                <h4 className="text-md md:text-md font-medium text-gray-900">{title}
                </h4>
            </div>

            <div className="max-w-5xl mx-auto">
                {children}
            </div>
        </section>
    );
}
