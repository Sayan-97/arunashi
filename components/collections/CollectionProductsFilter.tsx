"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import FilterDropdown from "@/components/layout/filter-dropdown";
import ProductCard from "@/components/shared/product-card";
import type { Product } from "@/constants";

interface CollectionProductsFilterProps {
  initialProducts: Product[];
}

// Helpers to parse specifications defined outside component to be static & reference-stable
const getMetals = (p: Product): string[] => {
  if (!p.specifications) return [];
  const spec = p.specifications.find(
    (s) =>
      s.toLowerCase().startsWith("metal:") ||
      s.toLowerCase().startsWith("material:"),
  );
  if (!spec) return [];
  return spec
    .substring(spec.indexOf(":") + 1)
    .split(",")
    .map((m) => m.trim())
    .filter(Boolean);
};

const getGemstones = (p: Product): string[] => {
  if (!p.specifications) return [];
  const spec = p.specifications.find(
    (s) =>
      s.toLowerCase().startsWith("gemstone:") ||
      s.toLowerCase().startsWith("stones:") ||
      s.toLowerCase().startsWith("stone:"),
  );
  if (!spec) return [];
  return spec
    .substring(spec.indexOf(":") + 1)
    .split(",")
    .map((g) => g.trim())
    .filter(Boolean);
};

