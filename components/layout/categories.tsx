import ProductCard from "@/components/shared/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { products } from "@/constants";

export default function Categories() {
  return (
    <section className="app_container space-y-15">
      <h1>Browse by categories</h1>
      <Carousel opts={{ loop: true }}>
        <CarouselContent className="-ml-11.75">
          {products.slice(0, 4).map((product) => (
            <CarouselItem
              key={product.id}
              className="md:basis-1/2 lg:basis-1/3 space-y-4 pl-11.75"
            >
              <ProductCard
                image={product.image}
                name="Category Name"
                link="/products"
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
