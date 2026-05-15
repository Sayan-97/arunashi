import Image from "next/image";
import Header from "@/components/layout/header";
import OnboardingBgImg from "@/public/onboarding-bg.png";

export default function OnboardingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body className="flex flex-col">
      <Header />
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
