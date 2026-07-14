import ProductCard from "@/components/shared/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getShopifyCategories } from "@/services/products";

export default async function Categories() {
  const allCategories = await getShopifyCategories();

  const rawCategories = Array.isArray(allCategories) ? allCategories : [];

  const jewelryTitles = [
    "all",
    "rings",
    "ring",
    "necklaces",
    "necklace",
    "bracelets",
    "bracelet",
    "pendants",
    "pendant",
    "earrings",
    "earring",
    "others",
    "other",
  ];

  const categories = rawCategories.filter((c) => {
    const title = c.title?.toLowerCase().trim() || "";
    return jewelryTitles.includes(title);
  });

  return (
    <section className="app_container">
      <Carousel opts={{ loop: true, align: "start" }} className="space-y-15">
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
          {categories.map((category) => {
            const imageUrl =
              category.image?.url || "/placeholder-collection.jpg";
            return (
              <CarouselItem
                key={category.id}
                className="md:basis-1/2 lg:basis-1/2 space-y-4 pl-11.75"
              >
                <ProductCard
                  image={imageUrl}
                  name={category.title}
                  link={`/categories/${category.handle}`}
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
