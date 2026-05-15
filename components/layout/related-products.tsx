import ProductCard from "@/components/shared/product-card";
import { products } from "@/constants";

export default function RelatedProducts() {
  return (
    <section className="space-y-15">
      <h1>You may also like</h1>
      <div className="grid lg:grid-cols-3 gap-11.75">
        {products.slice(0, 3).map((product) => (
          <ProductCard
            key={product.id}
            image={product.image}
            name={product.name}
            link="/"
          />
        ))}
      </div>
    </section>
  );
}
