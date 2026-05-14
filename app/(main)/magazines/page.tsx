import MagazineCard from "@/components/shared/magazine-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { magazines } from "@/constants";

const magazines2026 = magazines.slice(0, 4);
const magazines2025 = magazines.slice(4, 8);

export default function MagazinesPage() {
  return (
    <main className="app_container space-y-20 py-15">
      <h1 className="text-center font-normal tracking-wide">
        Monthly Magazines
      </h1>

      <div className="space-y-16">
        <section className="space-y-6">
          <h2 className="text-[26px] text-foreground font-medium mb-6">2026</h2>
          <Carousel opts={{ loop: true, align: "start" }}>
            <CarouselContent className="ml-[-24px]">
              {magazines2026.map((mag) => (
                <CarouselItem
                  key={mag.id}
                  className="pl-[24px] md:basis-1/2 lg:basis-1/4"
                >
                  <MagazineCard
                    image={mag.image}
                    link={mag.link}
                    imageContainerClassName="h-[414px]"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>

        <section className="space-y-6">
          <h2 className="text-[26px] text-foreground font-medium mb-6">2025</h2>
          <Carousel opts={{ loop: true, align: "start" }}>
            <CarouselContent className="ml-[-24px]">
              {magazines2025.map((mag) => (
                <CarouselItem
                  key={mag.id}
                  className="pl-[24px] md:basis-1/2 lg:basis-1/4"
                >
                  <MagazineCard
                    image={mag.image}
                    link={mag.link}
                    imageContainerClassName="h-[414px]"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>
      </div>
    </main>
  );
}
