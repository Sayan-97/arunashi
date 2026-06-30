import { Suspense } from "react";
import { getShopifyProducts } from "@/services/products";
import ProductDetailsClient from "./ProductDetailsClient";

export const dynamic = "force-dynamic";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const products = await getShopifyProducts();
  const product = products.find((p) => p.id.toString() === slug) || products[0];

  return (
    <Suspense fallback={null}>
      <ProductDetailsClient product={product} allProducts={products} />
    </Suspense>
  );
}
