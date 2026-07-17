import Link from "next/link";
import { getDiamonds } from "@/services/catalog";

export default async function DiamondsPage() {
  const diamonds = await getDiamonds();

  if (diamonds.length === 0) {
    return (
      <main className="py-20 text-center select-none animate-in fade-in duration-500">
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
    <main className="py-15 animate-in fade-in duration-500">
      <section className="app_container space-y-15">
        <h1 className="text-center">Diamond Shapes and Colors</h1>
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-8 md:gap-12 max-w-[1200px] mx-auto mt-16">
          {sortedDiamonds.map((diamond) => {
            const slug = diamond.name.toLowerCase().replace(/\s+/g, "-");
            return (
              <div key={diamond.id} className="break-inside-avoid">
                <Link
                  href={`/diamonds/${slug}`}
                  className="flex items-start gap-3 mb-4 cursor-pointer group"
                >
                  <span className="size-1.5 mt-3 bg-foreground rounded-full shrink-0 group-hover:bg-primary"></span>
                  <span className="text-lg text-foreground font-medium tracking-wide hover:underline underline-offset-2 transition-colors">
                    {diamond.name}
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
