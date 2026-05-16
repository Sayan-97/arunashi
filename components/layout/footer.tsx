import Link from "next/link";
import { footerLinks } from "@/constants";
import { Button } from "../ui/button";

export default function Footer() {
  return (
    <footer className="pt-[54px] mt-15 pb-[30px] border-t border-black/10">
      <div className="app_container flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-25">
        <ul className="flex-1 flex flex-col md:flex-row items-center justify-between gap-4">
          {footerLinks.map((link) => (
            <li key={link.label}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
        <div className="space-x-6">
          <i className="fi fi-brands-facebook text-2xl"></i>
          <i className="fi fi-brands-instagram text-2xl"></i>
          <i className="fi fi-brands-pinterest text-2xl"></i>
        </div>
      </div>
      <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-10">
        <div className="w-full max-w-[180px]">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full bg-transparent border-b border-black/60 py-2 outline-none text-center placeholder:text-black/50 font-nunito"
          />
        </div>
        <Button variant="outline">JOIN THE LIST</Button>
      </div>
    </footer>
  );
}
