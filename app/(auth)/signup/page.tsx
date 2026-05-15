import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  return (
    <div className="app_container flex items-center justify-center">
      <section className="w-full max-w-[912PX] p-10 space-y-7 bg-secondary">
        <div className="text-center space-y-3">
          <h1>Create your account</h1>
          <p className="w-3/4 mx-auto text-secondary-foreground">
            Submit your details to request access to the Arunashi Retailer
            Portal.
          </p>
        </div>
        <div className="space-y-5.5">
          <div className="grid md:grid-cols-2 gap-5.5">
            <Input
              placeholder="Client Name*"
              className="w-full h-[57px] rounded-none border-0"
            />
            <Input
              placeholder="Company*"
              className="w-full h-[57px] rounded-none border-0"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-5.5">
            <Input
              placeholder="Email*"
              className="w-full h-[57px] rounded-none border-0"
            />
            <Input
              placeholder="Phone*"
              className="w-full h-[57px] rounded-none border-0"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-5.5">
            <Input
              placeholder="Address*"
              className="w-full h-[57px] rounded-none border-0"
            />
            <Input
              placeholder="Press Publication Title*"
              className="w-full h-[57px] rounded-none border-0"
            />
          </div>
        </div>
        <div className="flex flex-col items-center gap-4">
          <Link href="/submission">
            <Button variant="outline" size="lg">
              Create Account
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="link" className="text-foregorund">
              Already Registered?
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
