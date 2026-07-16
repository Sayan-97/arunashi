import Image from "next/image";
import { Suspense } from "react";
import CollectionProductsFilter from "@/components/collections/CollectionProductsFilter";
import { SHIMMER_WIDE as SHIMMER_BASE64 } from "@/lib/shimmer";
import HeroImg from "@/public/collection-hero-bg.png";
import { getShopifyCollections, getShopifyProducts } from "@/services/products";

export const dynamic = "force-dynamic";

export default async function CollectionProductsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [products, allCollections] = await Promise.all([
    getShopifyProducts(),
    getShopifyCollections(),
  ]);

  // Find the collection from the API by its handle (the URL slug)
  const collection = Array.isArray(allCollections)
    ? allCollections.find((c) => c.handle === slug)
    : undefined;

  const collectionName = collection?.title
    ? collection.title
    : decodeURIComponent(slug).replaceAll("-", " ");

  // Filter products that belong to this collection by handle match
  const filteredProducts = products.filter((product) =>
    product.collections?.some((col) => col.handle === slug),
  );

  // Hero image: use the collection's image from API, fall back to static default
  const heroImageUrl = collection?.image?.url || null;

  return (
    <main className="pb-15">
      <section className="relative w-full h-103 flex flex-col items-center justify-center text-center px-4">
        {heroImageUrl ? (
          <Image
            src={heroImageUrl}
            alt={collectionName}
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
            alt={collectionName}
            priority
            placeholder="blur"
            fill
            sizes="100vw"
            className="object-cover object-center -z-10"
          />
        )}
        <div className="absolute inset-0 bg-black/40 -z-10" />
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-white capitalize">{collectionName}</h1>
          {collection?.description && collection.description.trim() !== "" && (
            <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto font-medium leading-relaxed">
              {collection.description}
            </p>
          )}
        </div>
      </section>

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
    </main>
  );
}
