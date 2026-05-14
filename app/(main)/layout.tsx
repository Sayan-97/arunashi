import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <body>
      <Header />
      {children}
      <Footer />
    </body>
  );
}
