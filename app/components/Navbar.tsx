"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
  Image,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";

import { useState, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import { LuLogIn } from "react-icons/lu";
import { useAuth } from "@/context/AuthContext";
import { useAuthApi } from "@/hooks/useAuthApi";
import { apiClient } from "@/services/apiClient";

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const pathname = usePathname();

  const { auth, logout } = useAuth();
  const isLoggedIn = !!auth.accessToken;
  const authFetch = useAuthApi();

  useEffect(() => {
    if (isLoggedIn && auth.userId) {
      authFetch(t => apiClient.getUserProfile(auth.userId!, t))
        .then(p => setUserName(p.fullName || ""))
        .catch(() => {});
    } else {
      setUserName("");
    }
  }, [isLoggedIn, auth.userId]);

  const isGetInvolvedActive = pathname.startsWith("/join-us");

  const handleLogout = useCallback(() => {
    logout(); // logout already calls router.replace('/login')
  }, [logout]);

  // Close mobile menu when a link is clicked
  const closeMobileMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      className="bg-white shadow-sm h-16 md:h-[80px] px-2 md:px-8 sm:border-b sm:border-divider"
      maxWidth="xl"
    >
      {/* 2. Mobile Toggle (Hamburger) - Visible on small/tablet screens */}
      <NavbarContent className="lg:hidden" justify="start">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} className="text-black" />
      </NavbarContent>

      {/* Brand / Logo */}
      <NavbarBrand className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:static lg:translate-x-0 lg:translate-y-0 lg:pr-3 font-bold text-xl text-black items-center">
        <Link href="/" className="flex items-center gap-2 text-black no-underline">
          <Image
            src="/assets/images/logo/agaram_logo.png"
            height={50}
            width={50}
            className="object-contain md:h-[60px] md:w-[60px]"
            alt="Agaram Logo"
          />
        </Link>
      </NavbarBrand>

      {/* Desktop Menu Links (Hidden on Mobile) */}
      <NavbarContent className="hidden lg:flex gap-6" justify="center">
        <NavbarItem>
          <Link href="/" className={`${pathname === "/" ? "text-primary font-bold" : "text-black"}`}>
            Home
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/our_mission" className={`${pathname === "/our_mission" ? "text-primary font-bold" : "text-black"}`}>
            Our Mission
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/our_journey" className={`${pathname === "/our_journey" ? "text-primary font-bold" : "text-black"}`}>
            Our Journey
          </Link>
        </NavbarItem>

        <NavbarItem>
          <Link href="/financials" className={`${pathname === "/financials" ? "text-primary font-bold" : "text-black"}`}>
            Financials
          </Link>
        </NavbarItem>

        <NavbarItem>
          <Link href="/partners" className={`${pathname === "/partners" ? "text-primary font-bold" : "text-black"}`}>
            Partners
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="/Our process" className={`${pathname === "/Our process" ? "text-primary font-bold" : "text-black"}`}>
            Our process
          </Link>
        </NavbarItem>

        {/* Desktop Dropdown for "Be a Part of Us" */}
        <NavbarItem onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
          <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
            <DropdownTrigger>
              <Button
                variant="light"
                className={`font-medium px-0 bg-transparent shadow-none hover:bg-transparent focus:outline-none ${isGetInvolvedActive ? "text-primary font-bold" : "text-black"}`}
                disableRipple
              >
                Be a Part of Us
                <span className="ml-1 text-xs bg-black text-white px-1 rounded">Join</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Be a Part of Us Menu" className="min-w-[200px]">
              <DropdownItem key="volunteer" href="/join-us/volunteers">Volunteer</DropdownItem>
              <DropdownItem key="donors" href="/join-us/donors">Donors</DropdownItem>
              <DropdownItem key="corporates" href="/join-us/corporates">Corporates</DropdownItem>
              <DropdownItem key="institutions" href="/join-us/educational-institutions">Educational Institutions</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarItem>

        <NavbarItem>
          <Link href="/contact" className={`${pathname === "/contact" ? "text-primary font-bold" : "text-black"}`}>
            Contact
          </Link>
        </NavbarItem>
      </NavbarContent>

      

      {/* 3. Action Buttons (Donate & Login/Logout) - Visible on ALL screens */}
      <NavbarContent justify="end" className="gap-2 pl-2">
        {/* Donate Button */}
        <NavbarItem className="hidden sm:flex">
          <Button
            as={Link}
            href={isLoggedIn ? "/donate" : "/login?returnUrl=/donate"}
            radius="sm"
            color="primary"
            className="font-medium text-white h-8 px-3 text-xs md:text-medium md:h-10 md:px-4 min-w-0"
          >
            Donate
          </Button>
        </NavbarItem>

        {/* Login / Logout Logic */}
        <NavbarItem>
          {isLoggedIn ? (
            // --- LOGGED IN STATE: Profile Dropdown ---
            <Dropdown placement="bottom-end">
                <DropdownTrigger>
                    <div className="flex items-center justify-center w-9 h-9 md:w-11 md:h-11 rounded-full bg-primary hover:bg-primary/90 cursor-pointer transition-colors">
                      <span className="text-white font-bold text-sm md:text-base uppercase leading-none">
                        {userName?.[0] || auth.userEmail?.[0] || "U"}
                      </span>
                    </div>
                </DropdownTrigger>
                <DropdownMenu aria-label="Profile Actions" variant="flat">
                    <DropdownItem key="email" className="h-14 gap-2" textValue="Signed in as">
                        <p className="font-semibold">Signed in as</p>
                        <p className="font-semibold text-primary">{auth.userEmail}</p>
                    </DropdownItem>
                    <DropdownItem key="profile" href="/profile">
                        My Profile
                    </DropdownItem>
                    <DropdownItem key="logout" color="danger" onPress={handleLogout}>
                        Log Out
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
          ) : (
            // --- LOGGED OUT STATE: Login Button ---
            <Button
              as={Link}
              href="/login" 
              radius="sm"
              variant="bordered"
              color="default"
              className="font-medium h-8 px-3 text-xs md:text-medium md:h-10 md:px-4 border-gray-300 min-w-0"
            >
              Login 
              <LuLogIn className="ml-1 hidden sm:block" size={16}/>
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      {/* 4. Mobile Menu Links */}
      <NavbarMenu className="pt-6 bg-white overflow-y-auto">
        <NavbarMenuItem>
          <Link href="/" className="w-full text-black" size="lg" onPress={closeMobileMenu}>Home</Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/our_journey" className="w-full text-black" size="lg" onPress={closeMobileMenu}>Our Journey</Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/our_mission" className="w-full text-black" size="lg" onPress={closeMobileMenu}>Our Mission</Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/partners" className="w-full text-black" size="lg" onPress={closeMobileMenu}>Partners</Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/financials" className="w-full text-black" size="lg" onPress={closeMobileMenu}>Financials</Link>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <Link href="/Our process" className="w-full text-black" size="lg" onPress={closeMobileMenu}>Our process</Link>
        </NavbarMenuItem>

        {/* Join Us Section */}
        <NavbarMenuItem className="mt-2 mb-2">
          <div className="w-full">
            <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Be a Part of Us</p>
            <div className="flex flex-col gap-3 pl-4 border-l-2 border-gray-100">
              <Link href="/join-us/volunteers" className="text-black text-base" onPress={closeMobileMenu}>Volunteer</Link>
              <Link href="/join-us/donors" className="text-black text-base" onPress={closeMobileMenu}>Donors</Link>
              <Link href="/join-us/corporates" className="text-black text-base" onPress={closeMobileMenu}>Corporates</Link>
              <Link href="/join-us/educational-institutions" className="text-black text-base" onPress={closeMobileMenu}>Educational Institutions</Link>
            </div>
          </div>
        </NavbarMenuItem>

        <NavbarMenuItem className="mt-2">
          <Link href="/contact" className="w-full text-black" size="lg" onPress={closeMobileMenu}>Contact</Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}