import Link from "next/link";
import ProductCard from "@/components/shared/product-card";
import { matchProductsForDiamondShape } from "@/lib/catalog-match";
import { getDiamonds } from "@/services/catalog";
import { getShopifyProducts } from "@/services/products";

export const dynamic = "force-dynamic";

export default async function DiamondDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const diamonds = await getDiamonds();
  const diamond =
    diamonds.find((d) => d.name.toLowerCase().replace(/\s+/g, "-") === slug) ||
    null;

  if (!diamond) {
    return (
      <main className="py-20 text-center select-none">
        <h1 className="font-sans font-medium text-2xl mb-4">Shape Not Found</h1>
        <p className="text-[#868686] mb-8">
          The requested diamond shape could not be found.
        </p>
        <Link
          href="/diamonds"
          className="border border-black px-6 py-2 uppercase text-sm font-semibold tracking-wider hover:bg-black hover:text-white transition-colors"
        >
          Back to Shapes & Colors
        </Link>
      </main>
    );
  }

  const products = await getShopifyProducts();
  const diamondProducts = matchProductsForDiamondShape(products, diamond.name);

  return (
    <main className="py-15 space-y-12 animate-in fade-in duration-500">
      <section className="app_container flex flex-col items-center text-center space-y-6">
        <div className="w-full text-left">
          <Link
            href="/diamonds"
            className="text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-black transition-colors mb-2 inline-flex items-center gap-1.5"
          >
            &larr; SHAPES & COLORS LIST
          </Link>
        </div>

        <h1 className="text-center font-fleur font-medium text-gray-900 select-none">
          {diamond.name}
        </h1>
      </section>

      <section className="app_container">
        {diamondProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center select-none border border-dashed border-gray-200">
            <p className="text-gray-500 text-lg font-medium">
              No jewelry items found featuring this shape.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-11.75 gap-y-15">
            {diamondProducts.map((product) => (
              <div key={product.id}>
                <ProductCard
                  name={product.name}
                  image={
                    product.images
                      ? product.images[0]
                      : (product.featuredImage as any)
                  }
                  hoverImage={product.images ? product.images[1] : undefined}
                  link={`/products/${product.id}`}
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
