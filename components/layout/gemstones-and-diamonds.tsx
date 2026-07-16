import ProductCard from "@/components/shared/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getBrowseItems } from "@/lib/catalog-match";
import { getDiamonds, getGemstones } from "@/services/catalog";
import { getShopifyProducts } from "@/services/products";

export default async function GemstonesAndDiamonds() {
  const [products, gemstones, diamonds] = await Promise.all([
    getShopifyProducts(),
    getGemstones(),
    getDiamonds(),
  ]);
  const items = getBrowseItems(products, gemstones, diamonds);

  return (
    <section className="app_container">
      <Carousel opts={{ loop: true }} className="space-y-15">
        {/* Header Row: Title on the left, navigation buttons on the right */}
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

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center select-none w-full border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">
              No gemstones or diamond shapes match any active products.
            </p>
          </div>
        ) : (
          <CarouselContent className="-ml-11.75">
            {items.map((item) => (
              <CarouselItem
                key={item.id}
                className="md:basis-1/2 lg:basis-1/3 space-y-4 pl-11.75"
              >
                <ProductCard
                  image={item.image}
                  hoverImage={item.hoverImage}
                  name={item.name}
                  link={item.link}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        )}
      </Carousel>
    </section>
  );
}
