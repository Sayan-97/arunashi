import { Suspense } from "react";
import {
  getRelatedProducts,
  matchDiamondsForProduct,
  matchGemstonesForProduct,
} from "@/lib/catalog-match";
import { getDiamonds, getGemstones } from "@/services/catalog";
import { getShopifyProducts } from "@/services/products";
import ProductDetailsClient from "./ProductDetailsClient";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [products, gemstones, diamonds] = await Promise.all([
    getShopifyProducts(),
    getGemstones(),
    getDiamonds(),
  ]);
  const product = products.find((p) => p.id.toString() === slug) || products[0];

  const relatedProducts = getRelatedProducts(product, products);
  const matchedGemstones = matchGemstonesForProduct(product, gemstones);
  const matchedDiamonds = matchDiamondsForProduct(product, diamonds);

  return (
    <Suspense fallback={null}>
      <ProductDetailsClient
        product={product}
        relatedProducts={relatedProducts}
        matchedGemstones={matchedGemstones}
        matchedDiamonds={matchedDiamonds}
      />
    </Suspense>
  );
}
