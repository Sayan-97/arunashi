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

interface Gemstone {
  id: string;
  name: string;
  link: string;
}

function GemstoneDialogBody({ name, link }: { name: string; link: string }) {
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

function GemstonesContent() {
  const [gemstones, setGemstones] = useState<Gemstone[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGemstone, setSelectedGemstone] = useState<Gemstone | null>(
    null,
  );
  const searchParams = useSearchParams();

  const fetchGemstones = async () => {
    try {
      const res = await fetch("/api/gemstones");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      const list: Gemstone[] = data.data || [];
      setGemstones(list);

      // Check URL query param on initial load
      const activeId = searchParams.get("id");
      if (activeId) {
        const gem = list.find((g) => g.id === activeId);
        if (gem) {
          setSelectedGemstone(gem);
        }
      }
    } catch (error) {
      console.error("Failed to load gemstones:", error);
    } finally {
      setLoading(false);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: fetchGemstones only needs to run on mount
  useEffect(() => {
    fetchGemstones();
  }, []);

  // Sync active gemstone state when searchParams change
  useEffect(() => {
    if (gemstones.length > 0) {
      const activeId = searchParams.get("id");
      if (activeId) {
        const gem = gemstones.find((g) => g.id === activeId);
        if (gem) {
          setSelectedGemstone(gem);
        }
      } else {
        setSelectedGemstone(null);
      }
    }
  }, [searchParams, gemstones]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: fetchGemstones only runs once to setup listener
  useEffect(() => {
    const handleRealtime = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail.type === "gemstones:updated") {
        fetchGemstones();
      }
    };
    window.addEventListener("realtime-sync", handleRealtime);
    return () => {
      window.removeEventListener("realtime-sync", handleRealtime);
    };
  }, []);

  const handleOpen = (gem: Gemstone) => {
    setSelectedGemstone(gem);
    const url = new URL(window.location.href);
    url.searchParams.set("id", gem.id);
    window.history.replaceState(null, "", url.pathname + url.search);
  };

  const handleClose = () => {
    setSelectedGemstone(null);
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

  if (gemstones.length === 0) {
    return (
      <main className="py-20 text-center select-none">
        <h1 className="text-center font-sans font-medium text-2xl mb-4">
          Gemstones
        </h1>
        <p className="text-[#868686]">No gemstone details loaded yet.</p>
      </main>
    );
  }

  const sortedGemstones = [...gemstones].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  const renderList = () => {
    const elements: React.ReactNode[] = [];
    let currentLetter = "";

    sortedGemstones.forEach((gem) => {
      const letter = gem.name[0].toUpperCase();
      if (letter !== currentLetter) {
        currentLetter = letter;
        elements.push(
          <h2
            key={`letter-${letter}`}
            className="text-[40px] text-primary font-light mt-12 mb-5 break-after-avoid first:mt-0 leading-none select-none"
          >
            {letter}
          </h2>,
        );
      }
      elements.push(
        <div key={gem.id} className="break-inside-avoid">
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: click is handled on item */}
          {/* biome-ignore lint/a11y/noStaticElementInteractions: click is handled on item */}
          <div
            onClick={() => handleOpen(gem)}
            className="flex items-start gap-3 mb-3 cursor-pointer group"
          >
            <span className="size-1.5 mt-3 bg-foreground rounded-full shrink-0 group-hover:bg-primary"></span>
            <span className="text-lg text-foreground font-medium tracking-wide hover:underline underline-offset-2">
              {gem.name}
            </span>
          </div>
        </div>,
      );
    });

    return elements;
  };

  return (
    <main className="py-15">
      <section className="app_container space-y-25">
        <h1 className="text-center">Gemstones</h1>
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-8 md:gap-12 max-w-[1200px] mx-auto">
          {renderList()}
        </div>
      </section>

      <Dialog
        open={selectedGemstone !== null}
        onOpenChange={(open) => {
          if (!open) handleClose();
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-6xl w-[95vw] h-[95vh] flex flex-col p-0 overflow-hidden"
        >
          <DialogHeader className="px-6 py-4 border-b hidden">
            <DialogTitle>{selectedGemstone?.name}</DialogTitle>
          </DialogHeader>

          {selectedGemstone && (
            <GemstoneDialogBody
              name={selectedGemstone.name}
              link={selectedGemstone.link}
            />
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default function GemstonesPage() {
  return (
    <Suspense
      fallback={
        <main className="py-20 flex items-center justify-center min-h-[400px]">
          <div className="w-8 h-8 border-2 border-[#627426] border-t-transparent rounded-full animate-spin"></div>
        </main>
      }
    >
      <GemstonesContent />
    </Suspense>
  );
}
