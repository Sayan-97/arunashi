import type { Product } from "@/constants";
import type { Diamond, Gemstone } from "@/services/catalog";

export function normalizeShapeName(name: string): string {
  const norm = name
    .toLowerCase()
    .replace(/\b(cut|shape|shaped|diamond|diamonds)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return norm || "diamond";
}

export function matchGemstonesForProduct(
  product: Product,
  gemstones: Gemstone[],
): Gemstone[] {
  return gemstones.filter((gem) => {
    const gemName = gem.name.toLowerCase();
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
}

export function matchDiamondsForProduct(
  product: Product,
  diamonds: Diamond[],
): Diamond[] {
  return diamonds.filter((dia) => {
    if (!product.diamondShapeDetails) return false;
    const prodShapeNorm = normalizeShapeName(product.diamondShapeDetails);
    const targetShapeNorm = normalizeShapeName(dia.name);
    return (
      prodShapeNorm.includes(targetShapeNorm) ||
      targetShapeNorm.includes(prodShapeNorm)
    );
  });
}

export function matchProductsForGemstone(
  products: Product[],
  gemstoneName: string,
): Product[] {
  const gemName = gemstoneName.toLowerCase();
  return products.filter((product) => {
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
}

export function matchProductsForDiamondShape(
  products: Product[],
  diamondShapeName: string,
): Product[] {
  const targetShapeNorm = normalizeShapeName(diamondShapeName);
  return products.filter((product) => {
    if (!product.diamondShapeDetails) return false;
    const prodShapeNorm = normalizeShapeName(product.diamondShapeDetails);
    return (
      prodShapeNorm.includes(targetShapeNorm) ||
      targetShapeNorm.includes(prodShapeNorm)
    );
  });
}

type ProductImage = NonNullable<Product["images"]>[number];

export interface BrowseItem {
  id: string;
  name: string;
  image: ProductImage;
  hoverImage?: ProductImage;
  link: string;
}

export function getBrowseItems(
  products: Product[],
  gemstones: Gemstone[],
  diamonds: Diamond[],
): BrowseItem[] {
  const items: BrowseItem[] = [];

  for (const gem of gemstones) {
    const matchedProducts = matchProductsForGemstone(products, gem.name);
    if (matchedProducts.length > 0) {
      const firstProduct = matchedProducts[0];
      const slug = gem.name.toLowerCase().replace(/\s+/g, "-");
      const image = firstProduct.images
        ? firstProduct.images[0]
        : firstProduct.featuredImage;
      if (!image) continue;
      items.push({
        id: `gem-${gem.id}`,
        name: gem.name,
        image,
        hoverImage: firstProduct.images?.[1],
        link: `/gemstones/${slug}`,
      });
    }
  }

  for (const dia of diamonds) {
    const matchedProducts = matchProductsForDiamondShape(products, dia.name);
    if (matchedProducts.length > 0) {
      const firstProduct = matchedProducts[0];
      const slug = dia.name.toLowerCase().replace(/\s+/g, "-");
      const image = firstProduct.images
        ? firstProduct.images[0]
        : firstProduct.featuredImage;
      if (!image) continue;
      items.push({
        id: `dia-${dia.id}`,
        name: dia.name,
        image,
        hoverImage: firstProduct.images?.[1],
        link: `/diamonds/${slug}`,
      });
    }
  }

  items.sort((a, b) => a.name.localeCompare(b.name));
  return items;
}

export function getRelatedProducts(
  product: Product,
  allProducts: Product[],
  limit = 3,
): Product[] {
  const candidates = allProducts.filter((p) => p.id !== product.id);
  const inStock = candidates.filter(
    (p) => p.inventory !== undefined && p.inventory >= 1,
  );
  const outOfStock = candidates.filter(
    (p) => p.inventory === undefined || p.inventory < 1,
  );
  const getScore = (p: Product) => {
    let score = 0;
    if (
      p.collection &&
      product.collection &&
      p.collection === product.collection
    ) {
      score += 10;
    }
    if (p.category && product.category && p.category === product.category) {
      score += 5;
    }
    if (p.variant1 && product.variant1 && p.variant1 === product.variant1) {
      score += 2;
    }
    if (p.variant2 && product.variant2 && p.variant2 === product.variant2) {
      score += 2;
    }
    return score;
  };
  const sortCandidates = (list: Product[]) => {
    return list
      .map((p) => ({ item: p, score: getScore(p) }))
      .sort((a, b) => b.score - a.score)
      .map((x) => x.item);
  };
  return [...sortCandidates(inStock), ...sortCandidates(outOfStock)].slice(
    0,
    limit,
  );
}
