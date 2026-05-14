import { diamonds } from "@/constants";

export default function DiamondsPage() {
  const sortedDiamonds = [...diamonds].sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  return (
    <main className="py-15">
      <section className="app_container space-y-15">
        <h1 className="text-center">Diamond Shapes and Colors</h1>
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-8 md:gap-12 max-w-[1200px] mx-auto mt-16">
          {sortedDiamonds.map((diamond) => (
            <div
              key={diamond.name}
              className="flex items-start gap-3 mb-4 break-inside-avoid"
            >
              <span className="size-1.5 mt-3 bg-foreground rounded-full shrink-0"></span>
              <span className="text-lg text-foreground font-medium tracking-wide">
                {diamond.name}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
