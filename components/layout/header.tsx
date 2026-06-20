"use client";

import { LogOut, Menu, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { logout } from "@/actions/auth";
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

function HamburgerMenu({ requestCount }: { requestCount: number }) {
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
                  className="text-4xl font-fleur font-medium hover:text-gray-600 transition-colors flex items-center gap-2"
                >
                  <span>{link.label}</span>
                  {link.label === "Request List" && requestCount > 0 && (
                    <span className="bg-black text-white text-xs font-semibold h-5 w-5 rounded-full flex items-center justify-center">
                      {requestCount}
                    </span>
                  )}
                </Link>
              </SheetClose>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function Header({
  isLoggedIn = false,
}: {
  isLoggedIn?: boolean;
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null,
  );
  const [requestCount, setRequestCount] = useState<number>(0);

  useEffect(() => {
    const updateCount = () => {
      try {
        const stored = localStorage.getItem("request-list");
        if (stored) {
          const list = JSON.parse(stored);
          setRequestCount(Array.isArray(list) ? list.length : 0);
        } else {
          setRequestCount(0);
        }
      } catch (e) {
        console.error("Failed to read request-list count", e);
        setRequestCount(0);
      }
    };

    updateCount();

    window.addEventListener("request-list-updated", updateCount);
    window.addEventListener("storage", updateCount);

    return () => {
      window.removeEventListener("request-list-updated", updateCount);
      window.removeEventListener("storage", updateCount);
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    fetch("/api/user/profile", { method: "POST" })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((json) => {
        if (json.success && json.data) {
          setUser(json.data);
        }
      })
      .catch((err) => console.error("Error fetching user profile:", err));
  }, [isLoggedIn]);

  return (
    <header>
      <div className="h-30.25 bg-secondary">
        <div className="app_container h-full flex items-center justify-between">
          <HamburgerMenu requestCount={requestCount} />
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
          <div className="flex items-center gap-2 relative">
            {isLoggedIn && <Search />}
            {isLoggedIn && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="text-black hover:text-gray-600 transition-colors"
                  aria-label="User Profile"
                >
                  <User className="size-6" />
                </Button>

                {isDropdownOpen && (
                  <>
                    <button
                      type="button"
                      className="fixed inset-0 z-40 bg-transparent cursor-default"
                      onClick={() => setIsDropdownOpen(false)}
                      aria-label="Close user menu"
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-xl border border-black/10 z-50 py-4 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-4 pb-3 border-b border-black/5">
                        <p className="text-xs text-gray-400">Current User</p>
                        <p className="font-semibold text-gray-900 mt-1 truncate">
                          {user ? user.name : "Loading..."}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user ? user.email : ""}
                        </p>
                      </div>
                      <div className="px-2 pt-2">
                        <button
                          type="button"
                          onClick={async () => {
                            setIsDropdownOpen(false);
                            await logout();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors text-left font-medium cursor-pointer"
                        >
                          <LogOut className="size-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {isLoggedIn && (
        <div className="max-md:hidden bg-highlight h-12">
          <nav className="app_container h-full flex items-center justify-between gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="relative flex items-center gap-1.5"
              >
                <span>{link.label}</span>
                {link.label === "Request List" && requestCount > 0 && (
                  <span className="bg-black text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {requestCount}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
