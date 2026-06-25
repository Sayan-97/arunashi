"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ActivationStatusClient() {
  useEffect(() => {
    // Clear the activation_success cookie on mount to make it one-time viewable
    // biome-ignore lint/suspicious/noDocumentCookie: Clear temporary cookie to prevent page access on refresh
    document.cookie =
      "activation_success=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }, []);

  return (
    <div className="app_container flex items-center justify-center">
      <section className="w-full max-w-[829px] p-10 space-y-7 text-center bg-secondary">
        <h1>Account Activated</h1>
        <p className="text-secondary-foreground text-2xl mx-auto">
          Your account has been successfully set up. You can now access the
          Arunashi Retailer Portal.
        </p>
        <Link href="/login">
          <Button variant="outline" size="lg" className="px-10">
            Log In
          </Button>
        </Link>
      </section>
    </div>
  );
}
