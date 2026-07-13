"use client";

import JSZip from "jszip";
import { Play } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import ContactUs from "@/components/layout/contact-us";
import RelatedProducts from "@/components/layout/related-products";
import ShareProduct from "@/components/layout/share-product";
import { Button } from "@/components/ui/button";
import type { Product } from "@/constants";
import { cn } from "@/lib/utils";

// Helper to resolve the source URL of an asset safely (for next/image — strips /public prefix)
const getSrc = (
  assetSrc: string | { src: string } | undefined | null,
): string => {
  if (!assetSrc) return "";
  let src = typeof assetSrc === "string" ? assetSrc : assetSrc.src || "";
  if (src.startsWith("/public") && !src.startsWith("/public/uploads")) {
    src = src.substring(7);
  }
  return src;
};

// Helper for <video> src — keeps /public prefix because the Next.js proxy
// forwards /public/uploads/... to the backend server
const getVideoSrc = (
  assetSrc: string | { src: string } | undefined | null,
): string => {
  if (!assetSrc) return "";
  return typeof assetSrc === "string" ? assetSrc : assetSrc.src || "";
};

interface ProductDetailsClientProps {
  product: Product;
  allProducts: Product[];
}

export default function ProductDetailsClient({
  product,
  allProducts,
}: ProductDetailsClientProps) {
  const searchParams = useSearchParams();
  const showMsrp = searchParams.get("showMsrp") !== "false";
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
  const [matchedGemstones, setMatchedGemstones] = useState<
    { name: string; link: string }[]
  >([]);
  const [matchedDiamonds, setMatchedDiamonds] = useState<
    { name: string; link: string }[]
  >([]);

  useEffect(() => {
    const normalizeShapeName = (name: string): string => {
      const norm = name
        .toLowerCase()
        .replace(/\b(cut|shape|shaped|diamond|diamonds)\b/g, "")
        .replace(/\s+/g, " ")
        .trim();
      return norm || "diamond";
    };

    Promise.all([
      fetch("/api/gemstones").then((res) => res.json()),
      fetch("/api/diamonds").then((res) => res.json()),
    ])
      .then(([gemsJson, diasJson]) => {
        const gemList = gemsJson.data || [];
        const matchedGems = gemList.filter((gem: any) => {
          const gemName = gem.name.toLowerCase();
          if (product.gemstoneDetails?.toLowerCase().includes(gemName)) {
            return true;
          }
          if (product.variant2?.toLowerCase().includes(gemName)) {
            return true;
          }
          if (product.name?.toLowerCase().includes(gemName)) {
            return true;
          }
          return false;
        });
        setMatchedGemstones(matchedGems);

        const diaList = diasJson.data || [];
        const matchedDias = diaList.filter((dia: any) => {
          if (!product.diamondShapeDetails) return false;
          const prodShapeNorm = normalizeShapeName(product.diamondShapeDetails);
          const targetShapeNorm = normalizeShapeName(dia.name);
          return (
            prodShapeNorm.includes(targetShapeNorm) ||
            targetShapeNorm.includes(prodShapeNorm)
          );
        });
        setMatchedDiamonds(matchedDias);
      })
      .catch((err) =>
        console.error("Error loading gemstones/diamonds for product:", err),
      );
  }, [product]);

  const relatedProducts = useMemo(() => {
    const candidates = allProducts.filter((p) => p.id !== product.id);
    const inStock = candidates.filter(
      (p) => p.inventory !== undefined && p.inventory >= 1,
    );
    const outOfStock = candidates.filter(
      (p) => p.inventory === undefined || p.inventory < 1,
    );
    const getScore = (p: Product) => {
      let score = 0;
      if (
        p.collection &&
        product.collection &&
        p.collection === product.collection
      ) {
        score += 10;
      }
      if (p.category && product.category && p.category === product.category) {
        score += 5;
      }
      if (p.variant1 && product.variant1 && p.variant1 === product.variant1) {
        score += 2;
      }
      if (p.variant2 && product.variant2 && p.variant2 === product.variant2) {
        score += 2;
      }
      return score;
    };
    const sortCandidates = (list: Product[]) => {
      return list
        .map((p) => ({ item: p, score: getScore(p) }))
        .sort((a, b) => b.score - a.score)
        .map((x) => x.item);
    };
    return [...sortCandidates(inStock), ...sortCandidates(outOfStock)].slice(
      0,
      3,
    );
  }, [product, allProducts]);

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
      const list: { id: string | number }[] = stored ? JSON.parse(stored) : [];

      const alreadyExists = list.some((item) => item.id === product.id);
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
        msrp: `$${Number(product.msrp || 0).toLocaleString("en-US")}`,
        stockStatus: "In Stock",
        image: getSrc(product.images?.[0] || product.featuredImage),
        notes: "",
      };

      const updatedList = [...list, newItem];
      localStorage.setItem("request-list", JSON.stringify(updatedList));
      window.dispatchEvent(new Event("request-list-updated"));

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

    const toastId = toast.loading("Preparing zip file...");
    try {
      const zip = new JSZip();

      const fetchPromises = imageUrls.map(async (url, idx) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const blob = await res.blob();
        const ext = url.split("?")[0].split(".").pop() || "png";

        let fileName = "";
        try {
          const urlObj = new URL(url, window.location.origin);
          const pathname = urlObj.pathname;
          const decodedPath = decodeURIComponent(pathname);
          const baseName = decodedPath.substring(
            decodedPath.lastIndexOf("/") + 1,
          );
          if (baseName?.includes(".") && !baseName.startsWith("__")) {
            fileName = baseName;
          }
        } catch {}

        if (!fileName) {
          const cleanItemNo = product.itemNumber
            ? product.itemNumber.replace(/[^a-zA-Z0-9-_]/g, "_")
            : "";
          fileName = cleanItemNo
            ? `${cleanItemNo}_${idx + 1}.${ext}`
            : `${idx + 1}.${ext}`;
        }

        zip.file(fileName, blob);
        return true;
      });

      await Promise.all(fetchPromises);
      const zipContent = await zip.generateAsync({ type: "blob" });
      const zipName = `${(product.itemNumber || product.name || "product").replace(/[^a-zA-Z0-9-_]/g, "_")}_photos.zip`;

      const blobUrl = URL.createObjectURL(zipContent);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = zipName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      toast.success("Photos downloaded successfully as ZIP", { id: toastId });
    } catch (error) {
      console.error("Error creating ZIP:", error);
      toast.error("Failed to download photos as ZIP", { id: toastId });
    }
  };

  const downloadVideos = async () => {
    const videoUrls = videos
      .map((vid) => getVideoSrc(vid))
      .filter((src) => typeof src === "string" && src.length > 0);

    if (videoUrls.length === 0) {
      toast.error("No videos available to download");
      return;
    }

    const toastId = toast.loading("Downloading videos...");
    try {
      const fetchPromises = videoUrls.map(async (url, idx) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const blob = await res.blob();
        const ext = url.split("?")[0].split(".").pop() || "mp4";

        let fileName = "";
        try {
          const urlObj = new URL(url, window.location.origin);
          const pathname = urlObj.pathname;
          const decodedPath = decodeURIComponent(pathname);
          const baseName = decodedPath.substring(
            decodedPath.lastIndexOf("/") + 1,
          );
          if (baseName?.includes(".") && !baseName.startsWith("__")) {
            fileName = baseName;
          }
        } catch {}

        if (!fileName) {
          const cleanItemNo = product.itemNumber
            ? product.itemNumber.replace(/[^a-zA-Z0-9-_]/g, "_")
            : "";
          fileName = cleanItemNo
            ? `${cleanItemNo}_video_${idx + 1}.${ext}`
            : `video_${idx + 1}.${ext}`;
        }

        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = blobUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(blobUrl);
        return true;
      });
      const results = await Promise.allSettled(fetchPromises);
      const successCount = results.filter(
        (r) => r.status === "fulfilled",
      ).length;
      if (successCount > 0) {
        toast.success(`Downloaded ${successCount} video(s) successfully`, {
          id: toastId,
        });
      } else {
        toast.error("Failed to download videos", { id: toastId });
      }
    } catch (error) {
      console.error("Error downloading videos:", error);
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
                src={getVideoSrc(assets[selectedIndex].src)}
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
                        src={getVideoSrc(asset.src)}
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
          {showMsrp && (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-lg md:text-xl text-[#3a3a3a]">
              <p>
                Retail Price - $
                {Number(
                  String(product.msrp).replace(/[$,]/g, ""),
                ).toLocaleString("en-US")}{" "}
                USD
              </p>
            </div>
          )}
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
              {["Description", "Details & Specifications", "Jewelry Card"].map(
                (tab) => (
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
                ),
              )}
            </div>
            <div className="text-gray-500 text-base sm:text-lg leading-relaxed">
              {activeTab === "Description" ? (
                <p>
                  {product.des ||
                    "Lorem Ipsum is simply dummy text of the printing and typesetting industry."}
                </p>
              ) : activeTab === "Details & Specifications" ? (
                <div className="space-y-6">
                  {(product.variant1 || product.variant2) && (
                    <div className="grid grid-cols-2 gap-y-2 max-w-sm border-b border-black/5 pb-4">
                      {product.variant1 && (
                        <>
                          <p className="text-gray-400">Material</p>
                          <p className="text-gray-900 font-medium">
                            {product.variant1}
                          </p>
                        </>
                      )}
                      {product.variant2 && (
                        <>
                          <p className="text-gray-400">Gemstone</p>
                          <p className="text-gray-900 font-medium">
                            {product.variant2}
                          </p>
                        </>
                      )}
                    </div>
                  )}
                  {product.gemstoneDetails ? (
                    <p className="whitespace-pre-line text-gray-700 leading-relaxed">
                      {product.gemstoneDetails}
                    </p>
                  ) : (
                    <p className="text-gray-400">
                      No specifications available.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.print()}
                      className="border-primary text-foreground hover:bg-primary/5 cursor-pointer"
                    >
                      Print / Save as PDF
                    </Button>
                  </div>

                  {/* Jewelry Card Preview */}
                  <div
                    id="jewelry-card-print-area"
                    className="bg-white border border-black/10 p-8 max-w-xl mx-auto rounded-lg shadow-sm font-sans text-black"
                  >
                    {/* Print CSS Inject */}
                    <style>{`
                      @media print {
                        body * {
                          visibility: hidden !important;
                        }
                        #jewelry-card-print-area, #jewelry-card-print-area * {
                          visibility: visible !important;
                        }
                        #jewelry-card-print-area {
                          position: absolute !important;
                          left: 0 !important;
                          top: 0 !important;
                          width: 100% !important;
                          background: white !important;
                          color: black !important;
                          padding: 20px !important;
                          box-shadow: none !important;
                          border: none !important;
                        }
                      }
                    `}</style>

                    {/* Header */}
                    <div className="text-center border-b border-black/5 pb-4 mb-6">
                      <h2 className="font-fleur text-3xl uppercase tracking-widest text-[#45521a]">
                        Arunashi
                      </h2>
                      <p className="text-[10px] text-gray-400 tracking-widest uppercase mt-1">
                        Beverly Hills
                      </p>
                    </div>

                    {/* Image */}
                    <div className="relative w-full h-[260px] bg-white flex items-center justify-center mb-6">
                      {assets[0]?.src && (
                        <Image
                          src={assets[0].src}
                          alt={product.name}
                          fill
                          priority
                          className="object-contain"
                        />
                      )}
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-baseline border-b border-black/5 pb-2">
                        <h3 className="text-xl font-medium text-gray-900 leading-tight">
                          {product.name}
                        </h3>
                        <p className="text-lg font-semibold text-gray-900 shrink-0">
                          $
                          {Number(
                            String(product.msrp).replace(/[$,]/g, ""),
                          ).toLocaleString("en-US")}{" "}
                          USD
                        </p>
                      </div>

                      {product.itemNumber && (
                        <p className="text-xs text-gray-400">
                          Item Number: {product.itemNumber}
                        </p>
                      )}

                      <div className="text-sm text-gray-600 leading-relaxed font-light">
                        {product.des || "No description available."}
                      </div>

                      {/* Details & Specs */}
                      <div className="bg-[#fcfcfc] p-4 border border-black/5 rounded text-xs space-y-2">
                        {product.variant1 && (
                          <div className="grid grid-cols-3">
                            <span className="text-gray-400">Material:</span>
                            <span className="col-span-2 font-medium text-gray-800">
                              {product.variant1}
                            </span>
                          </div>
                        )}
                        {product.variant2 && (
                          <div className="grid grid-cols-3">
                            <span className="text-gray-400">Gemstone:</span>
                            <span className="col-span-2 font-medium text-gray-800">
                              {product.variant2}
                            </span>
                          </div>
                        )}
                        {product.gemstoneDetails && (
                          <div className="grid grid-cols-3 pt-1 border-t border-black/5">
                            <span className="text-gray-400">Details:</span>
                            <span className="col-span-2 font-light text-gray-600 whitespace-pre-line leading-relaxed">
                              {product.gemstoneDetails}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer / Website Link */}
                    <div className="text-center pt-6 mt-8 border-t border-black/5 text-[11px] text-gray-400 font-light">
                      <p>For inquiries, contact sales@arunashi.com</p>
                      <a
                        href={`https://arunashi.com/products/${product.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#45521a] hover:underline font-medium block mt-1 tracking-wider"
                      >
                        www.arunashi.com
                      </a>
                    </div>
                  </div>
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
            {product.linesheetLink && (
              <li>
                <a
                  href={`/api/download?url=${encodeURIComponent(product.linesheetLink)}`}
                  download
                  className="text-base sm:text-lg md:text-xl underline underline-offset-2 hover:text-foreground cursor-pointer"
                >
                  Download linesheet
                </a>
              </li>
            )}
            {matchedGemstones.map((gem) => (
              <li key={gem.name}>
                <a
                  href={`/api/download?url=${encodeURIComponent(gem.link)}`}
                  download
                  className="text-base sm:text-lg md:text-xl underline underline-offset-2 hover:text-foreground cursor-pointer"
                >
                  Download Gemstone Linesheet ({gem.name})
                </a>
              </li>
            ))}
            {matchedDiamonds.map((dia) => (
              <li key={dia.name}>
                <a
                  href={`/api/download?url=${encodeURIComponent(dia.link)}`}
                  download
                  className="text-base sm:text-lg md:text-xl underline underline-offset-2 hover:text-foreground cursor-pointer"
                >
                  Download Shapes & Colors Linesheet ({dia.name})
                </a>
              </li>
            ))}
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
            {product.certificatesLink && (
              <li>
                <a
                  href={`/api/download?url=${encodeURIComponent(product.certificatesLink)}`}
                  download
                  className="text-base sm:text-lg md:text-xl underline underline-offset-2 hover:text-foreground cursor-pointer"
                >
                  Download Lab Reports
                </a>
              </li>
            )}
          </ul>
        </div>
      </section>
      <RelatedProducts products={relatedProducts} />
      <ContactUs />
    </main>
  );
}
