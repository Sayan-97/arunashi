import Link from "next/link";
import ProductCard from "@/components/shared/product-card";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { categories, products } from "@/constants";

export default function Categories() {
  return (
    <section className="app_container">
      <Carousel opts={{ loop: true }} className="space-y-15">
        <div className="flex items-center justify-between">
          <h1>Browse by categories</h1>
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
          {categories.map((category) => (
            <CarouselItem
              key={category.id}
              className="md:basis-1/2 lg:basis-1/3 space-y-4 pl-11.75"
            >
              <ProductCard
                image={category.image}
                name={category.name}
                link={`/categories/${category.name.replaceAll(" ", "-").toLowerCase()}`}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
