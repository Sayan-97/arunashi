import MagazineCard from "@/components/shared/magazine-card";

interface Magazine {
  id: string;
  link: string;
  image?: string;
  issueNumber?: string | null;
  date: string;
}

export default async function MagazinesPage() {
  let magazines: Magazine[] = [];
  try {
    const res = await fetch(
      `${process.env.API_URL || "http://localhost:8000"}/api/magazines`,
      { cache: "no-store" },
    );
    const data = await res.json();
    if (data.success) {
      magazines = data.data;
    }
  } catch (error) {
    console.error("Error fetching magazines:", error);
  }

  // Group by year
  const grouped = magazines.reduce(
    (acc, mag) => {
      const y = new Date(mag.date).getFullYear().toString();
      if (!acc[y]) acc[y] = [];
      acc[y].push(mag);
      return acc;
    },
    {} as Record<string, Magazine[]>,
  );

  const sortedYears = Object.keys(grouped).sort(
    (a, b) => Number(b) - Number(a),
  );

  return (
    <main className="app_container space-y-20 py-15">
      <h1 className="text-center font-normal tracking-wide">
        Monthly Magazines
      </h1>

      <div className="space-y-16">
        {sortedYears.length > 0 ? (
          sortedYears.map((year) => (
            <section key={year} className="space-y-6">
              <h2 className="text-[26px] text-foreground font-medium mb-6">
                {year}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {grouped[year]
                  .sort((a, b) => {
                    const dateA = new Date(a.date).getTime();
                    const dateB = new Date(b.date).getTime();
                    return dateB - dateA; // Descending: latest first
                  })
                  .map((mag) => {
                    let resolvedImage = mag.image;
                    if (resolvedImage && !resolvedImage.startsWith("http")) {
                      resolvedImage = `${process.env.API_URL || "http://localhost:8000"}${resolvedImage}`;
                    }

                    const monthName = new Date(mag.date).toLocaleString(
                      "default",
                      { month: "long" },
                    );
                    const displayTitle = mag.issueNumber
                      ? `${monthName} ${year} - ${mag.issueNumber}`
                      : `${monthName} ${year}`;

                    return (
                      <MagazineCard
                        key={mag.id}
                        link={mag.link}
                        title={displayTitle}
                        image={resolvedImage}
                        imageContainerClassName="aspect-[3/4] w-full h-auto"
                      />
                    );
                  })}
              </div>
            </section>
          ))
        ) : (
          <p className="text-center text-gray-500">
            No magazines available at the moment.
          </p>
        )}
      </div>
    </main>
  );
}
