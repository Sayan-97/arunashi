import { cookies } from "next/headers";
import NextTopLoader from "nextjs-toploader";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import RealtimeSyncListener from "@/components/shared/RealtimeSyncListener";
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
      <NextTopLoader color="#627426" showSpinner={false} height={3} />
      <Toaster />
      <RealtimeSyncListener />
      <Header isLoggedIn={isLoggedIn} />
      {children}
      <Footer />
    </body>
  );
}
