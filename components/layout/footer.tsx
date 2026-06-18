import Link from "next/link";
import { footerLinks } from "@/constants";
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
        <div className="space-x-6 flex items-center">
          <Link
            href="https://www.facebook.com/arunashi/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity"
          >
            <i className="fi fi-brands-facebook text-2xl"></i>
          </Link>
          <Link
            href="https://www.instagram.com/arunashibh/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity"
          >
            <i className="fi fi-brands-instagram text-2xl"></i>
          </Link>
          <Link
            href="https://www.pinterest.com/arunashibh/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-70 transition-opacity"
          >
            <i className="fi fi-brands-pinterest text-2xl"></i>
          </Link>
        </div>
      </div>
    </footer>
  );
}
