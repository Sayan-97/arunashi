import type React from "react";
import { gemstones } from "@/constants";

export default function GemstonesPage() {
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
            className="text-[40px] text-primary font-light mt-12 mb-5 break-after-avoid first:mt-0 leading-none"
          >
            {letter}
          </h2>,
        );
      }
      elements.push(
        <div
          key={gem.name}
          className="flex items-start gap-3 mb-3 break-inside-avoid"
        >
          <span className="size-1.5 mt-3 bg-foreground rounded-full shrink-0"></span>
          <span className="text-lg text-foreground font-medium tracking-wide">
            {gem.name}
          </span>
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
    </main>
  );
}
