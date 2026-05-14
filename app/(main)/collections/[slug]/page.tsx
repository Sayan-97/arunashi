import Image from "next/image";
import ProductCard from "@/components/shared/product-card";
import { products } from "@/constants";
import HeroImg from "@/public/collection-hero-bg.png";

export default function CollectionProductsPage() {
  return (
    <main className="pb-15 space-y-25">
      <section>
        <Image
          src={HeroImg}
          alt="Hero Image"
          priority
          placeholder="blur"
          className="w-full h-103 object-cover"
        />
      </section>
      <section className="app_container grid md:grid-cols-2 lg:grid-cols-3 gap-x-11.75 gap-y-15">
        {products.slice(0, 6).map((product) => (
          <ProductCard
            key={product.id}
            image={product.image}
            name={product.name}
            link={`/products/${product.id}`}
          />
        ))}
      </section>
    </main>
  );
}
