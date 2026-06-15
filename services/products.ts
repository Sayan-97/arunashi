import type { Product } from "@/constants";

const getBackendUrl = () => process.env.API_URL || "http://localhost:8000";

interface ShopifyImage {
  src: string;
  width?: number;
  height?: number;
}

export interface ShopifyProduct {
  id: number;
  title: string;
  body_html?: string;
  tags?: string;
  product_type?: string;
  variants?: {
    sku?: string;
    price?: string;
    option1?: string | null;
    option2?: string | null;
  }[];
  options?: {
    name: string;
    values?: string[];
  }[];
  images?: ShopifyImage[];
  image?: ShopifyImage;
}

export const allowedTitles = [
  "Lotus Flower Diamond Bracelet",
  "Violet Sapphire Bracelet",
  "Tanzanite Bangle",
  "Lightning Strikes Bangle",
  "White Sapphire, Spinel & Diamond Earrings",
  "Sapphire Eggs with Diamonds",
  "Multi Sapphire & Diamond Earrings",
  "Tsavorite Stain Glass Window Earrings",
  "Imperial Jade Earrings",
  "Pearl Encased in Emerald & Sapphire Earrings",
].map((t) => t.toLowerCase());

export function mapShopifyProduct(p: ShopifyProduct): Product {
  const primaryVariant = p.variants?.[0] || {};
  const msrpVal = primaryVariant.price || "0";
  const wholesaleVal = (Number.parseFloat(msrpVal) * 0.6).toFixed(0);

  // Determine collection based on tags
  let collectionName = "Undefined"; // default fallback
  const tags = (p.tags || "").split(",").map((t) => t.trim().toLowerCase());

  if (tags.includes("arches")) {
    collectionName = "Arches Collection";
  } else if (tags.includes("enigma")) {
    collectionName = "Enigma Collection";
  } else if (tags.includes("kintsugi")) {
    collectionName = "Kintsugi Collection";
  } else if (
    tags.includes("lightning-strikes") ||
    tags.includes("lightning strikes")
  ) {
    collectionName = "Lightning Strikes";
  } else if (
    tags.includes("maximal-minimalism") ||
    tags.includes("maximal minimalism")
  ) {
    collectionName = "Maximal Minimalism";
  } else if (
    tags.includes("minimal-maximalism") ||
    tags.includes("minimal maximalism") ||
    tags.includes("minimal maximal")
  ) {
    collectionName = "Minimal Maximalism";
  } else if (
    tags.includes("temple-of-echoes") ||
    tags.includes("temple of echoes")
  ) {
    collectionName = "Temple of Echoes Collection";
  } else if (tags.includes("the-story") || tags.includes("the story")) {
    collectionName = "The Story Collection";
  } else if (
    tags.includes("collectible-art") ||
    tags.includes("collectible art")
  ) {
    collectionName = "Collectible Art";
  }

  // Specifications
  const specs: string[] = [];
  if (p.options) {
    for (const opt of p.options) {
      if (opt.name && opt.values?.[0]) {
        specs.push(`${opt.name}: ${opt.values.join(", ")}`);
      }
    }
  }

  const mappedImages = p.images
    ? p.images.map((img) => ({
        src: img.src,
        width: img.width || 1500,
        height: img.height || 1714,
      }))
    : [];

  const mappedFeaturedImage = p.image
    ? {
        src: p.image.src,
        width: p.image.width || 1500,
        height: p.image.height || 1714,
      }
    : undefined;

  return {
    id: p.id,
    name: p.title,
    itemNumber: primaryVariant.sku || "",
    des: p.body_html ? p.body_html.replace(/<\/?[^>]+(>|$)/g, "") : "",
    specifications: specs.length > 0 ? specs : undefined,
    variant1: primaryVariant.option1 || undefined,
    variant2: primaryVariant.option2 || undefined,
    msrp: msrpVal,
    wholesalePrice: wholesaleVal,
    images: mappedImages,
    featuredImage: mappedFeaturedImage,
    videos: [],
    category: p.product_type || "Jewelry",
    collection: collectionName,
  };
}

export async function getShopifyProducts(): Promise<Product[]> {
  const backendUrl = getBackendUrl();
  try {
    const res = await fetch(`${backendUrl}/api/products`, {
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("Failed to fetch products from backend:", res.status);
      return [];
    }
    const json = await res.json();
    const allProducts: ShopifyProduct[] = json.data || [];

    // Filter and map
    return allProducts
      .filter((p) => allowedTitles.includes((p.title || "").toLowerCase()))
      .map(mapShopifyProduct);
  } catch (error) {
    console.error("Error fetching products from backend:", error);
    return [];
  }
}

export async function getMyRequests(token?: string): Promise<any[]> {
  const backendUrl = getBackendUrl();
  if (!token) return [];
  try {
    const res = await fetch(`${backendUrl}/api/products/requests/my`, {
      headers: {
        Cookie: `accessToken=${token}`,
      },
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("Failed to fetch my requests:", res.status);
      return [];
    }
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error fetching my requests:", error);
    return [];
  }
}
