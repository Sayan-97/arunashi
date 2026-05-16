"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import ContactUs from "@/components/layout/contact-us";
import RelatedProducts from "@/components/layout/related-products";
import ShareProduct from "@/components/layout/share-product";
import { Button } from "@/components/ui/button";
import { productsData } from "@/constants";
import { cn } from "@/lib/utils";
export default function ProductDetailsPage() {
  const { slug } = useParams();
  const product =
    productsData.find((p) => p.id.toString() === slug) || productsData[0];

  const productImages = [
    product.featuredImage,
    product.featuredImage,
    product.featuredImage,
    product.featuredImage,
  ];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("Description");

  return (
    <main className="app_container py-15 space-y-25">
      <section className="grid lg:grid-cols-2 gap-19">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-full h-[320px] md:h-[550px]">
            <Image
              src={productImages[selectedIndex]}
              alt="Product Images"
              fill
              priority
              placeholder="blur"
              className="object-cover"
            />
          </div>
          <div className="flex items-center gap-2.5">
            {productImages.map((img, i) => (
              <button
                // biome-ignore lint/suspicious/noArrayIndexKey: using index for mock placeholder images
                key={`thumb-${i}`}
                type="button"
                onClick={() => setSelectedIndex(i)}
                className={cn(
                  "relative border-2 transition-all overflow-hidden",
                  selectedIndex === i
                    ? "border-highlight"
                    : "border-transparent",
                )}
              >
                <Image
                  src={img}
                  alt={`Product View ${i + 1}`}
                  width={97}
                  height={97}
                  className="max-md:size-20"
                />
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-8">
          <h1>Premium emerald inlay seamless ring</h1>
          <div className="flex items-center gap-4 text-xl">
            <p>MSRP - ${Number(product.msrp).toLocaleString()} USD</p>
            <p>Wholesale - $30,600 USD</p>
          </div>
          <div className="grid grid-cols-2 py-3 border-y border-black/10">
            <div className="border-r border-black/10">
              <p className="text-muted-foreground">Item Number</p>
              <p className="text-lg">XBHYU-098</p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-muted-foreground">Stock Status</p>
              <div className="flex items-center gap-2">
                <span className="size-2 bg-green-600 rounded-full" />
                <p className="text-lg text-green-600">In Stock</p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-8 border-b border-black/10">
              {["Description", "Specifications"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "pb-2 transition-all relative",
                    activeTab === tab
                      ? "text-foreground font-medium"
                      : "text-gray-400",
                  )}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute -bottom-px left-0 w-full h-0.5 bg-highlight" />
                  )}
                </button>
              ))}
            </div>
            <div className="text-gray-500 text-lg leading-relaxed">
              {activeTab === "Description" ? (
                <p>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-y-2 max-w-sm">
                  <p>Material</p>
                  <p className="text-gray-900">18K Yellow Gold</p>
                  <p>Gemstone</p>
                  <p className="text-gray-900">Emerald</p>
                  <p>Weight</p>
                  <p className="text-gray-900">2.5g</p>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-6">
            <ShareProduct product={product} />
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
