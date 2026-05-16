"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    clientName: "",
    company: "",
    email: "",
    phone: "",
    address: "",
    pressPublicationTitle: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    const { clientName, company, email, phone, address } = formData;

    if (!clientName || !company || !email || !phone || !address) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send request");
      }

      toast.success("Account request submitted successfully!");
      router.push("/submission");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <div className="space-y-5.5">
          <div className="grid md:grid-cols-2 gap-5.5">
            <Input
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              placeholder="Client Name*"
              className="w-full h-[57px] rounded-none border-0"
            />
            <Input
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="Company*"
              className="w-full h-[57px] rounded-none border-0"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-5.5">
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email*"
              className="w-full h-[57px] rounded-none border-0"
            />
            <Input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone*"
              className="w-full h-[57px] rounded-none border-0"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-5.5">
            <Input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Address*"
              className="w-full h-[57px] rounded-none border-0"
            />
            <Input
              name="pressPublicationTitle"
              value={formData.pressPublicationTitle}
              onChange={handleChange}
              placeholder="Press Publication Title"
              className="w-full h-[57px] rounded-none border-0"
            />
          </div>
        </div>
        <div className="flex flex-col items-center gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Create Account"}
          </Button>
          <Link href="/login">
            <Button variant="link" className="text-foreground">
              Already Registered?
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
