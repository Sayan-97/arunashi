import BannerImg1 from "@/public/banner-img-1.png";

import CollectionImg1 from "@/public/collection-img-1.png";
import CollectionImg2 from "@/public/collection-img-2.png";
import CollectionImg3 from "@/public/collection-img-3.png";
import CollectionImg4 from "@/public/collection-img-4.png";
import CollectionImg5 from "@/public/collection-img-5.png";
import CollectionImg6 from "@/public/collection-img-6.png";
import CollectionImg7 from "@/public/collection-img-7.png";
import CollectionImg8 from "@/public/collection-img-8.png";

import MagazineImg1 from "@/public/magazine-img-1.png";
import MagazineImg2 from "@/public/magazine-img-2.png";
import MagazineImg3 from "@/public/magazine-img-3.png";
import MagazineImg4 from "@/public/magazine-img-4.png";
import MagazineImg5 from "@/public/magazine-img-5.png";
import MagazineImg6 from "@/public/magazine-img-6.png";
import MagazineImg7 from "@/public/magazine-img-7.png";
import MagazineImg8 from "@/public/magazine-img-8.png";
import Product1 from "@/public/product-1.png";
// import Product2 from "@/public/product-2.png";
import Product3 from "@/public/product-3.png";
// import Product4 from "@/public/product-4.png";
import Product5 from "@/public/product-5.png";
// import Product6 from "@/public/product-6.png";
import Product7 from "@/public/product-7.png";
// import Product8 from "@/public/product-8.png";
import Product9 from "@/public/product-9.png";
// import Product10 from "@/public/product-10.png";
import Product11 from "@/public/product-11.png";
// import Product12 from "@/public/product-12.png";
import ProductImg1 from "@/public/product-img-1.png";
// import ProductImg2 from "@/public/product-img-2.png";
// import ProductImg3 from "@/public/product-img-3.png";
// import ProductImg4 from "@/public/product-img-4.png";
// import ProductImg5 from "@/public/product-img-5.png";
// import ProductImg6 from "@/public/product-img-6.png";
// import ProductImg7 from "@/public/product-img-7.png";
import ProductImg8 from "@/public/product-img-8.png";
import ProductImg9 from "@/public/product-img-9.png";
import ProductImg10 from "@/public/product-img-10.png";

// import ProductImg11 from "@/public/product-img-11.png";
// import ProductImg12 from "@/public/product-img-12.png";

import type { StaticImageData } from "next/image";
import Product1Img1 from "@/public/products/product1img1.png";
import Product1Img2 from "@/public/products/product1img2.png";
import Product1Img3 from "@/public/products/product1img3.png";
import Product1Img4 from "@/public/products/product1img4.png";
import Product1Img5 from "@/public/products/product1img5.png";
import Product2Img1 from "@/public/products/product2img1.png";
import Product2Img2 from "@/public/products/product2img2.png";
import Product2Img3 from "@/public/products/product2img3.png";
import Product2Img4 from "@/public/products/product2img4.png";
import Product3Img1 from "@/public/products/product3img1.png";
import Product3Img2 from "@/public/products/product3img2.jpg";
import Product3Img3 from "@/public/products/product3img3.jpg";
import Product3Img4 from "@/public/products/product3img4.jpg";
import Product3Img5 from "@/public/products/product3img5.jpg";
import Product3Img6 from "@/public/products/product3img6.jpg";
import Product3Img7 from "@/public/products/product3img7.jpg";
import Product4Img1 from "@/public/products/product4img1.png";
import Product4Img2 from "@/public/products/product4img2.png";
import Product4Img3 from "@/public/products/product4img3.png";
import Product4Img4 from "@/public/products/product4img4.png";
import Product4Img5 from "@/public/products/product4img5.png";
import Product4Img6 from "@/public/products/product4img6.png";
import Product5Img1 from "@/public/products/product5img1.png";
import Product5Img2 from "@/public/products/product5img2.png";
import Product5Img3 from "@/public/products/product5img3.png";
import Product5Img4 from "@/public/products/product5img4.png";
import Product6Img1 from "@/public/products/product6img1.png";
import Product7Img1 from "@/public/products/product7img1.png";
import Product7Img2 from "@/public/products/product7img2.png";
import Product7Img3 from "@/public/products/product7img3.png";
import Product7Img4 from "@/public/products/product7img4.png";
import Product8Img1 from "@/public/products/product8img1.png";
import Product8Img2 from "@/public/products/product8img2.png";
import Product8Img3 from "@/public/products/product8img3.png";
import Product9Img1 from "@/public/products/product9img1.png";
import Product9Img2 from "@/public/products/product9img2.png";
import Product9Img3 from "@/public/products/product9img3.png";
import Product9Img4 from "@/public/products/product9img4.png";
import Product10Img1 from "@/public/products/product10img1.png";

