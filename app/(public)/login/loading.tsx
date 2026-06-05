export default function LoginLoading() {
    return (
        <div className="flex min-h-screen w-full bg-white">
            <div className="hidden lg:flex lg:w-1/2 bg-primary" />
            <div className="flex-1 flex items-center justify-center p-6 animate-pulse">
                <div className="w-full max-w-[420px] space-y-6">
                    <div className="h-8 w-48 bg-gray-200 rounded mx-auto" />
                    <div className="h-4 w-64 bg-gray-200 rounded mx-auto" />
                    <div className="h-12 w-full bg-gray-200 rounded" />
                    <div className="h-12 w-full bg-gray-200 rounded" />
                    <div className="h-12 w-full bg-gray-200 rounded" />
                </div>
            </div>
        </div>
    );
}
