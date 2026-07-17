import NextTopLoader from "nextjs-toploader";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import RealtimeSyncListener from "@/components/shared/RealtimeSyncListener";
import { Toaster } from "@/components/ui/sonner";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // proxy.ts redirects any unauthenticated request to /login before it reaches
  // this layout, so routes under (main) are only ever rendered for a logged-in user.
  return (
    <body>
      <NextTopLoader color="#627426" showSpinner={false} height={3} />
      <Toaster />
      <RealtimeSyncListener />
      <Header isLoggedIn />
      {children}
      <Footer />
    </body>
  );
}
