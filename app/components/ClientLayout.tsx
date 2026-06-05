"use client";

import { usePathname } from "next/navigation";
import NavBar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const hideNavbar = pathname.startsWith("/mob");
    const hideFooter = pathname.startsWith("/mob") || pathname.startsWith("/donate");
    const hideBottomNav = pathname.startsWith("/mob") || pathname.startsWith("/login") || pathname.startsWith("/donate");

    return (
        <>
            {!hideNavbar && <NavBar />}
            <main className="flex-grow w-full overflow-x-hidden overflow-y-auto sm:pb-0 pb-16">
                {children}
            </main>
            {!hideFooter && <Footer />}
            {!hideBottomNav && <BottomNav />}
        </>
    );
}
