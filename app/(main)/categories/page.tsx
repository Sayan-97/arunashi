import ProductCard from "@/components/shared/product-card";
import { productCategories } from "@/constants";

export default function CategoriesPage() {
  return (
    <main className="app_container space-y-15 py-15">
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-11.75 gap-y-15">
        {productCategories.map((category) => (
          <div key={category.type}>
            <ProductCard
              name={category.name}
              image={category.image}
              link={`/categories/${category.type.toLowerCase()}`}
            />
          </div>
        ))}
      </section>
    </main>
  );
}
