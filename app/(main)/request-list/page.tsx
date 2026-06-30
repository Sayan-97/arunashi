"use client";

import { AlertCircle, Check, PlusCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ContactUs from "@/components/layout/contact-us";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface RequestItem {
  id: number;
  name: string;
  itemNo: string;
  msrp: string;
  stockStatus: string;
  image: string;
  notes?: string;
}

export default function RequestListPage() {
  const [requestedItems, setRequestedItems] = useState<RequestItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [listName, setListName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenSaveDialog = () => {
    const defaultName = `Saved List - ${new Date().toLocaleDateString()}`;
    setListName(defaultName);
    setIsSaveDialogOpen(true);
  };

  const handleSaveList = async () => {
    if (!listName.trim()) {
      toast.error("Please enter a list name");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/saved-lists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: listName.trim(),
          items: requestedItems,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to save request list");
      }

      toast.success("List saved successfully", {
        position: "top-right",
      });
      setIsSaveDialogOpen(false);
    } catch (e: unknown) {
      console.error(e);
      const err = e as { message?: string } | null;
      toast.error(err?.message || "Failed to save request list");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitRequest = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/products/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: requestedItems,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit request");
      }

      // Clear localStorage
      localStorage.removeItem("request-list");
      window.dispatchEvent(new Event("request-list-updated"));
      setRequestedItems([]);
      setIsSubmitDialogOpen(true);
      toast.success("Request submitted successfully", {
        position: "top-right",
      });
    } catch (e: unknown) {
      console.error(e);
      const err = e as { message?: string } | null;
      toast.error(err?.message || "Failed to submit request", {
        position: "top-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    try {
      const stored = localStorage.getItem("request-list");
      if (stored) {
        setRequestedItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load request list:", e);
    }
    setIsLoaded(true);
  }, []);

  const handleRemove = (id: number) => {
    const updated = requestedItems.filter((item) => item.id !== id);
    setRequestedItems(updated);
    localStorage.setItem("request-list", JSON.stringify(updated));
    window.dispatchEvent(new Event("request-list-updated"));
    toast.success("Product removed from request list", {
      position: "top-right",
    });
  };

  const handleSaveNote = (id: number, noteText: string) => {
    const updated = requestedItems.map((item) => {
      if (item.id === id) {
        return { ...item, notes: noteText };
      }
      return item;
    });
    setRequestedItems(updated);
    localStorage.setItem("request-list", JSON.stringify(updated));
    toast.success("Note saved successfully", {
      position: "top-right",
    });
  };

  if (!isLoaded) {
    return (
      <main className="py-15 min-h-[60vh] flex items-center justify-center bg-white">
        <p className="text-gray-400 font-light text-lg">
          Loading your request list...
        </p>
      </main>
    );
  }

  return (
    <main className="py-15 space-y-25">
      <div className="app_container space-y-10">
        <section className="space-y-6 md:space-y-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h1 className="uppercase">Request List</h1>
            <div className="flex gap-4 md:gap-6">
              <Link href="/request-status">
                <Button variant="outline" size="lg">
                  Request Status
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Saved Lists
              </Button>
            </div>
          </div>
          {requestedItems.length > 0 && (
            <div className="space-y-3">
              <p className="text-xl md:text-2xl font-medium">
                Requested Products ({requestedItems.length})
              </p>
              <p className="flex items-center gap-2 text-xs md:text-sm text-yellow-600">
                <AlertCircle className="size-4 md:size-4.5" strokeWidth={1.5} />
                In-stock pieces may not be immediately available for viewing
              </p>
            </div>
          )}
        </section>

        {requestedItems.length === 0 ? (
          <section className="py-20 flex flex-col items-center justify-center space-y-6 border border-black/10">
            <p className="text-gray-400 text-lg font-light">
              Your request list is currently empty.
            </p>
            <Link href="/">
              <Button variant="outline" size="lg" className="px-10 h-12">
                Explore Products
              </Button>
            </Link>
          </section>
        ) : (
          <section className="space-y-6 md:space-y-10">
            {/* Desktop Table View */}
            <div className="hidden md:block border border-black/10">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-black/10">
                    <th className="font-normal text-sm text-gray-400 py-4 px-6">
                      Product Name
                    </th>
                    <th className="font-normal text-sm text-gray-400 py-4 px-6">
                      MSRP
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
                  {requestedItems.map((product) => (
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
                            <p className="text-gray-800 text-base max-w-48 leading-snug">
                              {product.name}
                            </p>
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
                          {product.notes ? (
                            <div>
                              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap break-words">
                                {product.notes}
                              </p>
                              <NoteDialog
                                product={product}
                                onSave={(note) =>
                                  handleSaveNote(product.id, note)
                                }
                                isEdit
                              />
                            </div>
                          ) : (
                            <NoteDialog
                              product={product}
                              onSave={(note) =>
                                handleSaveNote(product.id, note)
                              }
                            />
                          )}
                        </div>
                      </td>
                      <td className="p-6 align-top text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(product.id)}
                          className="hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="size-5" strokeWidth={1.5} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-6">
              {requestedItems.map((product) => (
                <div
                  key={product.id}
                  className="border border-black/10 p-5 space-y-5 relative"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(product.id)}
                    className="absolute top-2 right-2 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="size-5" strokeWidth={1.5} />
                  </Button>
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
                      <p className="text-gray-900 text-lg font-medium leading-tight">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-400">
                        Item no : {product.itemNo}
                      </p>
                      <p className="text-base text-gray-900 font-medium pt-1">
                        MSRP : {product.msrp}
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

                  <div className="pt-1">
                    {product.notes ? (
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap break-words">
                          Notes: {product.notes}
                        </p>
                        <NoteDialog
                          product={product}
                          onSave={(note) => handleSaveNote(product.id, note)}
                          isMobile
                          isEdit
                        />
                      </div>
                    ) : (
                      <NoteDialog
                        product={product}
                        onSave={(note) => handleSaveNote(product.id, note)}
                        isMobile
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col md:flex-row justify-end gap-4 md:gap-6">
              <Button
                variant="outline"
                size="lg"
                className="w-full md:w-60 h-14 text-lg md:text-base"
                onClick={handleOpenSaveDialog}
              >
                Save List
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full md:w-60 h-14 text-lg md:text-base"
                onClick={handleSubmitRequest}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </section>
        )}

        <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
          <DialogContent className="sm:max-w-[771px] p-10 md:p-16">
            <DialogHeader className="items-center text-center space-y-6">
              <div className="size-20 rounded-full border-2 border-primary flex items-center justify-center mb-2">
                <Check className="size-8 text-primary" strokeWidth={1.5} />
              </div>
              <DialogTitle className="text-2xl md:text-[32px] font-medium leading-snug text-gray-900 max-w-xl mx-auto">
                Your Request List has been successfully
                <br />
                submitted to our sales team.
              </DialogTitle>
              <DialogDescription className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto">
                A request list has been emailed to the sales team. We will be in
                touch shortly with next steps.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="border-t-0 bg-transparent sm:justify-center pt-8">
              <DialogClose asChild>
                <Link href="/">
                  <Button variant="outline" size="lg">
                    Continue Browsing
                  </Button>
                </Link>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Save Request List</DialogTitle>
              <DialogDescription>
                Enter a name for this list to save it to your account.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="save-list-name" className="text-sm font-medium">
                  List Name
                </label>
                <input
                  id="save-list-name"
                  type="text"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  className="flex h-10 w-full border border-input bg-input px-3 py-2 text-base transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                  placeholder="e.g. My Favorite Items"
                />
              </div>
            </div>
            <DialogFooter className="border-t-0 bg-transparent gap-2 sm:gap-0">
              <DialogClose asChild>
                <Button variant="outline" disabled={isSaving}>
                  Cancel
                </Button>
              </DialogClose>
              <Button onClick={handleSaveList} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <ContactUs />
      </div>
    </main>
  );
}

function NoteDialog({
  product,
  isMobile,
  onSave,
  isEdit,
}: {
  product: RequestItem;
  isMobile?: boolean;
  onSave: (note: string) => void;
  isEdit?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [noteText, setNoteText] = useState(product.notes || "");

  // Update noteText when product.notes changes (e.g. on external load or remove)
  useEffect(() => {
    setNoteText(product.notes || "");
  }, [product.notes]);

  const handleSave = () => {
    onSave(noteText);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button
            variant="link"
            className="text-highlight p-0 h-auto text-xs underline mt-1 font-light hover:text-black/80 inline-flex items-center"
          >
            Edit Note
          </Button>
        ) : (
          <Button
            variant="ghost"
            className={cn(
              "text-highlight p-0 h-auto hover:bg-transparent inline-flex items-center gap-1.5",
              isMobile ? "font-normal" : "",
            )}
          >
            <PlusCircle
              className={cn(isMobile ? "size-6" : "size-5")}
              strokeWidth={1.5}
            />
            <span className={cn(isMobile ? "text-base" : "text-sm")}>
              Add Notes
            </span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Note" : "Add Note"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label
              htmlFor={`note-${product.id}`}
              className="text-sm font-medium"
            >
              Note
            </label>
            <textarea
              id={`note-${product.id}`}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="min-h-[100px] w-full min-w-0 border border-input bg-input px-3 py-2 text-base transition-colors outline-none placeholder:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
              placeholder="Enter your note here..."
            />
          </div>
        </div>
        <DialogFooter className="border-t-0 bg-transparent gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
