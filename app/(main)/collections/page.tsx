import ProductCard from "@/components/shared/product-card";
import { getShopifyCollections } from "@/services/products";

export default async function CollectionsPage() {
  const allCollections = await getShopifyCollections();

  const collections = allCollections.filter((c) => {
    const title = c.title.toLowerCase().trim();
    return (
      title.endsWith("collection") ||
      title.endsWith("collections") ||
      title === "collectible art"
    );
  });

  return (
    <main className="py-15">
      <section className="app_container flex flex-wrap justify-center gap-x-11.75 gap-y-15">
        {collections.map((collection) => {
          const imageUrl =
            collection.image?.url || "/placeholder-collection.jpg";
          return (
            <div
              key={collection.id}
              className="w-full md:w-[calc((100%-47px)/2)] lg:w-[calc((100%-94px)/3)]"
            >
              <ProductCard
                image={imageUrl}
                name={collection.title}
                link={`/collections/${collection.handle}`}
              />
            </div>
          );
        })}
      </section>
    </main>
  );
}
