"use client";

import { Menu, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/constants";
import AppLogo from "@/public/app-logo.png";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

function HamburgerMenu() {
  const pathname = usePathname();
  const onboardingRoutes = ["/login", "/signup"];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <Menu className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Hello Word</SheetTitle>
        </SheetHeader>
        Hello World
      </SheetContent>
    </Sheet>
  );
}

export default function Header() {
  return (
    <header>
      <div className="h-30.25 bg-secondary">
        <div className="app_container h-full flex items-center justify-between">
          <HamburgerMenu />
          <Link href="/">
            <Image
              src={AppLogo}
              alt="App Logo"
              priority
              placeholder="blur"
              className="w-[164px] h-full"
            />
          </Link>
          <Search className="size-6" />
        </div>
      </div>
      <div className="max-md:hidden bg-highlight h-12">
        <nav className="app_container h-full flex items-center justify-between gap-4">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
