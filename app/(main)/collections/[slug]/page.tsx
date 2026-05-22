import Image from "next/image";
import FilterDropdown from "@/components/layout/filter-dropdown";
import ProductCard from "@/components/shared/product-card";
import {
  collectionFilters,
  productCollections,
  productsData,
} from "@/constants";
import HeroImg from "@/public/collection-hero-bg.png";

export default async function CollectionProductsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Resolve the collection object from slug (handling both string slug and numeric ID)
  const isNumeric = /^\d+$/.test(slug);
  const colObj = isNumeric
    ? productCollections.find((c) => c.id === parseInt(slug, 10))
    : productCollections.find((c) => {
        const decodedSlug = decodeURIComponent(slug)
          .toLowerCase()
          .replaceAll("-", " ");
        return (
          c.name.toLowerCase() === decodedSlug ||
          c.name.toLowerCase().replace(" collection", "") === decodedSlug
        );
      });

  const targetCollectionName = colObj
    ? colObj.name
    : decodeURIComponent(slug).replaceAll("-", " ");

  const filteredProducts = productsData.filter((product) => {
    if (!product.collection) return false;
    const pCol = product.collection.toLowerCase();
    const tCol = targetCollectionName.toLowerCase();
    return (
      pCol === tCol ||
      pCol.replace(" collection", "") === tCol.replace(" collection", "")
    );
  });

  const heroImage = colObj?.bgImage || HeroImg;

  return (
    <main className="pb-15 space-y-25">
      <section className="relative w-full h-103 flex flex-col items-center justify-center text-center px-4">
        <Image
          src={heroImage}
          alt={targetCollectionName}
          priority
          placeholder={heroImage === HeroImg ? "blur" : undefined}
          fill
          className="object-cover object-center -z-10"
        />
        <div className="absolute inset-0 bg-black/40 -z-10" />
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-white capitalize">{targetCollectionName}</h1>
          {colObj?.description && colObj.description.trim() !== "" && (
            <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto font-light leading-relaxed animate-fade-in">
              {colObj.description}
            </p>
          )}
        </div>
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
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              image={
                product.images
                  ? product.images[0]
                  : (product.featuredImage as import("next/image").StaticImageData)
              }
              hoverImage={product.images ? product.images[1] : undefined}
              name={product.name}
              link={`/products/${product.id}`}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <p className="text-xl text-gray-500 font-medium">
              No products found in this collection.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
