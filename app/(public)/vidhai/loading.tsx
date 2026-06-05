export default function VidhaiLoading() {
    return (
        <div className="min-h-screen animate-pulse">
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="h-10 w-48 bg-gray-200 rounded mx-auto mb-4" />
                <div className="h-6 w-96 bg-gray-200 rounded mx-auto mb-12" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-64 bg-gray-200 rounded-xl" />
                    ))}
                </div>
            </div>
        </div>
    );
}
