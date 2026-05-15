import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContactUsPage() {
  return (
    <div className="app_container space-y-15 py-20">
      <p className="text-center text-4xl text-foreground font-normal tracking-wide">
        Have a question ? Contact Us
      </p>

      <div className="max-w-[930px] mx-auto bg-secondary p-12 border border-black/5 flex flex-col md:flex-row gap-16">
        <div className="flex-1 space-y-5">
          <Input
            placeholder="Name*"
            className="w-full h-[57px] bg-input border-0 rounded-none px-6 text-base placeholder:text-[#888]"
          />
          <Input
            placeholder="Email*"
            className="w-full h-[57px] bg-input border-0 rounded-none px-6 text-base placeholder:text-[#888]"
          />
          <textarea
            placeholder="Message"
            className="w-full h-[180px] bg-input border-0 rounded-none p-6 text-base outline-none resize-none placeholder:text-[#888]"
          />
          <Button
            variant="outline"
            className="w-full h-[57px] rounded-none border-primary/60 text-foreground font-normal text-lg bg-transparent hover:bg-primary/5 transition-colors"
          >
            Send
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
            <p>Email : sales@arunashi.com</p>
            <p>Phone : +1 310-888-0123</p>
            <div className="flex items-center gap-6 pt-1">
              <span className="text-lg font-normal">Social</span>
              <div className="flex items-center gap-5">
                <i className="fi fi-brands-facebook text-xl cursor-pointer hover:text-primary transition-colors"></i>
                <i className="fi fi-brands-instagram text-xl cursor-pointer hover:text-primary transition-colors"></i>
                <i className="fi fi-brands-pinterest text-xl cursor-pointer hover:text-primary transition-colors"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
