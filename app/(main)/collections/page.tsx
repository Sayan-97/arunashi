import ProductCard from "@/components/shared/product-card";
import { collections } from "@/constants";

export default function CollectionsPage() {
  return (
    <main className="py-15">
      <section className="app_container flex flex-wrap justify-center gap-x-11.75 gap-y-15">
        {collections.map((collection) => (
          <div
            key={collection.id}
            className="w-full md:w-[calc((100%-47px)/2)] lg:w-[calc((100%-94px)/3)]"
          >
            <ProductCard
              image={collection.image}
              name={collection.name}
              link={`/collections/${collection.name.replaceAll(" ", "-").toLowerCase()}`}
            />
          </div>
        ))}
      </section>
    </main>
  );
}
