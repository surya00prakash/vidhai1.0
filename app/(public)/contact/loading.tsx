export default function ContactLoading() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse">
            {/* Hero skeleton */}
            <div className="bg-secondary-900 py-16">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <div className="h-10 w-64 bg-gray-700 rounded mx-auto mb-4" />
                    <div className="h-6 w-96 bg-gray-700 rounded mx-auto" />
                </div>
            </div>
            {/* Content skeleton */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-6">
                        <div className="h-8 w-48 bg-gray-200 rounded" />
                        <div className="h-4 w-full bg-gray-200 rounded" />
                        <div className="h-32 bg-gray-200 rounded-xl" />
                        <div className="h-32 bg-gray-200 rounded-xl" />
                    </div>
                    <div className="space-y-6">
                        <div className="h-96 bg-gray-200 rounded-2xl" />
                    </div>
                </div>
            </div>
        </div>
    );
}
