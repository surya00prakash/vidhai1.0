export default function OurMissionLoading() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse">
            <div className="grid gap-6 md:grid-cols-1">
                <div className="flex flex-col md:flex-row gap-20">
                    <div className="w-full md:w-1/2 space-y-4 p-6">
                        <div className="h-8 w-3/4 bg-gray-200 rounded" />
                        <div className="space-y-2">
                            <div className="h-4 w-full bg-gray-200 rounded" />
                            <div className="h-4 w-full bg-gray-200 rounded" />
                            <div className="h-4 w-5/6 bg-gray-200 rounded" />
                            <div className="h-4 w-full bg-gray-200 rounded" />
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 h-64 bg-gray-200 rounded-xl" />
                </div>
            </div>
            {/* Trustee cards skeleton */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-48 bg-gray-200 rounded-xl" />
                ))}
            </div>
        </div>
    );
}
