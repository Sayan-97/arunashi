import React from "react";
import ProductCard from "@/components/shared/product-card";
import { products } from "@/constants";

export default function ProductsPage() {
  return (
    <main className="py-15">
      <section className="app_container grid md:grid-cols-2 lg:grid-cols-3 gap-x-11.75 gap-y-15">
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
