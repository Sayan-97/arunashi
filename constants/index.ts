import type { StaticImageData } from "next/image";

export interface Product {
  id: number;
  name: string;
  msrp: string;
  category: string;
  featuredImage?: StaticImageData | string;
  images?: (StaticImageData | string)[];
  videos?: string[];
  collection: string;
  collections?: { id: string; title: string; handle: string }[];
  categories?: { id: string; title: string; handle: string }[];
  itemNumber?: string;
  des?: string;
  specifications?: string[];
  variant1?: string;
  variant2?: string;
  inventory?: number;
  grams?: number;
  weight?: number;
  weightUnit?: string;
  linesheetLink?: string | null;
  certificatesLink?: string | null;
  gemstoneDetails?: string | null;
  diamondShapeDetails?: string | null;
  certificates?: string | null;
  ecommerceUrl?: string | null;
}

export const navLinks = [
  {
    label: "Collections",
    href: "/collections",
  },
  {
    label: "Categories",
    href: "/categories",
  },
  {
    label: "Gemstones",
    href: "/gemstones",
  },
  {
    label: "Shapes & Colors",
    href: "/diamonds",
  },
  {
    label: "Latest Magazines",
    href: "/magazines",
  },
  {
    label: "Request List",
    href: "/request-list",
  },
];

export const footerLinks = [
  {
    label: "Terms & Condition",
    href: "/terms",
  },
  {
    label: "Privacy Policy",
    href: "/privacy",
  },
  {
    label: "Contact",
    href: "/contact-us",
  },
  {
    label: "About Us",
    href: "/about-us",
  },
];

export const collectionFilters = [
  {
    label: "Metal",
    options: [
      { label: "18K Black Gold", count: 19 },
      { label: "18K White Gold", count: 4 },
      { label: "18K Yellow Gold", count: 15 },
      { label: "Carbon Fiber", count: 3 },
      { label: "Titanium", count: 23 },
    ],
  },
  {
    label: "Category",
    options: [
      { label: "Rings", count: 42 },
      { label: "Necklaces", count: 28 },
      { label: "Earrings", count: 35 },
      { label: "Bracelets", count: 12 },
    ],
  },
  {
    label: "Gemstone",
    options: [
      { label: "Diamond", count: 120 },
      { label: "Sapphire", count: 45 },
      { label: "Emerald", count: 32 },
      { label: "Ruby", count: 21 },
    ],
  },
  {
    label: "Diamond Shape",
    options: [
      { label: "Round", count: 64 },
      { label: "Oval", count: 32 },
      { label: "Emerald", count: 18 },
      { label: "Pear", count: 24 },
    ],
  },
  {
    label: "Sort",
    options: [
      { label: "Newest", count: 0 },
      { label: "Price: Low to High", count: 0 },
      { label: "Price: High to Low", count: 0 },
    ],
  },
];

export const searchSuggestions = [
  "Sapphire",
  "Emerald Sapphire",
  "Diamond Stacking Band",
  "Lightning Strikes Collection",
];

export const searchPages = [
  {
    title: "The Storied Collection",
    href: "/collections/the-story-collection",
  },
  { title: "Shipping, Order Processing & Returns", href: "/shipping" },
];
