import { Download, Link2, Mail } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Product } from "@/constants";
import { cn } from "@/lib/utils";

export default function ShareProduct({ product }: { product: Product }) {
  const [showMsrp, setShowMsrp] = useState(true);
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [emailRecipient, setEmailRecipient] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  // New state variables for the client/sales team sharing form
  const [showClientSalesEmailInput, setShowClientSalesEmailInput] =
    useState(false);
  const [clientSalesEmailRecipient, setClientSalesEmailRecipient] =
    useState("");
  const [sendingClientSalesEmail, setSendingClientSalesEmail] = useState(false);

  const getSrc = (
    assetSrc: string | { src: string } | undefined | null,
  ): string => {
    if (!assetSrc) return "";
    let src =
      typeof assetSrc === "string" ? assetSrc : (assetSrc as any).src || "";
    if (src.startsWith("/public") && !src.startsWith("/public/uploads")) {
      src = src.substring(7);
    }
    return src;
  };

  // Videos keep /public prefix — the proxy forwards /public/uploads to the server
  const getVideoSrc = (
    assetSrc: string | { src: string } | undefined | null,
  ): string => {
    if (!assetSrc) return "";
    return typeof assetSrc === "string"
      ? assetSrc
      : (assetSrc as any).src || "";
  };

  const handleCopyLink = () => {
    const url = new URL(window.location.href);
    if (showMsrp) {
      url.searchParams.delete("showMsrp");
    } else {
      url.searchParams.set("showMsrp", "false");
    }
    navigator.clipboard.writeText(url.toString()).then(() => {
      toast.success("Link copied");
    });
  };

  const handleDownloadAll = async () => {
    const images =
      product.images || (product.featuredImage ? [product.featuredImage] : []);
    const videos = product.videos || [];
    const imageUrls = images
      .map(getSrc)
      .filter((src) => typeof src === "string" && src.length > 0);
    const videoUrls = videos
      .map(getVideoSrc)
      .filter((src) => typeof src === "string" && src.length > 0);
    const allUrls = [...imageUrls, ...videoUrls];

    if (allUrls.length === 0) {
      toast.error("No media available to download");
      return;
    }

    const toastId = toast.loading("Downloading photos & videos...");
    try {
      const fetchPromises = allUrls.map(async (url, idx) => {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const blob = await res.blob();

        const isVideo =
          url.toLowerCase().includes(".mp4") ||
          url.toLowerCase().includes(".mov") ||
          url.toLowerCase().includes(".webm");
        const defaultExt = isVideo ? "mp4" : "png";
        const ext = url.split("?")[0].split(".").pop() || defaultExt;

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
        toast.success(`Downloaded ${successCount} file(s) successfully`, {
          id: toastId,
        });
      } else {
        toast.error("Failed to download media", { id: toastId });
      }
    } catch (error) {
      console.error("Error downloading media:", error);
      toast.error("Failed to download media", { id: toastId });
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailRecipient.trim()) {
      toast.error("Please enter a recipient email address.");
      return;
    }

    setSendingEmail(true);
    const shareUrl = new URL(window.location.href);
    if (!showMsrp) {
      shareUrl.searchParams.set("showMsrp", "false");
    } else {
      shareUrl.searchParams.delete("showMsrp");
    }

    const firstImage = product.images?.[0] || product.featuredImage;
    let imageUrl = "";
    if (firstImage) {
      const src = getSrc(firstImage);
      if (src.startsWith("http://") || src.startsWith("https://")) {
        imageUrl = src;
      } else if (src.startsWith("//")) {
        imageUrl = `https:${src}`;
      } else {
        imageUrl =
          window.location.origin + (src.startsWith("/") ? src : `/${src}`);
      }
    }

    try {
      const response = await fetch("/api/email/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: emailRecipient.trim(),
          showMsrp,
          product: {
            name: product.name,
            collection: product.collection || "All",
            des: product.des || "",
            msrp: product.msrp,
            itemNumber: product.itemNumber || "",
            imageUrl,
            shareUrl: shareUrl.toString(),
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      toast.success("Email sent successfully");
      setEmailRecipient("");
      setShowEmailInput(false);
    } catch (error) {
      console.error("Error sharing product via email:", error);
      toast.error("Failed to send email. Please try again.");
    } finally {
      setSendingEmail(false);
    }
  };

  // Handles sending the email link to the client/sales team
  const handleSendClientSalesEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientSalesEmailRecipient.trim()) {
      toast.error("Please enter a recipient email address.");
      return;
    }

    setSendingClientSalesEmail(true);
    // Absolute link of the current retailer portal product page
    const shareUrl = window.location.origin + "/products/" + product.id;

    const firstImage = product.images?.[0] || product.featuredImage;
    let imageUrl = "";
    if (firstImage) {
      const src = getSrc(firstImage);
      if (src.startsWith("http://") || src.startsWith("https://")) {
        imageUrl = src;
      } else if (src.startsWith("//")) {
        imageUrl = `https:${src}`;
      } else {
        imageUrl =
          window.location.origin + (src.startsWith("/") ? src : `/${src}`);
      }
    }

    try {
      const response = await fetch("/api/email/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: clientSalesEmailRecipient.trim(),
          showMsrp,
          subject: `Shared with Client / Sales Team: ${product.name}`,
          product: {
            name: product.name,
            collection: product.collection || "All",
            des: product.des || "",
            msrp: product.msrp,
            itemNumber: product.itemNumber || "",
            imageUrl,
            shareUrl,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email");
      }

      toast.success("Link shared successfully");
      setClientSalesEmailRecipient("");
      setShowClientSalesEmailInput(false);
    } catch (error) {
      console.error("Error sharing product with client/sales team:", error);
      toast.error("Failed to send email. Please try again.");
    } finally {
      setSendingClientSalesEmail(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="lg" className="w-full">
          Share with Client / Sales Team
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full p-8 md:p-12 flex flex-col gap-10 overflow-y-auto">
        <SheetHeader className="hidden">
          <SheetTitle></SheetTitle>
        </SheetHeader>
        <h1>Share Product</h1>

        <div className="border border-black/10 p-5 flex flex-col sm:flex-row gap-6 md:gap-8">
          <div className="bg-[#f6f6f6] w-[220px] h-[233px] shrink-0 relative flex items-center justify-center mx-auto sm:mx-0">
            <Image
              src={
                product.images
                  ? product.images[0]
                  : (product.featuredImage as import("next/image").StaticImageData)
              }
              alt="Product Image"
              fill
              className="object-contain p-4"
            />
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <div>
              <h3 className="text-[22px] md:text-[26px] font-medium text-foreground leading-snug">
                {product.name}
              </h3>
              <p className="text-primary text-[14px] md:text-[15px] mt-1">
                {product.collection}
              </p>
            </div>
            <p className="text-[#8e8e8e] text-[13px] md:text-[14px] leading-relaxed">
              {product.des || "No description available for this product."}
            </p>
            <div className="flex items-center gap-6 pt-2">
              <button
                type="button"
                className="flex items-center gap-3 cursor-pointer bg-transparent border-0 p-0 font-sans"
                onClick={() => setShowMsrp(true)}
              >
                <div
                  className={cn(
                    "w-[18px] h-[18px] border transition-all flex items-center justify-center rounded-[3px]",
                    showMsrp
                      ? "border-[#627426] bg-[#627426] text-white"
                      : "border-gray-300 bg-white",
                  )}
                >
                  {showMsrp && (
                    <span className="text-[10px] leading-none">✓</span>
                  )}
                </div>
                <span className="text-[13px] md:text-[14px] font-medium text-foreground select-none">
                  With Price
                </span>
              </button>
              <button
                type="button"
                className="flex items-center gap-3 cursor-pointer bg-transparent border-0 p-0 font-sans"
                onClick={() => setShowMsrp(false)}
              >
                <div
                  className={cn(
                    "w-[18px] h-[18px] border transition-all flex items-center justify-center rounded-[3px]",
                    !showMsrp
                      ? "border-[#627426] bg-[#627426] text-white"
                      : "border-gray-300 bg-white",
                  )}
                >
                  {!showMsrp && (
                    <span className="text-[10px] leading-none">✓</span>
                  )}
                </div>
                <span className="text-[13px] md:text-[14px] font-medium text-foreground select-none">
                  Without Price
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <h4 className="text-lg font-medium text-foreground">Share Via</h4>
          <div className="space-y-4">
            {/* Share with Client / Sales Team button at the very top */}
            <div className="space-y-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() =>
                  setShowClientSalesEmailInput(!showClientSalesEmailInput)
                }
                className="w-full flex items-center justify-center gap-3 font-normal border-primary text-foreground hover:bg-primary/5"
              >
                <Mail strokeWidth={1.5} className="w-5 h-5" />
                Share with Client / Sales Team
              </Button>

              {showClientSalesEmailInput && (
                <form
                  onSubmit={handleSendClientSalesEmail}
                  className="space-y-3 p-4 border border-black/10 rounded-lg bg-gray-50/50 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <div className="space-y-1">
                    <label
                      htmlFor="client-sales-email"
                      className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      Client / Sales Team Email
                    </label>
                    <input
                      id="client-sales-email"
                      type="email"
                      required
                      placeholder="e.g. sales@example.com"
                      value={clientSalesEmailRecipient}
                      onChange={(e) =>
                        setClientSalesEmailRecipient(e.target.value)
                      }
                      className="w-full border border-black/10 px-4 py-3 rounded text-[14px] focus:outline-none focus:border-[#627426] transition-all bg-white"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={sendingClientSalesEmail}
                    className="w-full bg-[#627426] text-white py-3 rounded text-[14px] font-medium hover:bg-[#627426]/90 transition-all flex items-center justify-center gap-2"
                  >
                    {sendingClientSalesEmail ? (
                      <>
                        <span className="animate-spin border-2 border-white border-t-transparent rounded-full size-4" />
                        Sharing...
                      </>
                    ) : (
                      "Share Link"
                    )}
                  </Button>
                </form>
              )}
            </div>

            <Button
              variant="outline"
              size="lg"
              onClick={handleCopyLink}
              className="w-full flex items-center justify-center gap-3 font-normal border-primary text-foreground hover:bg-primary/5"
            >
              <Link2 strokeWidth={1.5} className="w-5 h-5" />
              Copy share link
            </Button>

            <div className="space-y-3">
              <Button
                variant="outline"
                size="lg"
                onClick={() => setShowEmailInput(!showEmailInput)}
                className="w-full flex items-center justify-center gap-3 font-normal border-primary text-foreground hover:bg-primary/5"
              >
                <Mail strokeWidth={1.5} className="w-5 h-5" />
                Send via Email
              </Button>

              {showEmailInput && (
                <form
                  onSubmit={handleSendEmail}
                  className="space-y-3 p-4 border border-black/10 rounded-lg bg-gray-50/50 animate-in fade-in slide-in-from-top-2 duration-200"
                >
                  <div className="space-y-1">
                    <label
                      htmlFor="share-email"
                      className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
                    >
                      Recipient Email
                    </label>
                    <input
                      id="share-email"
                      type="email"
                      required
                      placeholder="e.g. client@example.com"
                      value={emailRecipient}
                      onChange={(e) => setEmailRecipient(e.target.value)}
                      className="w-full border border-black/10 px-4 py-3 rounded text-[14px] focus:outline-none focus:border-[#627426] transition-all bg-white"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={sendingEmail}
                    className="w-full bg-[#627426] text-white py-3 rounded text-[14px] font-medium hover:bg-[#627426]/90 transition-all flex items-center justify-center gap-2"
                  >
                    {sendingEmail ? (
                      <>
                        <span className="animate-spin border-2 border-white border-t-transparent rounded-full size-4" />
                        Sending...
                      </>
                    ) : (
                      "Send Share Email"
                    )}
                  </Button>
                </form>
              )}
            </div>

            <Button
              variant="outline"
              size="lg"
              onClick={handleDownloadAll}
              className="w-full flex items-center justify-center gap-3 font-normal border-primary text-foreground hover:bg-primary/5"
            >
              <Download strokeWidth={1.5} className="w-5 h-5" />
              Download photos / videos
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
