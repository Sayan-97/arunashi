import Image from "next/image";
import FilterDropdown from "@/components/layout/filter-dropdown";
import ProductCard from "@/components/shared/product-card";
import { collectionFilters, productsData } from "@/constants";
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
      <section className="app_container flex flex-wrap items-center justify-center gap-4 md:gap-10">
        {collectionFilters.map((filter) => (
          <FilterDropdown
            key={filter.label}
            label={filter.label}
            options={filter.options}
          />
        ))}
      </section>
      <section className="app_container grid md:grid-cols-2 lg:grid-cols-3 gap-x-11.75 gap-y-15">
        {productsData.slice(0, 6).map((product) => (
          <ProductCard
            key={product.id}
            image={product.featuredImage}
            name={product.name}
            link={`/products/${product.id}`}
          />
        ))}
      </section>
    </main>
  );
}
