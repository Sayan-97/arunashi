import Image from "next/image";
import Link from "next/link";
import ContactUs from "@/components/layout/contact-us";
import RelatedProducts from "@/components/layout/related-products";
import ShareProduct from "@/components/layout/share-product";
import { Button } from "@/components/ui/button";
import { products } from "@/constants";

export default function ProductDetailsPage() {
  const product = products[0];
  return (
    <main className="app_container py-15 space-y-25">
      <section className="grid lg:grid-cols-2 gap-19">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-full h-[320px] md:h-[550px]">
            <Image
              src={product.image}
              alt="Product Images"
              fill
              priority
              placeholder="blur"
              className="object-cover"
            />
          </div>
          <div className="flex items-center gap-2.5">
            {[1, 2, 3, 4].map((i) => (
              <Image
                key={i}
                src={product.image}
                alt="Product Images"
                width={97}
                height={97}
                className="max-md:size-20"
              />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <h1>Premium emerald inlay seamless ring</h1>
          <div className="flex items-center gap-4 text-xl">
            <p>MSRP - $30,600 USD</p>
            <p>Wholesale - $30,600 USD</p>
          </div>
          <div className="grid grid-cols-2 py-3 border-y border-black/10">
            <div className="border-r border-black/10">
              <p>Item Number</p>
              <p className="text-lg">XBHYU-098</p>
            </div>
            <div className="flex flex-col items-center">
              <p>Stock Status</p>
              <p className="text-lg text-success">In Stock</p>
            </div>
          </div>
          <div className="space-y-6">
            <ShareProduct />
            <Button variant="outline" size="lg" className="w-full">
              Add to Request List
            </Button>
          </div>
          <ul className="list-disc list-inside space-y-1.5 text-gray-400 marker:text-gray-400">
            {[
              { title: "Download Linesheet", link: "" },
              { title: "Download Photos", link: "" },
              { title: "Download Videos", link: "" },
              { title: "Download diamond lab reports", link: "" },
            ].map((item) => (
              <li key={item.title}>
                <Link
                  href={item.link}
                  className="text-xl underline underline-offset-2 hover:text-foreground"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <ContactUs />
      <RelatedProducts />
    </main>
  );
}
