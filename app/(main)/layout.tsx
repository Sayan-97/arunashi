import { cookies } from "next/headers";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import { Toaster } from "@/components/ui/sonner";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.has("arunashiAccessToken");

  return (
    <body>
      <Toaster />
      <Header isLoggedIn={isLoggedIn} />
      {children}
      <Footer />
    </body>
  );
}
