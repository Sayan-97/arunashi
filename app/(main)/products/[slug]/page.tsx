"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import ContactUs from "@/components/layout/contact-us";
import RelatedProducts from "@/components/layout/related-products";
import ShareProduct from "@/components/layout/share-product";
import { Button } from "@/components/ui/button";
import { productsData } from "@/constants";
import { cn } from "@/lib/utils";

// Helper to resolve the source URL of an asset safely
const getSrc = (
  assetSrc: string | { src: string } | undefined | null,
): string => {
  if (!assetSrc) return "";
  let src = typeof assetSrc === "string" ? assetSrc : assetSrc.src || "";
  if (src.startsWith("/public")) {
    src = src.substring(7);
  }
  return src;
};

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const product =
    productsData.find((p) => p.id.toString() === slug) || productsData[0];

  const images =
    product.images || (product.featuredImage ? [product.featuredImage] : []);
  const videos = product.videos || [];
  const assets = [
    ...images.map((img) => ({ type: "image" as const, src: img })),
    ...videos.map((vid) => ({ type: "video" as const, src: vid })),
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("Description");
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isZoomed, setIsZoomed] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <main className="app_container py-15 space-y-25">
      <section className="grid lg:grid-cols-2 gap-19">
        <div className="flex flex-col items-center gap-6">
          {/* biome-ignore lint/a11y/noStaticElementInteractions: Zoom interactive container */}
          <div
            role="presentation"
            className={cn(
              "relative w-full h-[320px] md:h-[550px] bg-black/5 rounded-lg overflow-hidden",
              assets[selectedIndex]?.type !== "video" && "cursor-zoom-in",
            )}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            {assets[selectedIndex]?.type === "video" ? (
              <video
                src={getSrc(assets[selectedIndex].src)}
                className="w-full h-full object-cover"
                controls
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <div
                className="w-full h-full relative"
                style={{
                  transform: isZoomed ? "scale(2.2)" : "scale(1)",
                  transformOrigin: isZoomed
                    ? `${zoomPosition.x}% ${zoomPosition.y}%`
                    : "center",
                  transition: isZoomed ? "none" : "transform 0.3s ease-out",
                }}
              >
                <Image
                  src={assets[selectedIndex]?.src}
                  alt="Product Images"
                  fill
                  priority
                  placeholder="blur"
                  className="object-cover"
                />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2.5 w-full max-w-[550px] overflow-x-auto pb-2 scrollbar-thin">
            {assets.map((asset, i) => (
              <button
                key={getSrc(asset.src)}
                type="button"
                onClick={() => setSelectedIndex(i)}
                className={cn(
                  "relative border-2 transition-all overflow-hidden shrink-0 w-[97px] h-[97px] flex items-center justify-center bg-black/5",
                  selectedIndex === i
                    ? "border-highlight"
                    : "border-transparent",
                )}
              >
                {asset.type === "video" ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <video
                      src={getSrc(asset.src)}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Play className="size-5 text-white" />
                    </div>
                  </div>
                ) : (
                  <Image
                    src={asset.src}
                    alt={`Product View ${i + 1}`}
                    fill
                    sizes="97px"
                    className="object-cover"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-8">
          <h1>{product.name}</h1>
          <div className="flex items-center gap-4 text-xl">
            <p>MSRP - ${Number(product.msrp).toLocaleString()} USD</p>
            <p>
              Wholesale - $
              {product.wholesalePrice
                ? Number(product.wholesalePrice).toLocaleString()
                : "30,600"}{" "}
              USD
            </p>
          </div>
          <div className="grid grid-cols-2 py-3 border-y border-black/10">
            <div className="border-r border-black/10">
              <p className="text-muted-foreground">Item Number</p>
              <p className="text-lg">{product.itemNumber || "XBHYU-098"}</p>
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
              {["Description", "Specifications", "Details"].map((tab) => (
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
                  {product.des ||
                    "Lorem Ipsum is simply dummy text of the printing and typesetting industry."}
                </p>
              ) : activeTab === "Specifications" ? (
                <div className="space-y-1">
                  {product.specifications?.map((spec) => (
                    <p key={spec}>{spec}</p>
                  )) || (
                    <>
                      <p>Specification 1</p>
                      <p>Specification 2</p>
                    </>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-y-2 max-w-sm">
                  <p>Material</p>
                  <p className="text-gray-900">
                    {product.variant1 || "18K Yellow Gold"}
                  </p>
                  <p>Gemstone</p>
                  <p className="text-gray-900">
                    {product.variant2 || "Emerald"}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-6">
            <ShareProduct product={product} />
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() =>
                toast.success("Added to request list", {
                  position: "top-right",
                  action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                  },
                })
              }
            >
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
