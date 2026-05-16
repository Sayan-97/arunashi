import { ArrowUpDown, Filter } from "lucide-react";
import FilterDropdown from "@/components/layout/filter-dropdown";
import ProductCard from "@/components/shared/product-card";
import { products } from "@/constants";

export default function CategoryProductsPage() {
  return (
    <main className="app_container space-y-15 py-15">
      <div className="flex justify-end gap-4">
        <FilterDropdown
          label="Sort"
          variant="outline-button"
          icon={<ArrowUpDown size={18} className="text-[#d9df85]" />}
          options={[
            { label: "Price: Low to High", count: 0 },
            { label: "Price: High to Low", count: 0 },
            { label: "Newest Arrivals", count: 0 },
          ]}
        />
        <FilterDropdown
          label="Filter"
          variant="outline-button"
          icon={<Filter size={18} className="text-[#d9df85]" />}
          options={[
            { label: "In Stock", count: 12 },
            { label: "On Sale", count: 5 },
          ]}
        />
      </div>
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-11.75 gap-y-15">
        {products.map((product) => (
          <div key={product.id}>
            <ProductCard
              name={product.name}
              image={product.image}
              link={`/products/${product.id}`}
            />
          </div>
        ))}
      </section>
    </main>
  );
}
