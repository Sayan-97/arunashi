"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/shared/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { Product } from "@/constants";

interface GemstonesAndDiamondsProps {
  products?: Product[];
}

interface BrowseItem {
  id: string;
  name: string;
  image: any;
  hoverImage?: any;
  link: string;
}

export default function GemstonesAndDiamonds({
  products,
}: GemstonesAndDiamondsProps) {
  const displayProducts = products || [];
  const [browseItems, setBrowseItems] = useState<BrowseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const normalizeShapeName = (name: string): string => {
      const norm = name
        .toLowerCase()
        .replace(/\b(cut|shape|shaped|diamond|diamonds)\b/g, "")
        .replace(/\s+/g, " ")
        .trim();
      return norm || "diamond";
    };

    Promise.all([
      fetch("/api/gemstones").then((res) => res.json()),
      fetch("/api/diamonds").then((res) => res.json()),
    ])
      .then(([gemsJson, diasJson]) => {
        const gemList = gemsJson.data || [];
        const diaList = diasJson.data || [];
        const items: BrowseItem[] = [];

        // 1. Process Gemstones
        for (const gem of gemList) {
          const gemName = gem.name.toLowerCase();
          const matchedProducts = displayProducts.filter((product) => {
            if (product.gemstoneDetails?.toLowerCase().includes(gemName)) {
              return true;
            }
            if (product.variant2?.toLowerCase().includes(gemName)) {
              return true;
            }
            if (product.name?.toLowerCase().includes(gemName)) {
              return true;
            }
            return false;
          });

          if (matchedProducts.length > 0) {
            const firstProduct = matchedProducts[0];
            const slug = gem.name.toLowerCase().replace(/\s+/g, "-");
            items.push({
              id: `gem-${gem.id}`,
              name: gem.name,
              image: firstProduct.images
                ? firstProduct.images[0]
                : firstProduct.featuredImage,
              hoverImage: firstProduct.images?.[1]
                ? firstProduct.images[1]
                : undefined,
              link: `/gemstones/${slug}`,
            });
          }
        }

        // 2. Process Diamond Shapes
        for (const dia of diaList) {
          const targetShapeNorm = normalizeShapeName(dia.name);
          const matchedProducts = displayProducts.filter((product) => {
            if (!product.diamondShapeDetails) return false;
            const prodShapeNorm = normalizeShapeName(
              product.diamondShapeDetails,
            );
            return (
              prodShapeNorm.includes(targetShapeNorm) ||
              targetShapeNorm.includes(prodShapeNorm)
            );
          });

          if (matchedProducts.length > 0) {
            const firstProduct = matchedProducts[0];
            const slug = dia.name.toLowerCase().replace(/\s+/g, "-");
            items.push({
              id: `dia-${dia.id}`,
              name: dia.name,
              image: firstProduct.images
                ? firstProduct.images[0]
                : firstProduct.featuredImage,
              hoverImage: firstProduct.images?.[1]
                ? firstProduct.images[1]
                : undefined,
              link: `/diamonds/${slug}`,
            });
          }
        }

        // Sort items alphabetically
        items.sort((a, b) => a.name.localeCompare(b.name));

        setBrowseItems(items);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading gemstones/diamonds browse items:", err);
        setLoading(false);
      });
  }, [displayProducts]);

  return (
    <section className="app_container">
      <Carousel opts={{ loop: true }} className="space-y-15">
        {/* Header Row: Title on the left, navigation buttons on the right */}
        <div className="flex items-center justify-between">
          <h1>Browse by gemstones and diamond shapes</h1>
          <div className="flex items-center gap-4">
            <CarouselPrevious
              variant="outline"
              size="icon-lg"
              className="static rounded-none translate-y-0"
            />
            <CarouselNext
              variant="outline"
              size="icon-lg"
              className="static rounded-none translate-y-0"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 w-full">
            <div className="w-8 h-8 border-2 border-[#627426] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : browseItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center select-none w-full border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium">
              No gemstones or diamond shapes match any active products.
            </p>
          </div>
        ) : (
          <CarouselContent className="-ml-11.75">
            {browseItems.map((item) => (
              <CarouselItem
                key={item.id}
                className="md:basis-1/2 lg:basis-1/3 space-y-4 pl-11.75"
              >
                <ProductCard
                  image={item.image}
                  hoverImage={item.hoverImage}
                  name={item.name}
                  link={item.link}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        )}
      </Carousel>
    </section>
  );
}
