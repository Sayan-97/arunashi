import MagazineCard from "@/components/shared/magazine-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface Magazine {
  id: string;
  link: string;
  image?: string;
  issueNumber?: string | null;
  date: string;
}

export default async function Magazines() {
  let magazines: Magazine[] = [];
  try {
    const res = await fetch(
      `${process.env.API_URL || "http://localhost:8000"}/api/magazines`,
      { next: { revalidate: 60, tags: ["magazines"] } },
    );
    const data = await res.json();
    if (data.success) {
      // Sort strictly from latest to oldest based on the 'date' field
      magazines = data.data.sort((a: Magazine, b: Magazine) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateB - dateA; // Descending: latest first
      });
    }
  } catch (error) {
    console.error("Error fetching latest magazines:", error);
  }

  return (
    <section className="app_container">
      <Carousel opts={{ align: "start", loop: true }} className="space-y-15">
        <div className="flex items-center justify-between">
          <h1>Latest Magazines</h1>
          <div className="flex items-center gap-4">
            <CarouselPrevious
              variant="outline"
              size="icon-lg"
              className="static rounded-none translate-y-0"
            />
            <CarouselNext
              variant="outline"
              size="icon-lg"
              className="static rounded-none translate-y-0"
            />
          </div>
        </div>
        <CarouselContent className="-ml-11.75">
          {magazines.map((magazine) => {
            let resolvedImage = magazine.image;
            if (resolvedImage && !resolvedImage.startsWith("http")) {
              resolvedImage = `${process.env.API_URL || "http://localhost:8000"}${resolvedImage}`;
            }

            const dateObj = new Date(magazine.date);
            const monthName = dateObj.toLocaleString("default", {
              month: "long",
            });
            const year = dateObj.getFullYear();
            const displayTitle = `${monthName} ${year}`;

            return (
              <CarouselItem
                key={magazine.id}
                className="md:basis-1/2 lg:basis-1/3 space-y-4 pl-11.75"
              >
                <MagazineCard
                  image={resolvedImage}
                  title={displayTitle}
                  issueNumber={magazine.issueNumber}
                  link={magazine.link}
                  imageContainerClassName="aspect-[3/4] w-full h-auto"
                />
              </CarouselItem>
            );
          })}
          {magazines.length === 0 && (
            <p className="pl-11.75 text-gray-500">No magazines available.</p>
          )}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
