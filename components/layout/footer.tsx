import Link from "next/link";
import { footerLinks } from "@/constants";

export default function Footer() {
  return (
    <footer className="pt-[54px] pb-[30px] border-t border-black/10">
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
    </footer>
  );
}
