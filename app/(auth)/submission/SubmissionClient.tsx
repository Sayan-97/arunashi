"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function SubmissionClient() {
  useEffect(() => {
    // Clear the signup_success cookie on mount to make it one-time viewable
    // biome-ignore lint/suspicious/noDocumentCookie: Clear temporary cookie to prevent page access on refresh
    document.cookie =
      "signup_success=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
  }, []);

  return (
    <div className="app_container flex items-center justify-center">
      <section className="w-full max-w-[829px] p-10 space-y-7 text-center bg-secondary">
        <h1>Application Submitted</h1>
        <p className="text-secondary-foreground text-2xl mx-auto">
          Your request to join the Arunashi Retailer Portal has been
          successfully submitted. Our team will review your details and notify
          you by email once your account is approved.
        </p>
        <Link href="/login">
          <Button variant="outline" size="lg" className="px-10">
            Got It
          </Button>
        </Link>
      </section>
    </div>
  );
}
