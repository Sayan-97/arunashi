"use client";

import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { banners } from "@/constants";

export default function Banners() {
  return (
    <section>
      <Carousel
        opts={{ loop: true }}
        plugins={[
          Autoplay({
            delay: 4500,
            stopOnInteraction: false,
          }),
        ]}
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id}>
              <div className="relative w-full h-[381px]">
                <Image
                  src={banner.image}
                  alt={`Banner Image`}
                  fill
                  priority
                  placeholder="blur"
                  sizes="100vw"
                  className="object-cover object-top-left -z-10"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
