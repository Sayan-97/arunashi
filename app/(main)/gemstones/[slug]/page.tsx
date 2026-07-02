import Link from "next/link";
import ProductCard from "@/components/shared/product-card";
import { getShopifyProducts } from "@/services/products";

interface Gemstone {
  id: string;
  name: string;
  link: string;
}

const getBackendUrl = () => process.env.API_URL || "http://localhost:8000";

async function getGemstoneBySlug(slug: string): Promise<Gemstone | null> {
  try {
    const res = await fetch(`${getBackendUrl()}/api/gemstones`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch gemstones");
    const json = await res.json();
    const list: Gemstone[] = json.data || [];
    const matched = list.find(
      (g) => g.name.toLowerCase().replace(/\s+/g, "-") === slug,
    );
    return matched || null;
  } catch (error) {
    console.error("Error matching gemstone slug:", error);
    return null;
  }
}

export const dynamic = "force-dynamic";

export default async function GemstoneDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const gemstone = await getGemstoneBySlug(slug);

  if (!gemstone) {
    return (
      <main className="py-20 text-center select-none">
        <h1 className="font-sans font-medium text-2xl mb-4">
          Gemstone Not Found
        </h1>
        <p className="text-[#868686] mb-8">
          The requested gemstone could not be found.
        </p>
        <Link
          href="/gemstones"
          className="border border-black px-6 py-2 uppercase text-sm font-semibold tracking-wider hover:bg-black hover:text-white transition-colors"
        >
          Back to Gemstones
        </Link>
      </main>
    );
  }

  const products = await getShopifyProducts();
  const gemName = gemstone.name.toLowerCase();

  const gemstoneProducts = products.filter((product) => {
    if (
      product.gemstoneDetails &&
      product.gemstoneDetails.toLowerCase().includes(gemName)
    ) {
      return true;
    }
    if (product.variant2 && product.variant2.toLowerCase().includes(gemName)) {
      return true;
    }
    if (product.name && product.name.toLowerCase().includes(gemName)) {
      return true;
    }
    return false;
  });

  return (
    <main className="py-15 space-y-12 animate-in fade-in duration-500">
      <section className="app_container flex flex-col items-center text-center space-y-6">
        <div className="w-full text-left">
          <Link
            href="/gemstones"
            className="text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-black transition-colors mb-2 inline-flex items-center gap-1.5"
          >
            &larr; GEMSTONES LIST
          </Link>
        </div>

        <h1 className="text-center font-fleur font-medium text-gray-900 select-none">
          {gemstone.name}
        </h1>
      </section>

      <section className="app_container">
        {gemstoneProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center select-none border border-dashed border-gray-200">
            <p className="text-gray-500 text-lg font-medium">
              No jewelry items found featuring this gemstone.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-11.75 gap-y-15">
            {gemstoneProducts.map((product) => (
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
