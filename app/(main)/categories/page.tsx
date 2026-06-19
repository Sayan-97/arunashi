import ProductCard from "@/components/shared/product-card";
import { getShopifyCollections } from "@/services/products";

export default async function CategoriesPage() {
  const allCollections = await getShopifyCollections();

  const collectionsList = Array.isArray(allCollections) ? allCollections : [];

  const categories = collectionsList.filter((c) => {
    const title = c.title?.toLowerCase().trim() || "";
    return !(
      title.endsWith("collection") ||
      title.endsWith("collections") ||
      title === "collectible art"
    );
  });

  return (
    <main className="app_container space-y-15 py-15">
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-11.75 gap-y-15">
        {categories.map((category) => {
          const imageUrl = category.image?.url || "/placeholder-collection.jpg";
          return (
            <div key={category.id}>
              <ProductCard
                name={category.title}
                image={imageUrl}
                link={`/collections/${category.handle}`}
              />
            </div>
          );
        })}
      </section>
    </main>
  );
}
