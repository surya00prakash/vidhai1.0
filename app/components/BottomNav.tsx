"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Users, Gift, BarChart2, User, type LucideIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useAuthApi } from "@/hooks/useAuthApi";
import { apiClient } from "@/services/apiClient";
import { useState, useEffect } from "react";

type NavItem = { label: string; href: string; icon: LucideIcon; featured?: boolean };

const navItems: NavItem[] = [
    { label: "Home", href: "/", icon: Home },
    { label: "Volunteer", href: "/join-us/volunteers", icon: Users },
    { label: "Donate", href: "/donate", icon: Gift, featured: true },
    { label: "Financials", href: "/financials", icon: BarChart2 },
    { label: "Profile", href: "/profile", icon: User },
];

export default function BottomNav() {
    const pathname = usePathname();
    const { auth } = useAuth();
    const isLoggedIn = !!auth.accessToken;
    const [userInitial, setUserInitial] = useState<string>("");
    const authFetch = useAuthApi();

    useEffect(() => {
        if (isLoggedIn && auth.userId) {
            authFetch(t => apiClient.getUserProfile(auth.userId!, t))
                .then(p => setUserInitial((p.fullName || auth.userEmail || "U")[0].toUpperCase()))
                .catch(() => setUserInitial((auth.userEmail || "U")[0].toUpperCase()));
        } else {
            setUserInitial("");
        }
    }, [isLoggedIn, auth.userId]);

    return (
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex items-end h-16 px-2 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
            {navItems.map(({ label, href, icon: Icon, featured }) => {
                const resolvedHref =
                    featured && !isLoggedIn ? `/login?returnUrl=/donate` : href;
                const isActive =
                    href === "/" ? pathname === "/" : pathname.startsWith(href);
                const isProfile = label === "Profile";

                if (featured) {
                    return (
                        <Link
                            key={label}
                            href={resolvedHref}
                            className="flex flex-col items-center flex-1 pb-3 gap-1"
                        >
                            <span className="relative -top-5 flex items-center justify-center w-14 h-14 rounded-full bg-primary shadow-lg shadow-primary/30">
                                <Icon size={26} className="text-white" strokeWidth={1.8} />
                            </span>
                            <span className="text-[11px] font-semibold text-primary -mt-4">
                                {label}
                            </span>
                        </Link>
                    );
                }

                if (isProfile) {
                    return (
                        <Link
                            key={label}
                            href={href}
                            className="flex flex-col items-center flex-1 pb-3 pt-2 gap-1"
                        >
                            {isLoggedIn && userInitial ? (
                                <span className={`flex items-center justify-center w-7 h-7 rounded-full text-[13px] font-bold leading-none
                                    ${isActive ? "bg-primary text-white" : "bg-primary/10 text-primary"}`}>
                                    {userInitial}
                                </span>
                            ) : (
                                <User
                                    size={22}
                                    strokeWidth={1.8}
                                    className={isActive ? "text-primary" : "text-gray-400"}
                                />
                            )}
                            <span className={`text-[11px] font-medium ${isActive ? "text-primary font-semibold" : "text-gray-400"}`}>
                                {label}
                            </span>
                        </Link>
                    );
                }

                return (
                    <Link
                        key={label}
                        href={href}
                        className="flex flex-col items-center flex-1 pb-3 pt-2 gap-1"
                    >
                        <Icon
                            size={22}
                            strokeWidth={1.8}
                            className={isActive ? "text-primary" : "text-gray-400"}
                        />
                        <span
                            className={`text-[11px] font-medium ${isActive ? "text-primary font-semibold" : "text-gray-400"}`}
                        >
                            {label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
