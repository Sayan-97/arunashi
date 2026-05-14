import ProductCard from "@/components/shared/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { collections } from "@/constants";

export default function Collections() {
  return (
    <section className="app_container space-y-15">
      <h1>Browse by collections</h1>
      <Carousel opts={{ loop: true }}>
        <CarouselContent className="-ml-11.75">
          {collections.map((collection) => (
            <CarouselItem
              key={collection.id}
              className="md:basis-1/2 lg:basis-1/3 space-y-4 pl-11.75"
            >
              <ProductCard
                image={collection.image}
                name={collection.name}
                link={`/collections/${collection.id}`}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