const getDiamondShapes = (p: Product): string[] => {
  if (!p.specifications) return [];
  const spec = p.specifications.find(
    (s) =>
      s.toLowerCase().startsWith("diamond shape:") ||
      s.toLowerCase().startsWith("shape:"),
  );
  if (!spec) return [];
  return spec
    .substring(spec.indexOf(":") + 1)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

export default function CollectionProductsFilter({
  initialProducts,
}: CollectionProductsFilterProps) {
  const searchParams = useSearchParams();

  // Local state for snappy UI updates
  const [selectedMetals, _setSelectedMetals] = useState<string[]>([]);
  const [selectedCategories, _setSelectedCategories] = useState<string[]>([]);
  const [selectedGemstones, _setSelectedGemstones] = useState<string[]>([]);
  const [selectedDiamondShapes, _setSelectedDiamondShapes] = useState<string[]>(
    [],
  );
  const [sortSelection, _setSortSelection] = useState<string[]>([]);

  // Sync state with URL search params on mount or when searchParams change (e.g. browser back/forward)
  useEffect(() => {
    const metalVal = searchParams.get("metal");
    _setSelectedMetals(metalVal ? metalVal.split(",") : []);

    const catVal = searchParams.get("category");
    _setSelectedCategories(catVal ? catVal.split(",") : []);

    const gemVal = searchParams.get("gemstone");
    _setSelectedGemstones(gemVal ? gemVal.split(",") : []);

    const shapeVal = searchParams.get("shape");
    _setSelectedDiamondShapes(shapeVal ? shapeVal.split(",") : []);

    const sortVal = searchParams.get("sort");
    _setSortSelection(sortVal ? [sortVal] : []);
  }, [searchParams]);

  // Helper to update URL query params without triggering Next.js server component fetch
  const updateUrlParams = (key: string, values: string[]) => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (values.length > 0) {
        params.set(key, values.join(","));
      } else {
        params.delete(key);
      }
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState(null, "", newUrl);
    }
  };

  const setSelectedMetals = (values: string[]) => {
    _setSelectedMetals(values);
    updateUrlParams("metal", values);
  };

  const setSelectedCategories = (values: string[]) => {
    _setSelectedCategories(values);
    updateUrlParams("category", values);
  };

  const setSelectedGemstones = (values: string[]) => {
    _setSelectedGemstones(values);
    updateUrlParams("gemstone", values);
  };

  const setSelectedDiamondShapes = (values: string[]) => {
    _setSelectedDiamondShapes(values);
    updateUrlParams("shape", values);
  };

  const setSortSelection = (values: string[]) => {
    const lastValue = values.slice(-1);
    _setSortSelection(lastValue);
    updateUrlParams("sort", lastValue);
  };

  // 1. Calculate available filters dynamically based on current collection products
  const filterOptions = useMemo(() => {
    const metalCounts: Record<string, number> = {};
    const categoryCounts: Record<string, number> = {};
    const gemstoneCounts: Record<string, number> = {};
    const shapeCounts: Record<string, number> = {};

    for (const p of initialProducts) {
      // Metal
      const metals = getMetals(p);
      for (const m of metals) {
        metalCounts[m] = (metalCounts[m] || 0) + 1;
      }

      // Category
      if (p.category) {
        const cat = p.category.trim();
        categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
      }

      // Gemstone
      const gemstones = getGemstones(p);
      for (const g of gemstones) {
        gemstoneCounts[g] = (gemstoneCounts[g] || 0) + 1;
      }

      // Diamond Shape
      const shapes = getDiamondShapes(p);
      for (const s of shapes) {
        shapeCounts[s] = (shapeCounts[s] || 0) + 1;
      }
    }

    // Convert to FilterDropdown format (sorting by count descending)
    const metals = Object.entries(metalCounts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);

    const categories = Object.entries(categoryCounts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);

    const gemstones = Object.entries(gemstoneCounts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);

    const shapes = Object.entries(shapeCounts)
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count);

    return { metals, categories, gemstones, shapes };
  }, [initialProducts]);

  // 2. Filter & Sort Products
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Filter by Metal (OR within Category)
    if (selectedMetals.length > 0) {
      result = result.filter((p) => {
        const metals = getMetals(p);
        return metals.some((m) => selectedMetals.includes(m));
      });
    }

    // Filter by Category (OR within Category)
    if (selectedCategories.length > 0) {
      result = result.filter((p) => selectedCategories.includes(p.category));
    }

    // Filter by Gemstone (OR within Category)
    if (selectedGemstones.length > 0) {
      result = result.filter((p) => {
        const gemstones = getGemstones(p);
        return gemstones.some((g) => selectedGemstones.includes(g));
      });
    }

    // Filter by Diamond Shape (OR within Category)
    if (selectedDiamondShapes.length > 0) {
      result = result.filter((p) => {
        const shapes = getDiamondShapes(p);
        return shapes.some((s) => selectedDiamondShapes.includes(s));
      });
    }

    // Apply Sorting
    const sortBy = sortSelection[0] || "";
    if (sortBy === "Price: Low to High") {
      result.sort((a, b) => Number(a.msrp) - Number(b.msrp));
    } else if (sortBy === "Price: High to Low") {
      result.sort((a, b) => Number(b.msrp) - Number(a.msrp));
    } else if (sortBy === "Newest") {
      // Assumes higher IDs are newer, or fallback to default
      result.sort((a, b) => Number(b.id) - Number(a.id));
    }

    return result;
  }, [
    initialProducts,
    selectedMetals,
    selectedCategories,
    selectedGemstones,
    selectedDiamondShapes,
    sortSelection,
  ]);

  return (
    <>
      {/* Filters Section */}
      <section className="app_container flex flex-wrap items-center justify-center gap-4 md:gap-10 mt-15">
        {filterOptions.metals.length > 0 && (
          <FilterDropdown
            label="Metal"
            options={filterOptions.metals}
            selected={selectedMetals}
            onChange={setSelectedMetals}
          />
        )}
        {filterOptions.categories.length > 0 && (
          <FilterDropdown
            label="Category"
            options={filterOptions.categories}
            selected={selectedCategories}
            onChange={setSelectedCategories}
          />
        )}
        {filterOptions.gemstones.length > 0 && (
          <FilterDropdown
            label="Gemstone"
            options={filterOptions.gemstones}
            selected={selectedGemstones}
            onChange={setSelectedGemstones}
          />
        )}
        {filterOptions.shapes.length > 0 && (
          <FilterDropdown
            label="Diamond Shape"
            options={filterOptions.shapes}
            selected={selectedDiamondShapes}
            onChange={setSelectedDiamondShapes}
          />
        )}
        <FilterDropdown
          label="Sort"
          options={[
            { label: "Newest" },
            { label: "Price: Low to High" },
            { label: "Price: High to Low" },
          ]}
          selected={sortSelection}
          onChange={(val) => {
            // Act like a single select by taking the last value
            setSortSelection(val.slice(-1));
          }}
        />
      </section>

      {/* Products Grid */}
      <section className="app_container grid md:grid-cols-2 lg:grid-cols-3 gap-x-11.75 gap-y-15 mt-15">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              image={
                product.images && product.images.length > 0
                  ? product.images[0]
                  : (product.featuredImage as import("next/image").StaticImageData)
              }
              hoverImage={
                product.images && product.images.length > 1
                  ? product.images[1]
                  : undefined
              }
              name={product.name}
              link={`/products/${product.id}`}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-20">
            <p className="text-xl text-gray-500 font-medium">
              No products found matching these filters.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
