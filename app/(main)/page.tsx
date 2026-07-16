import { Suspense } from "react";
import Banners from "@/components/layout/banners";
import Categories from "@/components/layout/categories";
import Collections from "@/components/layout/collections";
import GemstonesAndDiamonds from "@/components/layout/gemstones-and-diamonds";
import Magazines from "@/components/layout/magazines";
import SectionLoading from "@/components/shared/section-loading";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <main className="pt-10 pb-15 space-y-25">
      <Suspense fallback={<SectionLoading className="py-32 app_container" />}>
        <Banners />
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <Collections />
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <Categories />
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <GemstonesAndDiamonds />
      </Suspense>
      <Suspense fallback={<SectionLoading />}>
        <Magazines />
      </Suspense>
    </main>
  );
}
