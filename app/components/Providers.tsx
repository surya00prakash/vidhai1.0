// components/Providers.tsx
"use client";

import { HeroUIProvider } from "@heroui/react";
import { AuthProvider } from "@/context/AuthContext";

type ProvidersProps = {
    children: React.ReactNode;
};

const Providers = ({ children }: ProvidersProps) => {
    return (
        <HeroUIProvider>
            <AuthProvider>{children}</AuthProvider>
        </HeroUIProvider>
    );
};

export default Providers;