export interface Product {
  id: number;
  name: string;
  msrp: string;
  category: string;
  featuredImage?: StaticImageData;
  images?: StaticImageData[];
  videos?: string[];
  collection: string;
  itemNumber?: string;
  des?: string;
  specifications?: string[];
  variant1?: string;
  variant2?: string;
  wholesalePrice?: string;
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
    label: "Diamond Shapes & Colors",
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
    label: "Terms & Conditions",
    href: "",
  },
  {
    label: "Privacy Policy",
    href: "",
  },
  {
    label: "Contact",
    href: "/contact-us",
  },
  {
    label: "About Us",
    href: "",
  },
];

export const banners = [
  {
    id: 1,
    image: BannerImg1,
  },
  {
    id: 2,
    image: BannerImg1,
  },
];

export const collections = [
  {
    id: 1,
    image: CollectionImg1,
    name: "Arches Collection",
  },
  {
    id: 2,
    image: CollectionImg2,
    name: "Enigma Collection",
  },
  {
    id: 3,
    image: CollectionImg3,
    name: "Kintsugi Collection",
  },
  {
    id: 4,
    image: CollectionImg4,
    name: "Lightning Strikes Collection",
  },
  {
    id: 5,
    image: CollectionImg5,
    name: "Maximal Minimalism Collection",
  },
  {
    id: 6,
    image: CollectionImg6,
    name: "Minimal Maximal Collection",
  },
  {
    id: 7,
    image: CollectionImg7,
    name: "Temple of Echoes Collection",
  },
  {
    id: 8,
    image: CollectionImg8,
    name: "The Story Collection",
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

export const categories = [
  {
    id: 1,
    name: "Bracelets",
    image: ProductImg9,
  },
  {
    id: 2,
    name: "Earrings",
    image: ProductImg1,
  },
  {
    id: 3,
    name: "Rings",
    image: ProductImg10,
  },
  {
    id: 4,
    name: "Necklaces",
    image: ProductImg8,
  },
];

// export const products = [
//   {
//     id: 1,
//     image: ProductImg1,
//     name: "Product Name",
//   },
//   {
//     id: 2,
//     image: ProductImg2,
//     name: "Product Name",
//   },
//   {
//     id: 3,
//     image: ProductImg3,
//     name: "Product Name",
//   },
//   {
//     id: 4,
//     image: ProductImg4,
//     name: "Product Name",
//   },
//   {
//     id: 5,
//     image: ProductImg5,
//     name: "Product Name",
//   },
//   {
//     id: 6,
//     image: ProductImg6,
//     name: "Product Name",
//   },
//   {
//     id: 7,
//     image: ProductImg7,
//     name: "Product Name",
//   },
//   {
//     id: 8,
//     image: ProductImg8,
//     name: "Product Name",
//   },
//   {
//     id: 9,
//     image: ProductImg9,
//     name: "Product Name",
//   },
//   {
//     id: 10,
//     image: ProductImg10,
//     name: "Product Name",
//   },
//   {
//     id: 11,
//     image: ProductImg11,
//     name: "Product Name",
//   },
//   {
//     id: 12,
//     image: ProductImg12,
//     name: "Product Name",
//   },
// ];

export const magazines = [
  {
    id: 1,
    image: MagazineImg1,
    link: "/",
  },
  {
    id: 2,
    image: MagazineImg2,
    link: "/",
  },
  {
    id: 3,
    image: MagazineImg3,
    link: "/",
  },
  {
    id: 4,
    image: MagazineImg4,
    link: "/",
  },
  {
    id: 5,
    image: MagazineImg5,
    link: "/",
  },
  {
    id: 6,
    image: MagazineImg6,
    link: "/",
  },
  {
    id: 7,
    image: MagazineImg7,
    link: "/",
  },
  {
    id: 8,
    image: MagazineImg8,
    link: "/",
  },
];

export const gemstones = [
  { name: "Garnet - Demantoid" },
  { name: "Garnet - Hessonite" },
  { name: "Garnet - Mandarin" },
  { name: "Garnet - Red" },
  { name: "Garnet - Rhodolite" },
  { name: "Gold" },
  { name: "Gold - Rose" },
  { name: "Goya De Acha Natural Pearl" },
  { name: "Green Beryl" },
  { name: "Hauynite" },
  { name: "Imperial Jade" },
  { name: "Indicolite" },
  { name: "Ivory Creek Variscite" },
  { name: "Jade - Black" },
  { name: "Jade - Imperial" },
  { name: "Jade - Lavender" },
  { name: "Labradorite" },
  { name: "Lapis Lazuli" },
  { name: "Lavender Jade" },
  { name: "Magnesite" },
  { name: "Malachite" },
  { name: "Maligano" },
  { name: "Mexican Fire Opal" },
  { name: "Moonstone" },
  { name: "Moonstone - Blue" },
  { name: "Moonstone - Chocolate" },
  { name: "Moonstone - Gray" },
  { name: "Moonstone - Green" },
  { name: "Moonstone - Peach" },
  { name: "Moonstone - Rainbow" },
  { name: "Moonstone - Silver" },
  { name: "Moonstone - White" },
  { name: "Moroccan Chrysocolla" },
  { name: "Mother of Pearl" },
  { name: "Nephrite Jade" },
  { name: "Ocean Jasper" },
  { name: "Onyx" },
  { name: "Opal" },
  { name: "Opal - Black" },
  { name: "Opal - Blue" },
  { name: "Opal - Cachalone" },
  { name: "Opal - Ethiopia" },
  { name: "Opal - Jelly" },
  { name: "Opal - Trillion" },
  { name: "Opal - Water" },
  { name: "Opalwood" },
  { name: "Origami" },
  { name: "Paraiba - Brazil" },
  { name: "Paraiba - Mozambique" },
  { name: "Pearl" },
  { name: "Pearls - Basra" },
  { name: "Pearls - South Sea" },
  { name: "Pearls - Tahitian Gray" },
  { name: "Peridot" },
  { name: "Petrified Wood" },
  { name: "Pink Opal" },
  { name: "Prehnite" },
  { name: "Rhodochrosite" },
  { name: "Rhodolite" },
  { name: "Rhodonite" },
  { name: "Ruby - Burma" },
  { name: "Sapphire" },
  { name: "Sapphire - Blue" },
  { name: "Sapphire - Ceylon" },
  { name: "Sapphire - Fancy Color" },
  { name: "Sapphire - Padparadscha" },
  { name: "Sapphire - Pink" },
  { name: "Sapphire - Purple" },
  { name: "Sapphire - Sugarloaf" },
  { name: "Sapphire - Violet" },
  { name: "Serpentine" },
  { name: "Sphene" },
  { name: "Spinel" },
  { name: "Spinel - Purple" },
  { name: "Sugarloaf Cut" },
  { name: "Sugilite Drop" },
  { name: "Tanzanite" },
  { name: "Titanium" },
  { name: "Tourmaline" },
  { name: "Tourmaline - Black" },
  { name: "Tourmaline - Chrome" },
  { name: "Tourmaline - Indicolite" },
  { name: "Tourmaline - Mint Green" },
  { name: "Tourmaline - Paraiba Brazil" },
  { name: "Tourmaline - Paraiba Mozambique" },
  { name: "Tourmaline - Pink" },
  { name: "Tourmaline - Rubellite" },
  { name: "Tourmaline - Watermelon" },
  { name: "Turquoise" },
  { name: "Turquoise - Golden Hill" },
  { name: "Turquoise - Kazakhstan" },
  { name: "Variscite" },
  { name: "Violet Sapphire" },
  { name: "Water Opal" },
];

export const diamonds = [
  { name: "Diamond Ashoka Cut" },
  { name: "Diamond Ascher Cut" },
  { name: "Diamond Black" },
  { name: "Diamond Baguette" },
  { name: "Diamond Briolette" },
  { name: "Diamond Brown Baguette" },
  { name: "Diamond Black Baguette" },
  { name: "Diamond Bullet" },
  { name: "Diamond Cognac" },
  { name: "Diamond Cushion Shape" },
  { name: "Diamond Champagne Baguette Cut" },
  { name: "Diamond Cognac Rose Cut" },
  { name: "Diamond Emerald Cut" },
  { name: "Diamond Epaulette Cut" },
  { name: "Diamond Fancy Cut" },
  { name: "Diamond Fancy Color" },
  { name: "Diamond Fancy Vivid Yellow" },
  { name: "Diamond French Baguette" },
  { name: "Diamond Fancy Intense Yellow Orange" },
  { name: "Diamond French Carre Cut" },
  { name: "Diamond Fancy White" },
  { name: "Diamond Geometric Oval" },
  { name: "Diamond Gray Bead" },
  { name: "Diamond Geometric Marquise" },
  { name: "Diamond Hexagon Cut" },
  { name: "Diamond Intense Pink" },
  { name: "Diamond Intense Yellow" },
  { name: "Diamond Imperial Crest" },
  { name: "Diamond Kite Shape" },
  { name: "Diamond Lozenge Cut" },
  { name: "Diamond Micropave" },
  { name: "Diamond Marquise Cut" },
  { name: "Diamond Oval Cut" },
  { name: "Diamond Old Mine Cut" },
  { name: "Diamond Pear Cut" },
  { name: "Diamond Polki" },
  { name: "Diamond Portrait Cut" },
  { name: "Diamond Modified Pentagon" },
  { name: "Diamond Princess Cut" },
  { name: "Diamond Rose Cut" },
  { name: "Diamond Round Full Cut" },
  { name: "Diamond Reverse Set" },
  { name: "Diamond Rustic" },
  { name: "Diamond Single Cut" },
  { name: "Diamond Taper" },
  { name: "Diamond Triangle" },
  { name: "Diamond Trapezoid" },
  { name: "Diamond Triangle Portrait" },
  { name: "Diamond White" },
  { name: "Diamond Yellow" },
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

export const requestedProducts = [
  {
    id: 1,
    name: "Premium emerald inlay seamless ring",
    itemNo: "2089868976",
    msrp: "$30,0000",
    stockStatus: "In Stock",
    notes:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    image: "/product-img-1.png",
  },
  {
    id: 2,
    name: "Premium emerald inlay seamless ring",
    itemNo: "2089868976",
    msrp: "$30,0000",
    stockStatus: "In Stock",
    notes: null,
    image: "/product-img-1.png",
  },
  {
    id: 3,
    name: "Premium emerald inlay seamless ring",
    itemNo: "2089868976",
    msrp: "$30,0000",
    stockStatus: "Out of Stock",
    notes:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    image: "/product-img-1.png",
  },
  {
    id: 4,
    name: "Premium emerald inlay seamless ring",
    itemNo: "2089868976",
    msrp: "$30,0000",
    stockStatus: "In Stock",
    notes: null,
    image: "/product-img-1.png",
  },
];

export const productCollections = [{}];

export const productCategories = [
  {
    name: "Rings",
    image: Product9,
    type: "ring",
  },
  {
    name: "Bracelets",
    image: Product1,
    type: "bracelet",
  },
  {
    name: "Earrings",
    image: Product3,
    type: "earring",
  },
  {
    name: "Brooch",
    image: Product11,
    type: "brooch",
  },
  {
    name: "Necklaces",
    image: Product5,
    type: "necklace",
  },
  {
    name: "Pendants",
    image: Product7,
    type: "pendant",
  },
];

export const productsData: Product[] = [
  {
    id: 1,
    itemNumber: "2B000075 BXXXDIWGCA",
    name: "Lotus Flower Diamond Bracelet",
    des: "Layers of Diamond petals unfold along a lotus motif, capturing transformation, balance, and the quiet strength found in nature’s rhythm.",
    specifications: [
      "Diamond  Centers  4,68  carat F-G-H SI+",
      "Diamond  Full  Cut  5,32  carat  F-G-H SI+",
    ],
    variant1: "18K White Gold",
    variant2: "Diamond",
    msrp: "58500",
    wholesalePrice: "35100",
    images: [
      Product1Img1,
      Product1Img2,
      Product1Img3,
      Product1Img4,
      Product1Img5,
    ],
    videos: ["/public/products/product1vid1.mp4"],
    category: "Bracelet",
    collection: "Collectible Art",
  },
  {
    id: 2,
    itemNumber: "2B000085 BXXXLSYGMI",
    name: "Violet Sapphire Bracelet",
    des: "Violet sapphire adds subtle color and rarity to a sleek gold bangle, designed for effortless wear from everyday style to evening elegance.",
    specifications: [
      "1 Violet Sapphire 4.64 carat ",
      "86 Diamond 2.46 carat F-G-H VS+",
    ],
    variant1: "18K Yellow Gold",
    variant2: "Violet Sapphire, Diamond",
    msrp: "44500",
    wholesalePrice: "26700",
    images: [Product2Img1, Product2Img2, Product2Img3, Product2Img4],
    videos: [],
    category: "Bracelet",
    collection: "Maximal Minimalism",
  },
  {
    id: 3,
    itemNumber: "2B000087 BXXXTZWGMX",
    name: "Tanzanite Bangle",
    des: "Tanzanite and Diamonds glow with calming energy, symbolizing intuition, clarity, and balance. Inspired by Tanzanian tradition and beauty.",
    specifications: [
      "Tanzanite 18.87 carat",
      "154  Diamond 2.09 carat  F-G-H VS+",
    ],
    variant1: "18K White Gold",
    variant2: "Tanzanite, Diamond",
    msrp: "78500",
    wholesalePrice: "47100",
    images: [
      Product3Img1,
      Product3Img2,
      Product3Img3,
      Product3Img4,
      Product3Img5,
      Product3Img6,
      Product3Img7,
    ],
    videos: ["/products/product3vid1.mp4"],
    category: "Bracelet",
    collection: "Minimal Maximalism",
  },
  {
    id: 4,
    itemNumber: "2B000096 B009DIYGLS",
    name: "Lightning Strikes Bangle",
    des: "Brushed gold bangle showcases lightning-inspired design, accented with Diamonds symbolizing power, energy, and inner strength with refined detail.",
    specifications: ["165 Diamond 3.23 carat F-G-H VS+"],
    variant1: "18K Yellow Gold",
    variant2: "Diamond",
    msrp: "48800",
    wholesalePrice: "29280",
    images: [
      Product4Img1,
      Product4Img2,
      Product4Img3,
      Product4Img4,
      Product4Img5,
      Product4Img6,
    ],
    videos: ["/products/product4vid1.mp4"],
    category: "Bracelet",
    collection: "Lightning Strikes",
  },
  {
    id: 5,
    itemNumber: "2E000160 EXXXSPBGCA",
    name: "White Sapphire, Spinel & Diamond Earrings",
    des: "White Sapphire and Spinel earrings in blackened gold explore cosmic origins, blending myth, craftsmanship, and lightness into sculptural celestial forms.",
    specifications: [
      "2 Spinel 7.88 carat",
      "2 Spinel 7.88 carat",
      "18 Spinel 6.90 carat",
      "415 Diamond 7.45 carat F-G-H VS+",
    ],
    variant1: "18K Black",
    variant2: "Spinel, Sapphire Spinel Diamond",
    msrp: "25500",
    wholesalePrice: "15300",
    images: [Product5Img1, Product5Img2, Product5Img3, Product5Img4],
    videos: ["/products/product5vid1.mp4"],
    category: "Earrings",
    collection: "Collectible Art",
  },
  {
    id: 6,
    itemNumber: "2E000214 EXXXMSBGCA",
    name: "Sapphire Eggs with Diamonds",
    des: "Purple sapphire and Diamond egg forms reflect cosmic origins, uniting myth, rarity, and color symbolism through bold design and refined craftsmanship.",
    specifications: [
      "64 Multi Sapphire 40.53 carat",
      "69 Multi Sapphire 4.60 carat",
      "215 Diamond 4.39 carat F-G-H VS+",
    ],
    variant1: "18K Black",
    variant2: "Muti Sapphire Muti Sapphire Diamond",
    msrp: "26500",
    wholesalePrice: "15900",
    images: [Product6Img1],
    videos: [],
    category: "Earrings",
    collection: "Collectible Art",
  },
  {
    id: 7,
    itemNumber: "2E000227 EXXXMSBGCA",
    name: "Multi Sapphire & Diamond Earrings",
    des: "Multi-sapphire and Diamond earrings feature a deep concave design, showcasing vibrant gemstone arrangement and masterful craftsmanship in black gold.",
    specifications: ["Sapphire 34.89 carat", "Diamond 4.11 carat"],
    variant1: "18K Black",
    variant2: "Sapphire Diamond",
    msrp: "28800",
    wholesalePrice: "17280",
    images: [Product7Img1, Product7Img2, Product7Img3, Product7Img4],
    videos: ["/products/product7vid1.mp4"],
    category: "Earrings",
    collection: "Undefined",
  },
  {
    id: 8,
    itemNumber: "2E000234 EXXXTSBGCA",
    name: "Tsavorite Stain Glass Window Earrings",
    des: "Earrings inspired by stained glass feature flat stones, mismatched shapes, reverse-set Diamonds, and blackened gold, blending light and intricate craftsmanship.",
    specifications: ["Tsavorite 21.68 carat", "Diamond 4.55 carat F-G-H VS+"],
    variant1: "18K Black",
    variant2: "Tsavorite Diamond",
    msrp: "29500",
    wholesalePrice: "17700",
    images: [Product8Img1, Product8Img2, Product8Img3],
    videos: [],
    category: "Earrings",
    collection: "Collectible Art",
  },
  {
    id: 9,
    itemNumber: "2E000260 EXXXJUTICA",
    name: "Imperial Jade Earrings",
    des: "Egg-shaped earrings combine carved Imperial Jade and Diamonds, symbolizing creation, rebirth, and the cosmic connection between earth and sky.",
    specifications: ["Jade 25.60 carat", "Diamond 5.80 carat"],
    variant1: "Titanium",
    variant2: "Imperial Jade, Diamond",
    msrp: "88000",
    wholesalePrice: "52800",
    images: [Product9Img1, Product9Img2, Product9Img3, Product9Img4],
    videos: ["/products/product9vid1.mp4"],
    category: "Earrings",
    collection: "Collectible Art",
  },
  {
    id: 10,
    itemNumber: "2E000337 EXXXMCTICA",
    name: "Pearl Encased in Emerald & Sapphire Earrings",
    des: "Sculptural earrings blend sapphires, Emeralds, Diamonds, and South Sea Baroque Pearls, celebrating life's joyful, unstructured beauty and vibrant uniqueness.",
    specifications: [
      "Pearl 18.6mm",
      "Emerald 3.04 carat",
      "Sapphire 12.15 carat",
      "Diamond 2.77 carat F-G-H VS+",
    ],
    variant1: "Titanium",
    variant2: "Pearl, Emerald, Sapphire, Diamond",
    msrp: "34500",
    wholesalePrice: "20700",
    images: [Product10Img1],
    videos: ["/products/product10vid1.mp4"],
    category: "Earrings",
    collection: "Collectible Art",
  },
];
