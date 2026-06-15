"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <div className="app_container flex items-center justify-center">
      <section className="w-full max-w-[912px] p-10 space-y-7 bg-secondary">
        <div className="text-center space-y-3">
          <h1>Create your account</h1>
          <p className="w-3/4 mx-auto text-secondary-foreground">
            Submit your details to request access to the Arunashi Retailer
            Portal.
          </p>
        </div>
        <form action={action} className="space-y-7">
          <div className="space-y-5.5">
            <div className="grid md:grid-cols-2 gap-5.5">
              <div className="space-y-1.5">
                <Input
                  name="clientName"
                  placeholder="Client Name*"
                  className="w-full h-[57px] rounded-none border-0"
                />
                {state?.errors?.clientName && (
                  <p className="text-xs text-red-500 font-medium pl-1">
                    {state.errors.clientName[0]}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Input
                  name="company"
                  placeholder="Company*"
                  className="w-full h-[57px] rounded-none border-0"
                />
                {state?.errors?.company && (
                  <p className="text-xs text-red-500 font-medium pl-1">
                    {state.errors.company[0]}
                  </p>
                )}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-5.5">
              <div className="space-y-1.5">
                <Input
                  name="email"
                  type="email"
                  placeholder="Email*"
                  className="w-full h-[57px] rounded-none border-0"
                />
                {state?.errors?.email && (
                  <p className="text-xs text-red-500 font-medium pl-1">
                    {state.errors.email[0]}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Input
                  name="phone"
                  type="tel"
                  placeholder="Phone*"
                  className="w-full h-[57px] rounded-none border-0"
                />
                {state?.errors?.phone && (
                  <p className="text-xs text-red-500 font-medium pl-1">
                    {state.errors.phone[0]}
                  </p>
                )}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-5.5">
              <div className="space-y-1.5">
                <Input
                  name="address"
                  placeholder="Address*"
                  className="w-full h-[57px] rounded-none border-0"
                />
                {state?.errors?.address && (
                  <p className="text-xs text-red-500 font-medium pl-1">
                    {state.errors.address[0]}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Input
                  name="pressPublicationTitle"
                  placeholder="Press Publication Title*"
                  className="w-full h-[57px] rounded-none border-0"
                />
                {state?.errors?.pressPublicationTitle && (
                  <p className="text-xs text-red-500 font-medium pl-1">
                    {state.errors.pressPublicationTitle[0]}
                  </p>
                )}
              </div>
            </div>
            {state?.errors?.form && (
              <p className="text-sm text-red-500 font-medium text-center">
                {state.errors.form}
              </p>
            )}
          </div>
          <div className="flex flex-col items-center gap-4">
            <Button
              variant="outline"
              size="lg"
              type="submit"
              disabled={pending}
            >
              {pending ? "Submitting..." : "Create Account"}
            </Button>
            <Link href="/login">
              <Button type="button" variant="link" className="text-foreground">
                Already Registered?
              </Button>
            </Link>
          </div>
        </form>
      </section>
    </div>
  );
}
