"use client";

import { Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/constants";
import AppLogo from "@/public/app-logo.png";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import Search from "./search";

function HamburgerMenu() {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="size-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SheetHeader className="text-left mb-8 hidden">
            <SheetTitle className="text-2xl font-fleur uppercase"></SheetTitle>
          </SheetHeader>
          <nav className="flex flex-col gap-6 mt-8 ml-4">
            {navLinks.map((link) => (
              <SheetClose key={link.label} asChild>
                <Link
                  href={link.href}
                  className="text-4xl font-fleur font-medium hover:text-gray-600 transition-colors"
                >
                  {link.label}
                </Link>
              </SheetClose>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const onboardingRoutes = [
    "/login",
    "/signup",
    "/submission",
    "/create-password",
  ];
  return (
    <header>
      <div className="h-30.25 bg-secondary">
        <div className="app_container h-full flex items-center justify-between">
          <HamburgerMenu />
          {/* Spacer for desktop to keep logo centered */}
          <div className="hidden md:block w-10" />
          <Link href="/">
            <Image
              src={AppLogo}
              alt="App Logo"
              priority
              placeholder="blur"
              className="w-[164px] h-full"
            />
          </Link>
          <Search />
        </div>
      </div>
      {!onboardingRoutes.includes(pathname) && (
        <div className="max-md:hidden bg-highlight h-12">
          <nav className="app_container h-full flex items-center justify-between gap-4">
            {navLinks.map((link) => (
              <Link key={link.label} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
