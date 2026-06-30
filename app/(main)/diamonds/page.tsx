"use client";

import { XIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Diamond {
  id: string;
  name: string;
  link: string;
}

function DiamondDialogBody({ name, link }: { name: string; link: string }) {
  const [isLoading, setIsLoading] = useState(true);

  const getEmbedSrc = (url: string) => {
    if (url.includes("canva.com/design/")) {
      const baseUrl = url.split("?")[0];
      const parts = baseUrl.split("/");
      if (parts.length >= 6) {
        return `https://www.canva.com/design/${parts[4]}/${parts[5]}/view?embed`;
      }
    }
    return url;
  };

  return (
    <div className="flex-1 bg-white relative w-full h-full flex items-center justify-center overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 space-y-4">
          <div className="w-8 h-8 border-2 border-[#627426] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold animate-pulse">
            Loading {name}...
          </p>
        </div>
      )}

      <DialogClose asChild>
        <button
          type="button"
          className="absolute top-4 right-4 z-50 flex items-center justify-center size-9 rounded-full bg-white/95 hover:bg-white text-black shadow-lg border border-gray-100 hover:scale-105 transition-all duration-200 cursor-pointer"
        >
          <XIcon className="size-4.5" />
          <span className="sr-only">Close</span>
        </button>
      </DialogClose>

      <iframe
        src={getEmbedSrc(link)}
        onLoad={() => setIsLoading(false)}
        className="w-full h-full border-0 border-none outline-none bg-white"
        frameBorder="0"
        allowFullScreen
        allow="fullscreen"
        title={name}
      />
    </div>
  );
}

function DiamondsContent() {
  const [diamonds, setDiamonds] = useState<Diamond[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiamond, setSelectedDiamond] = useState<Diamond | null>(null);
  const searchParams = useSearchParams();

  const fetchDiamonds = async () => {
    try {
      const res = await fetch("/api/diamonds");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      const list: Diamond[] = data.data || [];
      setDiamonds(list);

      // Check URL query param on initial load
      const activeId = searchParams.get("id");
      if (activeId) {
        const diamond = list.find((d) => d.id === activeId);
        if (diamond) {
          setSelectedDiamond(diamond);
        }
      }
    } catch (error) {
      console.error("Failed to load diamonds:", error);
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: fetchDiamonds only needs to run on mount
  useEffect(() => {
    fetchDiamonds();
  }, []);

  // Sync active diamond state when searchParams change
  useEffect(() => {
    if (diamonds.length > 0) {
      const activeId = searchParams.get("id");
      if (activeId) {
        const diamond = diamonds.find((d) => d.id === activeId);
        if (diamond) {
          setSelectedDiamond(diamond);
        }
      } else {
        setSelectedDiamond(null);
      }
    }
  }, [searchParams, diamonds]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: fetchDiamonds only runs once to setup listener
  useEffect(() => {
    const handleRealtime = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail.type === "diamonds:updated") {
        fetchDiamonds();
      }
    };
    window.addEventListener("realtime-sync", handleRealtime);
    return () => {
      window.removeEventListener("realtime-sync", handleRealtime);
    };
  }, []);

  const handleOpen = (diamond: Diamond) => {
    setSelectedDiamond(diamond);
    const url = new URL(window.location.href);
    url.searchParams.set("id", diamond.id);
    window.history.replaceState(null, "", url.pathname + url.search);
  };

  const handleClose = () => {
    setSelectedDiamond(null);
    const url = new URL(window.location.href);
    url.searchParams.delete("id");
    window.history.replaceState(null, "", url.pathname + url.search);
  };

  if (loading) {
    return (
      <main className="py-20 flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[#627426] border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  if (diamonds.length === 0) {
    return (
      <main className="py-20 text-center select-none">
        <h1 className="text-center font-sans font-medium text-2xl mb-4">
          Diamond Shapes and Colors
        </h1>
        <p className="text-[#868686]">No diamond details loaded yet.</p>
      </main>
    );
  }

  const sortedDiamonds = [...diamonds].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  return (
    <main className="py-15">
      <section className="app_container space-y-15">
        <h1 className="text-center">Diamond Shapes and Colors</h1>
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-8 md:gap-12 max-w-[1200px] mx-auto mt-16">
          {sortedDiamonds.map((diamond) => (
            <div key={diamond.id}>
              {/* biome-ignore lint/a11y/useKeyWithClickEvents: click is handled on item */}
              {/* biome-ignore lint/a11y/noStaticElementInteractions: click is handled on item */}
              <div
                onClick={() => handleOpen(diamond)}
                className="flex items-start gap-3 mb-4 break-inside-avoid cursor-pointer"
              >
                <span className="size-1.5 mt-3 bg-foreground rounded-full shrink-0"></span>
                <span className="text-lg text-foreground font-medium tracking-wide hover:underline underline-offset-2">
                  {diamond.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Dialog
        open={selectedDiamond !== null}
        onOpenChange={(open) => {
          if (!open) handleClose();
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-6xl w-[95vw] h-[95vh] flex flex-col p-0 overflow-hidden"
        >
          <DialogHeader className="px-6 py-4 border-b hidden">
            <DialogTitle>{selectedDiamond?.name}</DialogTitle>
          </DialogHeader>

          {selectedDiamond && (
            <DiamondDialogBody
              name={selectedDiamond.name}
              link={selectedDiamond.link}
            />
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default function DiamondsPage() {
  return (
    <Suspense
      fallback={
        <main className="py-20 flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-2 border-[#627426] border-t-transparent rounded-full animate-spin"></div>
        </main>
      }
    >
      <DiamondsContent />
    </Suspense>
  );
}
