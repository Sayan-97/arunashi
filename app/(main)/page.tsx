import Banners from "@/components/layout/banners";
import Categories from "@/components/layout/categories";
import Collections from "@/components/layout/collections";
import GemstonesAndDiamonds from "@/components/layout/gemstones-and-diamonds";
import Magazines from "@/components/layout/magazines";

export default function HomePage() {
  return (
    <main className="pb-15 space-y-25">
      <Banners />
      <Collections />
      <Categories />
      <GemstonesAndDiamonds />
      <Magazines />
    </main>
  );
}
