"use client"
import { Spinner } from "@heroui/react";

export default function FullPageLoader() {
    return (
        <div className="flex h-screen items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-3">
                <Spinner size="lg" color="primary" />
                <p className="text-sm text-default-500">Loading, please wait...</p>
            </div>
        </div>
    );
}
