"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { sendContactEmail } from "@/actions/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactUsPage() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const res = await sendContactEmail(formData);
      if (res.success) {
        toast.success("Message sent successfully!");
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error(res.error || "Failed to send message");
      }
    } catch (_error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app_container space-y-15 py-20">
      <p className="text-center text-4xl text-foreground font-normal tracking-wide">
        Have a question ? Contact Us
      </p>

      <form
        onSubmit={handleSubmit}
        className="max-w-[930px] mx-auto bg-secondary p-12 border border-black/5 flex flex-col md:flex-row gap-16"
      >
        <div className="flex-1 space-y-5">
          <Input
            placeholder="Name*"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full h-[57px] bg-input border-0 rounded-none px-6 text-base placeholder:text-[#888]"
            required
          />
          <Input
            type="email"
            placeholder="Email*"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="w-full h-[57px] bg-input border-0 rounded-none px-6 text-base placeholder:text-[#888]"
            required
          />
          <textarea
            placeholder="Message"
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            className="w-full h-[180px] bg-input border-0 rounded-none p-6 text-base outline-none resize-none placeholder:text-[#888]"
            required
          />
          <Button
            type="submit"
            disabled={loading}
            variant="outline"
            className="w-full h-[57px] rounded-none border-primary/60 text-foreground font-normal text-lg bg-transparent hover:bg-primary/5 transition-colors"
          >
            {loading ? "Sending..." : "Send"}
          </Button>
        </div>

        <div className="hidden md:block w-px bg-black/10 self-stretch" />

        <div className="flex flex-col justify-start space-y-8 md:w-[320px]">
          <h2 className="font-fleur text-[72px] leading-none uppercase tracking-wide text-foreground">
            Contact
          </h2>
          <div className="space-y-5 text-[17px] font-light text-foreground/80 tracking-wide">
            <p className="cursor-pointer hover:text-primary transition-colors">
              Book an Appointment
            </p>
            <p>Email : hello@arunashi.com</p>
            <p>Phone : +1 310-888-0123</p>
            <div className="flex items-center gap-6 pt-1">
              <span className="text-lg font-normal">Social</span>
              <div className="flex items-center gap-5">
                <Link
                  href="https://www.facebook.com/arunashi/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fi fi-brands-facebook text-xl cursor-pointer hover:text-primary transition-colors"></i>
                </Link>
                <Link
                  href="https://www.instagram.com/arunashibh/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fi fi-brands-instagram text-xl cursor-pointer hover:text-primary transition-colors"></i>
                </Link>
                <Link
                  href="https://www.pinterest.com/arunashibh/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fi fi-brands-pinterest text-xl cursor-pointer hover:text-primary transition-colors"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
