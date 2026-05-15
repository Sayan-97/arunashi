"use client";

import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { banners } from "@/constants";
import { Button } from "../ui/button";

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
              <div className="relative flex items-center justify-start w-full h-[381px]">
                <Image
                  src={banner.image}
                  alt={`Banner Image`}
                  fill
                  priority
                  placeholder="blur"
                  sizes="100vw"
                  className="object-cover object-top-left -z-10"
                />
                <div className="app_container">
                  <div className="space-y-6">
                    <h1 className="max-w-lg text-white">
                      Explore Enigma Collection
                    </h1>
                    <Link href="/collections/8">
                      <Button size="lg">View Collection</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
