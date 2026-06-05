export default function ProfileLoading() {
    return (
        <div className="min-h-screen bg-[#f8fafc] animate-pulse">
            {/* Header skeleton */}
            <header className="bg-white shadow-sm border-b border-gray-100 h-16" />
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
                {/* Profile card skeleton */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <div className="h-6 w-40 bg-gray-200 rounded mb-6" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <div className="h-3 w-20 bg-gray-200 rounded" />
                            <div className="h-5 w-48 bg-gray-200 rounded" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-3 w-20 bg-gray-200 rounded" />
                            <div className="h-5 w-48 bg-gray-200 rounded" />
                        </div>
                    </div>
                </div>
                {/* Transactions skeleton */}
                <div className="bg-white rounded-xl border border-gray-100 p-6">
                    <div className="h-6 w-40 bg-gray-200 rounded mb-6" />
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-12 w-full bg-gray-200 rounded mb-3" />
                    ))}
                </div>
            </main>
        </div>
    );
}
