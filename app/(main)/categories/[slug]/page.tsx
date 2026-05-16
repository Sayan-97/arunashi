import FilterDropdown from "@/components/layout/filter-dropdown";
import ProductCard from "@/components/shared/product-card";
import { productsData } from "@/constants";

export default async function CategoryProductsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const filteredProducts = productsData.filter((product) => {
    const s = slug.toLowerCase();
    const t = product.category.toLowerCase();
    return t === s || t === s + "s" || s === t + "s";
  });

  return (
    <main className="py-15 space-y-15">
      <section className="app_container flex justify-end gap-4 md:gap-10">
        <FilterDropdown
          label="Sort"
          align="right"
          options={[
            { label: "Price: Low to High", count: 0 },
            { label: "Price: High to Low", count: 0 },
            { label: "Newest Arrivals", count: 0 },
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
              image={product.featuredImage}
              link={`/products/${product.id}`}
            />
          </div>
        ))}
      </section>
    </main>
  );
}
