import Link from "next/link";
import { getGemstones } from "@/services/catalog";

export default async function GemstonesPage() {
  const gemstones = await getGemstones();

  if (gemstones.length === 0) {
    return (
      <main className="py-20 text-center select-none animate-in fade-in duration-500">
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
      const slug = gem.name.toLowerCase().replace(/\s+/g, "-");
      elements.push(
        <div key={gem.id} className="break-inside-avoid">
          <Link
            href={`/gemstones/${slug}`}
            className="flex items-start gap-3 mb-3 cursor-pointer group"
          >
            <span className="size-1.5 mt-3 bg-foreground rounded-full shrink-0 group-hover:bg-primary"></span>
            <span className="text-lg text-foreground font-medium tracking-wide hover:underline underline-offset-2 transition-colors">
              {gem.name}
            </span>
          </Link>
        </div>,
      );
    });

    return elements;
  };

  return (
    <main className="py-15 animate-in fade-in duration-500">
      <section className="app_container space-y-25">
        <h1 className="text-center">Gemstones</h1>
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-8 md:gap-12 max-w-[1200px] mx-auto">
          {renderList()}
        </div>
      </section>
    </main>
  );
}
