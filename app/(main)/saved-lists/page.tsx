"use client";

import { PlusCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import ContactUs from "@/components/layout/contact-us";
import { Button } from "@/components/ui/button";

interface RequestItem {
  id: number;
  name: string;
  itemNo: string;
  msrp: string;
  stockStatus: string;
  image: string;
  notes?: string;
}

interface SavedList {
  id: string;
  name: string;
  items: RequestItem[];
  createdAt: string;
}

export default function SavedListsPage() {
  const [savedLists, setSavedLists] = useState<SavedList[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchSavedLists = useCallback(async () => {
    try {
      const res = await fetch("/api/saved-lists");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch saved lists");
      }
      setSavedLists(data.data || []);
    } catch (e: unknown) {
      console.error(e);
      const err = e as { message?: string } | null;
      toast.error(err?.message || "Failed to fetch saved lists");
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchSavedLists();
  }, [fetchSavedLists]);

  const handleAddItemsToRequest = async (list: SavedList) => {
    try {
      const stored = localStorage.getItem("request-list");
      let currentItems: RequestItem[] = [];
      if (stored) {
        currentItems = JSON.parse(stored);
      }

      const merged = [...currentItems];
      list.items.forEach((item) => {
        if (!merged.some((m) => m.id === item.id)) {
          merged.push(item);
        }
      });

      localStorage.setItem("request-list", JSON.stringify(merged));
      window.dispatchEvent(new Event("request-list-updated"));

      // Delete the list from the database since all items have been moved back
      const res = await fetch(`/api/saved-lists/${list.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete list from saved lists");
      }

      toast.success(`Moved items from "${list.name}" to request list`, {
        position: "top-right",
      });

      // Remove from UI state
      setSavedLists((prev) => prev.filter((item) => item.id !== list.id));
    } catch (e) {
      console.error(e);
      toast.error("Failed to move items to request list");
    }
  };

  const handleAddSingleItemToRequest = async (
    listId: string,
    item: RequestItem,
  ) => {
    try {
      const stored = localStorage.getItem("request-list");
      let currentItems: RequestItem[] = [];
      if (stored) {
        currentItems = JSON.parse(stored);
      }

      if (currentItems.some((m) => m.id === item.id)) {
        toast.error(`"${item.name}" is already in your request list`, {
          position: "top-right",
        });
        return;
      }

      // Add to request list
      const updated = [...currentItems, item];
      localStorage.setItem("request-list", JSON.stringify(updated));
      window.dispatchEvent(new Event("request-list-updated"));
      toast.success(`Added "${item.name}" to request list`, {
        position: "top-right",
      });

      // Remove from saved list
      await handleRemoveItem(listId, item.id);
    } catch (e) {
      console.error(e);
      toast.error("Failed to move item to request list");
    }
  };

  const handleRemoveItem = async (listId: string, itemId: number) => {
    try {
      const targetList = savedLists.find((list) => list.id === listId);
      if (!targetList) return;

      const updatedItems = targetList.items.filter(
        (item) => item.id !== itemId,
      );

      if (updatedItems.length === 0) {
        // Automatically delete empty list from database
        const res = await fetch(`/api/saved-lists/${listId}`, {
          method: "DELETE",
        });
        if (!res.ok) {
          throw new Error("Failed to delete empty saved list");
        }
        setSavedLists((prev) => prev.filter((list) => list.id !== listId));
      } else {
        // Update list items in database
        const res = await fetch(`/api/saved-lists/${listId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: updatedItems,
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to update saved list");
        }

        setSavedLists((prev) =>
          prev.map((list) =>
            list.id === listId ? { ...list, items: updatedItems } : list,
          ),
        );
      }
    } catch (e: unknown) {
      console.error(e);
      const err = e as { message?: string } | null;
      toast.error(err?.message || "Failed to remove product from saved list");
    }
  };

  if (!isLoaded) {
    return (
      <main className="py-15 min-h-[60vh] flex items-center justify-center bg-white">
        <p className="text-gray-400 font-light text-lg">
          Loading saved lists...
        </p>
      </main>
    );
  }

  return (
    <main className="py-15 space-y-25">
      <div className="app_container space-y-10">
        <section className="space-y-6 md:space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h1 className="capitalize">Saved Lists</h1>
            <div className="flex gap-4 md:gap-6">
              <Link href="/request-list">
                <Button variant="outline" size="lg">
                  Request List
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {savedLists.length === 0 ? (
          <section className="py-20 flex flex-col items-center justify-center space-y-6 border border-black/10">
            <p className="text-gray-400 text-lg font-light">
              You don't have any saved lists.
            </p>
            <Link href="/">
              <Button variant="outline" size="lg" className="px-10 h-12">
                Explore Products
              </Button>
            </Link>
          </section>
        ) : (
          <div className="space-y-20">
            {savedLists.map((list) => (
              <section
                key={list.id}
                className="space-y-6 border-b border-black/10 pb-16 last:border-b-0 last:pb-0"
              >
                {list.items.length === 0 ? (
                  <div className="py-10 text-center border border-dashed border-black/10 text-gray-400 text-sm">
                    No items in this saved list.
                  </div>
                ) : (
                  <>
                    {/* Desktop Tabular view */}
                    <div className="hidden md:block border border-black/10">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-black/10">
                            <th className="font-normal text-sm text-gray-400 py-4 px-6">
                              Product Name
                            </th>
                            <th className="font-normal text-sm text-gray-400 py-4 px-6">
                              Retail Price
                            </th>
                            <th className="font-normal text-sm text-gray-400 py-4 px-6">
                              Stock Status
                            </th>
                            <th className="font-normal text-sm text-gray-400 py-4 px-6">
                              Notes
                            </th>
                            <th className="py-4 px-6"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {list.items.map((product) => (
                            <tr
                              key={product.id}
                              className="border-b border-black/10 last:border-0"
                            >
                              <td className="p-6 align-top">
                                <div className="flex gap-6">
                                  <div className="bg-gray-50 p-2 flex items-center justify-center size-24 shrink-0 relative">
                                    <Image
                                      src={product.image}
                                      alt={product.name}
                                      fill
                                      sizes="96px"
                                      className="object-contain p-2"
                                    />
                                  </div>
                                  <div className="space-y-1 pt-1">
                                    <Link
                                      href={`/products/${product.id}`}
                                      className="text-gray-800 text-base max-w-48 leading-snug hover:text-[#45521a] transition-colors hover:underline block"
                                    >
                                      {product.name}
                                    </Link>
                                    <p className="text-xs text-gray-400 pt-2">
                                      Item no : {product.itemNo}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="p-6 align-top">
                                <p className="text-gray-800 pt-1 text-sm">
                                  {product.msrp}
                                </p>
                              </td>
                              <td className="p-6 align-top">
                                <p
                                  className={`pt-1 text-sm ${
                                    product.stockStatus === "In Stock"
                                      ? "text-green-600"
                                      : "text-red-500"
                                  }`}
                                >
                                  {product.stockStatus}
                                </p>
                              </td>
                              <td className="p-6 align-top">
                                <div className="pt-1 max-w-sm space-y-2">
                                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap break-words">
                                    {product.notes || "—"}
                                  </p>
                                </div>
                              </td>
                              <td className="p-6 align-top text-right">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleAddSingleItemToRequest(
                                        list.id,
                                        product,
                                      )
                                    }
                                    className="hover:text-green-600 transition-colors"
                                    title="Add back to request list"
                                  >
                                    <PlusCircle
                                      className="size-5"
                                      strokeWidth={1.5}
                                    />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      handleRemoveItem(list.id, product.id)
                                    }
                                    className="hover:text-red-500 transition-colors"
                                    title="Remove from saved list"
                                  >
                                    <Trash2
                                      className="size-5"
                                      strokeWidth={1.5}
                                    />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card view */}
                    <div className="md:hidden space-y-6">
                      {list.items.map((product) => (
                        <div
                          key={product.id}
                          className="border border-black/10 p-5 space-y-5 relative"
                        >
                          <div className="absolute top-2 right-2 flex gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleAddSingleItemToRequest(list.id, product)
                              }
                              className="hover:text-green-600 transition-colors"
                              title="Add back to request list"
                            >
                              <PlusCircle
                                className="size-5"
                                strokeWidth={1.5}
                              />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleRemoveItem(list.id, product.id)
                              }
                              className="hover:text-red-500 transition-colors"
                              title="Remove from saved list"
                            >
                              <Trash2 className="size-5" strokeWidth={1.5} />
                            </Button>
                          </div>
                          <div className="flex gap-5">
                            <div className="bg-gray-50 p-2 flex items-center justify-center size-36 shrink-0 relative">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                sizes="144px"
                                className="object-contain p-4"
                              />
                            </div>
                            <div className="space-y-2 pt-1">
                              <Link
                                href={`/products/${product.id}`}
                                className="text-gray-900 text-lg font-medium leading-tight hover:text-[#45521a] transition-colors hover:underline block"
                              >
                                {product.name}
                              </Link>
                              <p className="text-xs text-gray-400">
                                Item no : {product.itemNo}
                              </p>
                              <p className="text-base text-gray-900 font-medium pt-1">
                                Retail Price : {product.msrp}
                              </p>
                              <p
                                className={`text-sm ${
                                  product.stockStatus === "In Stock"
                                    ? "text-green-600"
                                    : "text-red-500"
                                }`}
                              >
                                {product.stockStatus}
                              </p>
                            </div>
                          </div>
                          {product.notes && (
                            <div className="pt-1">
                              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap break-words">
                                Notes: {product.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* List Action Button (Only Add to Request List under the table) */}
                {list.items.length > 0 && (
                  <div className="flex justify-end mt-6">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full md:w-60 h-14 text-lg md:text-base"
                      onClick={() => handleAddItemsToRequest(list)}
                    >
                      Add to Request List
                    </Button>
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
        <ContactUs />
      </div>
    </main>
  );
}
