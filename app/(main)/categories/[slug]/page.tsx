import Image from "next/image";
import { Suspense } from "react";
import CollectionProductsFilter from "@/components/collections/CollectionProductsFilter";
import HeroImg from "@/public/collection-hero-bg.png";
import { getShopifyCategories, getShopifyProducts } from "@/services/products";

export const dynamic = "force-dynamic";

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

  const categoryObj = Array.isArray(allCategories)
    ? allCategories.find((c) => c.handle?.toLowerCase() === slug.toLowerCase())
    : undefined;

  const targetCategoryName =
    categoryObj?.title || decodeURIComponent(slug).replaceAll("-", " ");

  const filteredProducts = products.filter((product) => {
    const s = slug.toLowerCase();

    if (product.categories && product.categories.length > 0) {
      const hasCat = product.categories.some(
        (c) => c.handle.toLowerCase() === s,
      );
      if (hasCat) return true;
    }

    const t = product.category.toLowerCase();
    return t === s || t === `${s}s` || s === `${t}s`;
  });

  const heroImage = categoryObj?.image?.url || HeroImg;
  const categoryDescription = categoryObj?.description;

  return (
    <main className="pb-15">
      {/* Banner Section */}
      <section className="relative w-full h-103 flex flex-col items-center justify-center text-center px-4 mb-15">
        <Image
          src={heroImage}
          alt={targetCategoryName}
          priority
          placeholder={heroImage === HeroImg ? "blur" : undefined}
          fill
          className="object-cover object-center -z-10"
        />
        <div className="absolute inset-0 bg-black/40 -z-10" />
        <div className="space-y-4 max-w-3xl">
          <h1 className="text-white capitalize">{targetCategoryName}</h1>
          {categoryDescription && categoryDescription.trim() !== "" && (
            <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto font-medium leading-relaxed animate-fade-in">
              {categoryDescription}
            </p>
          )}
        </div>
      </section>

      {/* Products & Filters Section */}
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
