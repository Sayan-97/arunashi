import { cookies } from "next/headers";
import Image from "next/image";
import Header from "@/components/layout/header";
import { Toaster } from "@/components/ui/sonner";
import OnboardingBgImg from "@/public/onboarding-bg.png";

export default async function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("arunashiAccessToken");

  return (
    <body className="flex flex-col">
      <Toaster />
      <Header isLoggedIn={isLoggedIn} />
      <main className="flex-1 relative flex">
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
