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
    inventory_quantity?: number;
    grams?: number;
    weight?: number;
    weight_unit?: string;
  }[];
  options?: {
    name: string;
    values?: string[];
  }[];
  images?: ShopifyImage[];
  image?: ShopifyImage;
  media?: {
    type: "image" | "video";
    src: string;
  }[];
  collections?: {
    id: string;
    title: string;
    handle: string;
  }[];
  categories?: {
    id: string;
    title: string;
    handle: string;
  }[];
  linesheetLink?: string | null;
  gemstoneDetails?: string | null;
  diamondShapeDetails?: string | null;
  certificates?: string | null;
}

export function mapShopifyProduct(p: ShopifyProduct): Product {
  const primaryVariant = p.variants?.[0] || {};
  const msrpVal = primaryVariant.price || "0";
  const wholesaleVal = (Number.parseFloat(msrpVal) * 0.6).toFixed(0);
  const totalInventory =
    p.variants?.reduce((sum, v) => sum + (v.inventory_quantity || 0), 0) ?? 0;

  // Determine collection based on the native Shopify collections array
  let collectionName = "Undefined";
  if (p.collections && p.collections.length > 0) {
    collectionName = p.collections[0].title;
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

  const mappedVideos = p.media
    ? p.media
        .filter((item) => item.type === "video" && typeof item.src === "string")
        .map((item) => item.src)
    : [];

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
    inventory: totalInventory,
    grams: primaryVariant.grams ?? 0,
    weight: primaryVariant.weight ?? 0,
    weightUnit: primaryVariant.weight_unit || "lb",
    images: mappedImages,
    featuredImage: mappedFeaturedImage,
    videos: mappedVideos,
    category: p.product_type || "Jewelry",
    collection: collectionName,
    collections: p.collections
      ? p.collections.map((c) => ({
          id: c.id,
          title: c.title,
          handle: c.handle,
        }))
      : [],
    categories: p.categories
      ? p.categories.map((c) => ({
          id: c.id,
          title: c.title,
          handle: c.handle,
        }))
      : [],
    linesheetLink: p.linesheetLink || null,
    gemstoneDetails: p.gemstoneDetails || null,
    diamondShapeDetails: p.diamondShapeDetails || null,
    certificates: p.certificates || null,
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

    // Filter and map all active products
    return allProducts.map(mapShopifyProduct);
  } catch (error) {
    console.error("Error fetching products from backend:", error);
    return [];
  }
}

export interface ShopifyCollection {
  id: string | number;
  title: string;
  handle: string;
  description?: string;
  image?: {
    url: string;
    altText?: string | null;
  } | null;
}

export async function getShopifyCollections(): Promise<ShopifyCollection[]> {
  const backendUrl = getBackendUrl();
  try {
    const res = await fetch(`${backendUrl}/api/products/collections`, {
      next: { revalidate: 3600 }, // Cache collections for 1 hour
    });
    if (!res.ok) {
      console.error("Failed to fetch collections from backend:", res.status);
      return [];
    }
    const json = await res.json();
    const rawList = (json.data || []) as ShopifyCollection[];
    return rawList.map((col) => {
      let imageUrl = col.image?.url || "";
      if (
        imageUrl &&
        (imageUrl.startsWith("/") || imageUrl.startsWith("public"))
      ) {
        if (imageUrl.startsWith("public")) {
          imageUrl = `/${imageUrl}`;
        }
        imageUrl = encodeURI(`${backendUrl}${imageUrl}`);
      }
      return {
        ...col,
        image: imageUrl ? { url: imageUrl } : null,
      };
    });
  } catch (error) {
    console.error("Error fetching collections from backend:", error);
    return [];
  }
}

export async function getShopifyCategories(): Promise<ShopifyCollection[]> {
  const backendUrl = getBackendUrl();
  try {
    const res = await fetch(`${backendUrl}/api/products/categories`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch categories: ${res.statusText}`);
    }

    const json = await res.json();
    const rawList = (json.data || []) as ShopifyCollection[];
    return rawList.map((col) => {
      let imageUrl = col.image?.url || "";
      if (
        imageUrl &&
        (imageUrl.startsWith("/") || imageUrl.startsWith("public"))
      ) {
        if (imageUrl.startsWith("public")) {
          imageUrl = `/${imageUrl}`;
        }
        imageUrl = encodeURI(`${backendUrl}${imageUrl}`);
      }
      return {
        ...col,
        image: imageUrl ? { url: imageUrl } : null,
      };
    });
  } catch (error) {
    console.error("Error fetching categories from backend:", error);
    return [];
  }
}

export interface RequestItem {
  id: number;
  name: string;
  itemNo: string;
  msrp: string;
  stockStatus: string;
  image: string;
  notes?: string;
}

export interface ShopifyRequest {
  id: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  items?: RequestItem[];
}

export async function getMyRequests(
  cookieHeader: string,
): Promise<ShopifyRequest[]> {
  const backendUrl = getBackendUrl();
  if (!cookieHeader) return [];
  try {
    const res = await fetch(
      `${backendUrl}/api/products/requests/my?t=${Date.now()}`,
      {
        headers: {
          Cookie: cookieHeader,
        },
        cache: "no-store",
      },
    );
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error("Unauthorized");
      }
      console.error("Failed to fetch my requests:", res.status);
      return [];
    }
    const json = await res.json();
    return (json.data || []) as ShopifyRequest[];
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      throw error;
    }
    console.error("Error fetching my requests:", error);
    return [];
  }
}
