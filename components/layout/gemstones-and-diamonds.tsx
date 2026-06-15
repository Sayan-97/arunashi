import ProductCard from "@/components/shared/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Product } from "@/constants";

interface GemstonesAndDiamondsProps {
  products?: Product[];
}

export default function GemstonesAndDiamonds({
  products,
}: GemstonesAndDiamondsProps) {
  const displayProducts = products || [];

  return (
    <section className="app_container">
      <Carousel opts={{ loop: true }} className="space-y-15">
        <div className="flex items-center justify-between">
          <h1>Browse by gemstones and diamond shapes</h1>
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
          {displayProducts.map((product) => (
            <CarouselItem
              key={product.id}
              className="md:basis-1/2 lg:basis-1/3 space-y-4 pl-11.75"
            >
              <ProductCard
                image={
                  product.images
                    ? product.images[0]
                    : (product.featuredImage as import("next/image").StaticImageData)
                }
                hoverImage={product.images ? product.images[1] : undefined}
                name={product.name}
                link={`/products/${product.id}`}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
