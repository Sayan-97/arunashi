import FilterDropdown from "@/components/layout/filter-dropdown";
import ProductCard from "@/components/shared/product-card";
import { getShopifyProducts } from "@/services/products";

export const dynamic = "force-dynamic";

export default async function CategoryProductsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await getShopifyProducts();

  const filteredProducts = products.filter((product) => {
    const s = slug.toLowerCase();

    if (product.categories && product.categories.length > 0) {
      const hasCat = product.categories.some(
        (c) => c.handle.toLowerCase() === s,
      );
      if (hasCat) return true;
    }

    const t = product.category.toLowerCase();
    return t === s || t === `${s}s` || s === `${t}s`;
  });

  return (
    <main className="py-15 space-y-15">
      <section className="app_container flex justify-end gap-4 md:gap-10">
        <FilterDropdown
          label="Sort"
          align="right"
          options={[
            { label: "Price: Low to High" },
            { label: "Price: High to Low" },
            { label: "Newest Arrivals" },
          ]}
        />
        <FilterDropdown
          label="Filter"
          align="right"
          options={[
            { label: "In Stock", count: 12 },
            { label: "On Sale", count: 5 },
          ]}
        />
      </section>

      <section className="app_container grid md:grid-cols-2 lg:grid-cols-3 gap-x-11.75 gap-y-15">
        {filteredProducts.map((product) => (
          <div key={product.id}>
            <ProductCard
              name={product.name}
              image={
                product.images
                  ? product.images[0]
                  : (product.featuredImage as import("next/image").StaticImageData)
              }
              hoverImage={product.images ? product.images[1] : undefined}
              link={`/products/${product.id}`}
            />
          </div>
        ))}
      </section>
    </main>
  );
}
