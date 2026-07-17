import Image from "next/image";
import { Suspense } from "react";
import CollectionProductsFilter from "@/components/collections/CollectionProductsFilter";
import { SHIMMER_WIDE as SHIMMER_BASE64 } from "@/lib/shimmer";
import HeroImg from "@/public/collection-hero-bg.png";
import { getShopifyCategories, getShopifyProducts } from "@/services/products";

export default async function CategoryProductsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [products, allCategories] = await Promise.all([
    getShopifyProducts(),
    getShopifyCategories(),
  ]);

  // Find the category from the API by its handle (the URL slug)
  const category = Array.isArray(allCategories)
    ? allCategories.find((c) => c.handle?.toLowerCase() === slug.toLowerCase())
    : undefined;

  const categoryName = category?.title
    ? category.title
    : decodeURIComponent(slug).replaceAll("-", " ");

  // Filter products that belong to this category by handle match
  const filteredProducts = products.filter((product) => {
    const s = slug.toLowerCase();

    if (product.categories && product.categories.length > 0) {
      return product.categories.some((c) => c.handle.toLowerCase() === s);
    }

    // Fallback: match on product_type field (e.g. "ring" vs "rings")
    const t = product.category.toLowerCase();
    return t === s || t === `${s}s` || s === `${t}s`;
  });

  // Hero image: use the category's image from API, fall back to static default
  const heroImageUrl = category?.image?.url || null;

  return (
    <main className="pb-15">
      <section className="relative w-full h-103 flex flex-col items-center justify-center text-center px-4 mb-15">
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt={categoryName}
            priority
            placeholder="blur"
            blurDataURL={SHIMMER_BASE64}
            fill
            sizes="100vw"
            className="object-cover object-center -z-10"
          />
        ) : (
          <Image
            src={HeroImg}
            alt={categoryName}
            priority
            placeholder="blur"
            fill
            sizes="100vw"
            className="object-cover object-center -z-10"
          />
        )}
        <div className="absolute inset-0 bg-black/40 -z-10" />
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-white capitalize">{categoryName}</h1>
          {category?.description && category.description.trim() !== "" && (
            <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto font-medium leading-relaxed">
              {category.description}
            </p>
          )}
        </div>
      </section>

      {filteredProducts.length > 0 ? (
        <Suspense
          fallback={
            <div className="text-center py-20">
              <p className="text-xl text-gray-500 font-medium">
                Loading products...
              </p>
            </div>
          }
        >
          <CollectionProductsFilter initialProducts={filteredProducts} />
        </Suspense>
      ) : (
        <div className="col-span-full text-center py-20 select-none">
          <p className="text-xl text-gray-500 font-medium">
            No products found matching this category.
          </p>
        </div>
      )}
    </main>
  );
}
