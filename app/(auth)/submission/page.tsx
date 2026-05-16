import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SubmissionPage() {
  return (
    <div className="app_container flex items-center justify-center">
      <section className="w-full max-w-[829px] p-10 space-y-7 text-center bg-secondary">
        <h1>Application Submitted</h1>
        <p className="text-secondary-foreground text-2xl mx-auto">
          Your request to join the Arunashi Retailer Portal has been
          successfully submitted. Our team will review your details and notify
          you by email once your account is approved.
        </p>
        <Link href="/">
          <Button variant="outline" size="lg" className="px-10">
            Got It
          </Button>
        </Link>
      </section>
    </div>
  );
}
