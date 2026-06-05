export default function OurJourneyLoading() {
    return (
        <div className="min-h-screen animate-pulse">
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="h-10 w-64 bg-gray-200 rounded mx-auto mb-8" />
                <div className="space-y-8">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex gap-8 items-center">
                            <div className="w-24 h-24 bg-gray-200 rounded-full flex-shrink-0" />
                            <div className="flex-1 space-y-3">
                                <div className="h-6 w-32 bg-gray-200 rounded" />
                                <div className="h-4 w-full bg-gray-200 rounded" />
                                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
