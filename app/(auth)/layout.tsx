import Image from "next/image";
import NextTopLoader from "nextjs-toploader";
import Header from "@/components/layout/header";
import { Toaster } from "@/components/ui/sonner";
import OnboardingBgImg from "@/public/onboarding-bg.png";

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // proxy.ts redirects any already-authenticated request away from these routes
  // (back to /), so (auth) routes are only ever rendered for a logged-out user.
  return (
    <body className="flex flex-col">
      <NextTopLoader color="#627426" showSpinner={false} height={3} />
      <Toaster />
      <Header />
      <main className="flex-1 relative flex py-10">
        <Image
          src={OnboardingBgImg}
          alt="Image"
          fill
          priority
          placeholder="blur"
          className="-z-10"
        />
        {children}
      </main>
    </body>
  );
}
