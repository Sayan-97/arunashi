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

  const jewelryCategories = categories.filter((c) => {
    const title = c.title?.toLowerCase().trim() || "";
    return jewelryTitles.includes(title);
  });

  const gemstoneCategories = categories.filter((c) => {
    const title = c.title?.toLowerCase().trim() || "";
    return !jewelryTitles.includes(title);
  });

  return (
    <main className="app_container space-y-16 py-15">
      {/* Jewelry Section */}
      {jewelryCategories.length > 0 && (
        <div className="space-y-8">
          <div className="border-b border-black/10 pb-4">
            <h1>Jewelry</h1>
          </div>
          <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-11.75 gap-y-15">
            {jewelryCategories.map((category) => {
              const imageUrl =
                category.image?.url || "/placeholder-collection.jpg";
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
        </div>
      )}

      {/* Gemstones Section */}
      {gemstoneCategories.length > 0 && (
        <div className="space-y-8 pt-6">
          <div className="border-b border-black/10 pb-4">
            <h1>Gemstones</h1>
          </div>
          <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-11.75 gap-y-15">
            {gemstoneCategories.map((category) => {
              const imageUrl =
                category.image?.url || "/placeholder-collection.jpg";
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
        </div>
      )}
    </main>
  );
}
