import Banners from "@/components/layout/banners";
import Categories from "@/components/layout/categories";
import Collections from "@/components/layout/collections";
import GemstonesAndDiamonds from "@/components/layout/gemstones-and-diamonds";
import Magazines from "@/components/layout/magazines";
import { getShopifyProducts } from "@/services/products";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await getShopifyProducts();

  return (
    <main className="pt-10 pb-15 space-y-25">
      <Banners />
      <Collections />
      <Categories />
      <GemstonesAndDiamonds products={products} />
      <Magazines />
    </main>
  );
}
