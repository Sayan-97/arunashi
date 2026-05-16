"use client";

import { Search as SearchIcon, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { productsData, searchPages, searchSuggestions } from "@/constants";
import { Button } from "../ui/button";

export default function Search() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

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

  const onClose = () => setIsOpen(false);
  const showDropdown = query.length > 0;

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
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
                    className="w-full h-full border border-[#e5e5e5] bg-white pl-4 pr-12 text-[#333] outline-none focus:border-[#d9df85] transition-colors"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
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
            <div className="relative w-full bg-white shadow-xl z-10 border-t border-[#f0f0f0]">
              <div className="app_container py-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20">
                  <div className="space-y-10">
                    <div>
                      <h3 className="text-[12px] font-medium tracking-widest text-[#a0a0a0] uppercase mb-6">
                        Suggestions
                      </h3>
                      <ul className="space-y-5 text-[15px] text-[#333]">
                        {searchSuggestions.map((suggestion) => {
                          const lowerQuery = query.toLowerCase();
                          const parts = suggestion.split(
                            new RegExp(`(${query})`, "gi"),
                          );

                          return (
                            <li key={suggestion}>
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
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-[12px] font-medium tracking-widest text-[#a0a0a0] uppercase mb-6">
                        Pages
                      </h3>
                      <ul className="space-y-5 text-[15px] text-[#333]">
                        {searchPages.map((page) => (
                          <li key={page.title}>{page.title}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-[12px] font-medium tracking-widest text-[#a0a0a0] uppercase mb-6">
                      Products
                    </h3>
                    <ul className="space-y-6">
                      {productsData.slice(0, 3).map((product) => (
                        <li
                          key={product.id}
                          className="flex items-center gap-6"
                        >
                          <div className="size-15 bg-black flex items-center justify-center relative shrink-0">
                            <Image
                              src={product.featuredImage}
                              alt={product.name}
                              fill
                              className="object-contain p-1"
                            />
                          </div>
                          <span className="text-[15px] text-[#333]">
                            {product.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#f0f0f0] bg-white">
                <div className="app_container py-6">
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-auto p-0 text-[15px] text-[#333] hover:text-[#d9df85] hover:bg-transparent"
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
