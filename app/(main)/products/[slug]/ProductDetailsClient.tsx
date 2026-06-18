"use client";

import JSZip from "jszip";
import { Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import ContactUs from "@/components/layout/contact-us";
import RelatedProducts from "@/components/layout/related-products";
import ShareProduct from "@/components/layout/share-product";
import { Button } from "@/components/ui/button";
import type { Product } from "@/constants";
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

interface ProductDetailsClientProps {
  product: Product;
  allProducts: Product[];
}

export default function ProductDetailsClient({
  product,
  allProducts,
}: ProductDetailsClientProps) {
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

  const handleAddToRequestList = () => {
    try {
      const stored = localStorage.getItem("request-list");
      const list = stored ? JSON.parse(stored) : [];

      const alreadyExists = list.some((item: any) => item.id === product.id);
      if (alreadyExists) {
        toast.warning("This product is already in your request list.", {
          position: "top-right",
        });
        return;
      }

      const newItem = {
        id: product.id,
        name: product.name,
        itemNo: product.itemNumber || "",
        msrp: `$${Number(product.msrp || 0).toLocaleString()}`,
        stockStatus: "In Stock",
        image: getSrc(product.images?.[0] || product.featuredImage),
        notes: "",
      };

      const updatedList = [...list, newItem];
      localStorage.setItem("request-list", JSON.stringify(updatedList));

      toast.success("Added to request list", {
        position: "top-right",
      });
    } catch (e) {
      console.error(e);
      toast.error("Failed to add to request list");
    }
  };

  const downloadPhotos = async () => {
    const imageUrls = images
      .map((img) => getSrc(img))
      .filter((src) => typeof src === "string" && src.length > 0);

    if (imageUrls.length === 0) {
      toast.error("No photos available to download");
      return;
    }

    const toastId = toast.loading("Preparing photos download...");
    try {
      const zip = new JSZip();
      const folderName = `${product.name.replace(/[^a-zA-Z0-9-_]/g, "_")}_photos`;
      const photosFolder = zip.folder(folderName);

      if (!photosFolder) throw new Error("Failed to create zip folder");

      await Promise.all(
        imageUrls.map(async (url, idx) => {
          try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            const blob = await res.blob();

            // Get file extension or default to png
            const ext = url.split("?")[0].split(".").pop() || "png";
            const fileName = `photo_${idx + 1}.${ext}`;

            photosFolder.file(fileName, blob);
          } catch (err) {
            console.error(`Failed to download image from ${url}:`, err);
          }
        }),
      );

      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = `${folderName}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Photos downloaded successfully", { id: toastId });
    } catch (error) {
      console.error("Error zipping photos:", error);
      toast.error("Failed to download photos", { id: toastId });
    }
  };

  const downloadVideos = async () => {
    const videoUrls = videos
      .map((vid) => getSrc(vid))
      .filter((src) => typeof src === "string" && src.length > 0);

    if (videoUrls.length === 0) {
      toast.error("No videos available to download");
      return;
    }

    const toastId = toast.loading("Preparing videos download...");
    try {
      const zip = new JSZip();
      const folderName = `${product.name.replace(/[^a-zA-Z0-9-_]/g, "_")}_videos`;
      const videosFolder = zip.folder(folderName);

      if (!videosFolder) throw new Error("Failed to create zip folder");

      await Promise.all(
        videoUrls.map(async (url, idx) => {
          try {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            const blob = await res.blob();

            // Get file extension or default to mp4
            const ext = url.split("?")[0].split(".").pop() || "mp4";
            const fileName = `video_${idx + 1}.${ext}`;

            videosFolder.file(fileName, blob);
          } catch (err) {
            console.error(`Failed to download video from ${url}:`, err);
          }
        }),
      );

      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = `${folderName}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Videos downloaded successfully", { id: toastId });
    } catch (error) {
      console.error("Error zipping videos:", error);
      toast.error("Failed to download videos", { id: toastId });
    }
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
                {assets[selectedIndex]?.src && (
                  <Image
                    src={assets[selectedIndex].src}
                    alt="Product Images"
                    fill
                    priority
                    className="object-cover"
                  />
                )}
              </div>
            )}
          </div>
          <div className="w-full max-w-[280px] md:max-w-[550px] overflow-x-auto pb-2 scrollbar-thin">
            <div className="flex items-center gap-2 sm:gap-2.5 w-max mx-auto">
              {assets.map((asset, i) => (
                <button
                  key={getSrc(asset.src)}
                  type="button"
                  onClick={() => setSelectedIndex(i)}
                  className={cn(
                    "relative border-2 transition-all overflow-hidden shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-[97px] md:h-[97px] flex items-center justify-center bg-black/5",
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
                      sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 97px"
                      className="object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-8">
          <h1>{product.name}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-lg md:text-xl">
            <p>MSRP - ${Number(product.msrp).toLocaleString()} USD</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 py-3 border-y border-black/10 gap-3 md:gap-0">
            <div className="md:border-r border-black/10">
              <p className="text-muted-foreground">Item Number</p>
              <p className="text-lg break-all">
                {product.itemNumber || "XBHYU-098"}
              </p>
            </div>
            <div className="flex flex-col md:items-center">
              <p className="text-muted-foreground">Stock Status</p>
              <div className="flex items-center gap-2">
                {product.inventory !== undefined && product.inventory >= 1 ? (
                  <>
                    <span className="size-2 bg-green-600 rounded-full" />
                    <p className="text-lg text-green-600">In Stock</p>
                  </>
                ) : (
                  <>
                    <span className="size-2 bg-red-600 rounded-full" />
                    <p className="text-lg text-red-600">Out of Stock</p>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex items-center gap-5 sm:gap-8 border-b border-black/10 overflow-x-auto scrollbar-none">
              {["Description", "Specifications", "Details"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "pb-2 transition-all relative text-base sm:text-lg whitespace-nowrap",
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
            <div className="text-gray-500 text-base sm:text-lg leading-relaxed">
              {activeTab === "Description" ? (
                <p>
                  {product.des ||
                    "Lorem Ipsum is simply dummy text of the printing and typesetting industry."}
                </p>
              ) : activeTab === "Specifications" ? (
                <div className="grid grid-cols-2 gap-y-2 max-w-sm">
                  <p>Product Type</p>
                  <p className="text-gray-900">
                    {product.category || "Jewelry"}
                  </p>
                  <p>Weight</p>
                  <p className="text-gray-900">
                    {product.weight ?? 0} {product.weightUnit || "lb"}
                  </p>
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
              onClick={handleAddToRequestList}
            >
              Add to Request List
            </Button>
          </div>
          <ul className="list-disc list-inside space-y-1.5 text-gray-400 marker:text-gray-400">
            <li>
              <Link
                href=""
                className="text-base sm:text-lg md:text-xl underline underline-offset-2 hover:text-foreground"
              >
                Download Linesheet
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={downloadPhotos}
                className="text-base sm:text-lg md:text-xl underline underline-offset-2 hover:text-foreground text-left cursor-pointer bg-transparent border-0 p-0 font-normal font-sans inline text-gray-400"
              >
                Download Photos
              </button>
            </li>
            {videos.length > 0 && (
              <li>
                <button
                  type="button"
                  onClick={downloadVideos}
                  className="text-base sm:text-lg md:text-xl underline underline-offset-2 hover:text-foreground text-left cursor-pointer bg-transparent border-0 p-0 font-normal font-sans inline text-gray-400"
                >
                  Download Videos
                </button>
              </li>
            )}
            <li>
              <Link
                href=""
                className="text-base sm:text-lg md:text-xl underline underline-offset-2 hover:text-foreground"
              >
                Download diamond lab reports
              </Link>
            </li>
          </ul>
        </div>
      </section>
      <ContactUs />
      <RelatedProducts products={allProducts} />
    </main>
  );
}
