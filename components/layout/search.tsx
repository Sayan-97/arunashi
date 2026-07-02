"use client";

import { Search as SearchIcon, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "@/constants";
import { mapShopifyProduct, type ShopifyProduct } from "@/services/products";
import { Button } from "../ui/button";

interface Gemstone {
  id: string;
  name: string;
  link: string;
}

interface Diamond {
  id: string;
  name: string;
  link: string;
}

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [gemstones, setGemstones] = useState<Gemstone[]>([]);
  const [diamonds, setDiamonds] = useState<Diamond[]>([]);

  const [dynamicSuggestions, setDynamicSuggestions] = useState<string[]>([]);
  const [dynamicPages, setDynamicPages] = useState<
    { title: string; href: string }[]
  >([]);

  const [activeIndex, setActiveIndex] = useState(-1);

  const onClose = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((res) => res.json()),
      fetch("/api/gemstones").then((res) => res.json()),
      fetch("/api/diamonds").then((res) => res.json()),
    ])
      .then(([productsJson, gemstonesJson, diamondsJson]) => {
        const allProducts: ShopifyProduct[] = productsJson.data || [];
        const filtered = allProducts.map(mapShopifyProduct);
        setProducts(filtered);

        const allGemstones: Gemstone[] = gemstonesJson.data || [];
        setGemstones(allGemstones);

        const allDiamonds: Diamond[] = diamondsJson.data || [];
        setDiamonds(allDiamonds);

        // Generate dynamic suggestions and pages
        const uniqueCollections = new Map<
          string,
          { title: string; handle: string }
        >();
        const uniqueCategories = new Set<string>();

        filtered.forEach((p) => {
          if (
            p.category &&
            p.category !== "Undefined" &&
            p.category !== "Jewelry"
          ) {
            uniqueCategories.add(p.category);
          }
          if (p.collections) {
            p.collections.forEach((c) => {
              uniqueCollections.set(c.title, c);
            });
          }
        });

        const suggestions = [
          ...Array.from(uniqueCategories),
          ...Array.from(uniqueCollections.values()).map((c) => c.title),
          ...allGemstones.map((g) => g.name),
          ...allDiamonds.map((d) => d.name),
        ];

        setDynamicSuggestions(Array.from(new Set(suggestions)));

        const pages: { title: string; href: string }[] = [
          { title: "Gemstones", href: "/gemstones" },
          { title: "Diamond Shapes & Colors", href: "/diamonds" },
          { title: "Latest Magazines", href: "/magazines" },
        ];

        Array.from(uniqueCollections.values()).forEach((c) => {
          pages.push({
            title: c.title,
            href: `/collections/${c.handle}`,
          });
        });

        Array.from(uniqueCategories).forEach((cat) => {
          pages.push({
            title: cat,
            href: `/categories/${cat.toLowerCase().replace(/\s+/g, "-")}`,
          });
        });

        setDynamicPages(pages);
      })
      .catch((err) => console.error("Error fetching search data:", err));
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle Escape key to close the drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Reset activeIndex when query changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: reset activeIndex on query changes
  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  const showDropdown = query.length > 0;
  const q = query.toLowerCase();

  // Filters with sorting preference for "startsWith" and "word startsWith"
  const filteredSuggestions = dynamicSuggestions
    .filter((suggestion) => suggestion.toLowerCase().includes(q))
    .sort((a, b) => {
      const aStarts = a.toLowerCase().startsWith(q);
      const bStarts = b.toLowerCase().startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return 0;
    });

  const filteredPages = dynamicPages
    .filter((page) => page.title.toLowerCase().includes(q))
    .sort((a, b) => {
      const aStarts = a.title.toLowerCase().startsWith(q);
      const bStarts = b.title.toLowerCase().startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return 0;
    });

  const filteredProducts = products
    .filter((product) => {
      return (
        product.name?.toLowerCase().includes(q) ||
        product.category?.toLowerCase().includes(q) ||
        product.collection?.toLowerCase().includes(q) ||
        (product.gemstoneDetails &&
          product.gemstoneDetails.toLowerCase().includes(q)) ||
        (product.diamondShapeDetails &&
          product.diamondShapeDetails.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      const aName = a.name?.toLowerCase() || "";
      const bName = b.name?.toLowerCase() || "";

      // 1. Starts with query
      const aStarts = aName.startsWith(q);
      const bStarts = bName.startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;

      // 2. Contains query as word prefix
      const aWordPrefix = aName.split(" ").some((w) => w.startsWith(q));
      const bWordPrefix = bName.split(" ").some((w) => w.startsWith(q));
      if (aWordPrefix && !bWordPrefix) return -1;
      if (!aWordPrefix && bWordPrefix) return 1;

      // 3. Name contains query
      const aNameContains = aName.includes(q);
      const bNameContains = bName.includes(q);
      if (aNameContains && !bNameContains) return -1;
      if (!aNameContains && bNameContains) return 1;

      return 0;
    });

  const filteredGemstones = gemstones
    .filter((gem) => gem.name.toLowerCase().includes(q))
    .sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const aStarts = aName.startsWith(q);
      const bStarts = bName.startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return aName.localeCompare(bName);
    });

  const filteredDiamonds = diamonds
    .filter((dia) => dia.name.toLowerCase().includes(q))
    .sort((a, b) => {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      const aStarts = aName.startsWith(q);
      const bStarts = bName.startsWith(q);
      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return aName.localeCompare(bName);
    });

  // Flat list of visible navigatable items for Arrow keyboard navigation
  const visibleItems = [
    ...filteredSuggestions.slice(0, 5).map((item) => ({
      type: "suggestion" as const,
      key: `suggestion-${item}`,
      value: item,
      href: null,
    })),
    ...filteredPages.slice(0, 5).map((item) => ({
      type: "page" as const,
      key: `page-${item.title}`,
      value: item.title,
      href: item.href,
    })),
    ...filteredProducts.slice(0, 5).map((item) => ({
      type: "product" as const,
      key: `product-${item.id}`,
      value: item.name,
      href: `/products/${item.id}`,
    })),
    ...filteredGemstones.slice(0, 5).map((item) => ({
      type: "gemstone" as const,
      key: `gemstone-${item.id}`,
      value: item.name,
      href: `/gemstones?id=${item.id}`,
    })),
    ...filteredDiamonds.slice(0, 5).map((item) => ({
      type: "diamond" as const,
      key: `diamond-${item.id}`,
      value: item.name,
      href: `/diamonds?id=${item.id}`,
    })),
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < visibleItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : visibleItems.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < visibleItems.length) {
        const item = visibleItems[activeIndex];
        if (item.type === "suggestion") {
          setQuery(item.value);
          setActiveIndex(-1);
          inputRef.current?.focus();
        } else if (item.href) {
          onClose();
          router.push(item.href);
        }
      } else {
        // Fallback: search/navigate to first matching link result if available
        const firstLink = visibleItems.find(
          (item) => item.type !== "suggestion",
        );
        if (firstLink?.href) {
          onClose();
          router.push(firstLink.href);
        }
      }
    }
  };

  let itemCounter = 0;

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
      >
        <SearchIcon className="size-6" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex flex-col items-center animate-in fade-in duration-300">
          <button
            type="button"
            className="absolute inset-0 bg-black/60 w-full h-full border-none cursor-default"
            onClick={onClose}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") onClose();
            }}
            aria-label="Close search"
          />

          <div className="w-full bg-secondary relative z-10">
            <div className="w-full h-[121px] flex items-center justify-center app_container">
              <div className="w-full max-w-[600px] flex items-center gap-4">
                <div className="relative w-full h-12">
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full h-full border border-[#e5e5e5] bg-white pl-4 pr-12 text-[#333] outline-none focus:border-[#d9df85] transition-colors"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const firstLink = visibleItems.find(
                        (item) => item.type !== "suggestion",
                      );
                      if (firstLink?.href) {
                        onClose();
                        router.push(firstLink.href);
                      }
                    }}
                    className="absolute right-0 top-0 h-full w-12 text-black hover:text-[#d9df85]"
                  >
                    <SearchIcon className="w-5 h-5" strokeWidth={1.5} />
                  </Button>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setQuery("");
                    onClose();
                  }}
                  className="text-black"
                >
                  <X className="w-6 h-6" strokeWidth={1.5} />
                </Button>
              </div>
            </div>
          </div>

          {showDropdown && (
            <div className="relative w-full bg-white shadow-xl z-10 border-t border-[#f0f0f0] max-h-[calc(100vh-121px)] overflow-y-auto">
              <div className="app_container py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
                  {/* Column 1: Suggestions and Pages */}
                  <div className="space-y-10">
                    <div>
                      <h3 className="text-[12px] font-medium tracking-widest text-[#a0a0a0] uppercase mb-6">
                        Suggestions
                      </h3>
                      {filteredSuggestions.length === 0 ? (
                        <p className="text-[14px] text-gray-400 italic">
                          No matching suggestions
                        </p>
                      ) : (
                        <ul className="space-y-3 text-[15px] text-[#333]">
                          {filteredSuggestions.slice(0, 5).map((suggestion) => {
                            const lowerQuery = query.toLowerCase();
                            const parts = suggestion.split(
                              new RegExp(`(${query})`, "gi"),
                            );
                            const currentItemIndex = itemCounter++;
                            const isActive = currentItemIndex === activeIndex;

                            return (
                              <li key={suggestion}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setQuery(suggestion);
                                    inputRef.current?.focus();
                                  }}
                                  className={`text-left w-full transition-colors cursor-pointer block p-2 rounded-sm ${isActive ? "bg-primary/20 text-[#627426] font-semibold animate-pulse" : "hover:text-[#627426]"}`}
                                >
                                  {parts.map((part, i) => {
                                    const key = `${suggestion}-${i}`;
                                    return (
                                      <span
                                        key={key}
                                        className={
                                          part.toLowerCase() === lowerQuery
                                            ? "font-normal"
                                            : "font-bold"
                                        }
                                      >
                                        {part}
                                      </span>
                                    );
                                  })}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>

                    <div>
                      <h3 className="text-[12px] font-medium tracking-widest text-[#a0a0a0] uppercase mb-6">
                        Pages
                      </h3>
                      {filteredPages.length === 0 ? (
                        <p className="text-[14px] text-gray-400 italic">
                          No matching pages
                        </p>
                      ) : (
                        <ul className="space-y-3 text-[15px] text-[#333]">
                          {filteredPages.slice(0, 5).map((page) => {
                            const currentItemIndex = itemCounter++;
                            const isActive = currentItemIndex === activeIndex;

                            return (
                              <li key={page.title}>
                                <Link
                                  href={page.href}
                                  onClick={onClose}
                                  className={`block font-medium p-2 rounded-sm transition-colors ${isActive ? "bg-primary/20 text-[#627426] font-semibold" : "hover:text-[#627426]"}`}
                                >
                                  {page.title}
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Column 2: Products */}
                  <div>
                    <h3 className="text-[12px] font-medium tracking-widest text-[#a0a0a0] uppercase mb-6">
                      Products
                    </h3>
                    {filteredProducts.length === 0 ? (
                      <p className="text-[14px] text-gray-400 italic">
                        No matching products
                      </p>
                    ) : (
                      <ul className="space-y-4">
                        {filteredProducts.slice(0, 5).map((product) => {
                          const currentItemIndex = itemCounter++;
                          const isActive = currentItemIndex === activeIndex;

                          return (
                            <li key={product.id}>
                              <Link
                                href={`/products/${product.id}`}
                                onClick={onClose}
                                className={`flex items-center gap-6 group p-2 rounded-sm transition-colors ${isActive ? "bg-primary/20 text-[#627426]" : ""}`}
                              >
                                <div className="size-15 bg-black flex items-center justify-center relative shrink-0 border border-gray-100 rounded-sm overflow-hidden animate-fade-in duration-300">
                                  <Image
                                    src={
                                      product.images &&
                                      product.images.length > 0
                                        ? product.images[0]
                                        : product.featuredImage
                                          ? (product.featuredImage as string)
                                          : ""
                                    }
                                    alt={product.name || "Product"}
                                    fill
                                    className="object-contain p-1"
                                  />
                                </div>
                                <span className="text-[15px] text-[#333] group-hover:text-[#627426] transition-colors font-medium">
                                  {product.name}
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>

                  {/* Column 3: Gemstones & Diamonds */}
                  <div className="space-y-10">
                    <div>
                      <h3 className="text-[12px] font-medium tracking-widest text-[#a0a0a0] uppercase mb-6">
                        Gemstones
                      </h3>
                      {filteredGemstones.length === 0 ? (
                        <p className="text-[14px] text-gray-400 italic">
                          No matching gemstones
                        </p>
                      ) : (
                        <ul className="space-y-3">
                          {filteredGemstones.slice(0, 5).map((gem) => {
                            const currentItemIndex = itemCounter++;
                            const isActive = currentItemIndex === activeIndex;

                            return (
                              <li key={gem.id}>
                                <Link
                                  href={`/gemstones?id=${gem.id}`}
                                  onClick={onClose}
                                  className={`flex items-center gap-3 p-2 rounded-sm transition-colors ${isActive ? "bg-primary/20 text-[#627426] font-semibold" : "hover:text-[#627426]"}`}
                                >
                                  <span className="size-1.5 bg-foreground rounded-full shrink-0" />
                                  <span className="text-[15px] font-medium">
                                    {gem.name}
                                  </span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>

                    <div>
                      <h3 className="text-[12px] font-medium tracking-widest text-[#a0a0a0] uppercase mb-6">
                        Diamond Shapes
                      </h3>
                      {filteredDiamonds.length === 0 ? (
                        <p className="text-[14px] text-gray-400 italic">
                          No matching diamond shapes
                        </p>
                      ) : (
                        <ul className="space-y-3">
                          {filteredDiamonds.slice(0, 5).map((dia) => {
                            const currentItemIndex = itemCounter++;
                            const isActive = currentItemIndex === activeIndex;

                            return (
                              <li key={dia.id}>
                                <Link
                                  href={`/diamonds?id=${dia.id}`}
                                  onClick={onClose}
                                  className={`flex items-center gap-3 p-2 rounded-sm transition-colors ${isActive ? "bg-primary/20 text-[#627426] font-semibold" : "hover:text-[#627426]"}`}
                                >
                                  <span className="size-1.5 bg-foreground rounded-full shrink-0" />
                                  <span className="text-[15px] font-medium">
                                    {dia.name}
                                  </span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#f0f0f0] bg-white">
                <div className="app_container py-6">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      const firstLink = visibleItems.find(
                        (item) => item.type !== "suggestion",
                      );
                      if (firstLink?.href) {
                        onClose();
                        router.push(firstLink.href);
                      } else {
                        inputRef.current?.focus();
                      }
                    }}
                    className="h-auto p-0 text-[15px] text-[#333] hover:text-[#627426] hover:bg-transparent cursor-pointer font-medium"
                  >
                    Search for &quot;{query}&quot;
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
