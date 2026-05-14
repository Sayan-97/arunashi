import { AlertCircle, PlusCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { requestedProducts } from "@/constants";

export default function RequestListPage() {
  return (
    <main className="py-15">
      <section className="app_container space-y-10">
        <div className="flex items-center justify-between">
          <h1>Request List</h1>
          <div className="space-x-6">
            <Button variant="outline" size="lg">
              Request Status
            </Button>
            <Button variant="outline" size="lg">
              Saved Lists
            </Button>
          </div>
        </div>
        <div>
          <p className="text-2xl font-medium">Requested Products (4)</p>
          <p className="flex items-center gap-2 text-sm text-yellow-600 mt-3">
            <AlertCircle className="size-4.5" strokeWidth={1.5} />
            In-stock pieces may not be immediately available for viewing
          </p>
        </div>
      </section>

      <section className="app_container space-y-10 mt-10">
        <div className="border border-black/10">
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
              {requestedProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-black/10 last:border-0"
                >
                  <td className="p-6 align-top">
                    <div className="flex gap-6">
                      <div className="bg-gray-50 p-2 flex items-center justify-center size-24 shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={70}
                          height={70}
                          className="object-contain"
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
                    <p className="text-gray-800 pt-1 text-sm">{product.msrp}</p>
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
                    <div className="pt-1 max-w-sm">
                      {product.notes ? (
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {product.notes}
                        </p>
                      ) : (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" className="text-highlight">
                              <PlusCircle
                                className="size-5"
                                strokeWidth={1.5}
                              />
                              <span className="text-sm">Add Notes</span>
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-lg">
                            <DialogHeader>
                              <DialogTitle>Add Note</DialogTitle>
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
                                  className="min-h-[100px] w-full min-w-0 border border-input bg-input px-3 py-2 text-base transition-colors outline-none placeholder:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                  placeholder="Enter your note here..."
                                />
                              </div>
                            </div>
                            <DialogFooter className="border-t-0 bg-transparent">
                              <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                              </DialogClose>
                              <Button>Add</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </td>
                  <td className="p-6 align-top text-right">
                    <Button
                      variant="ghost"
                      size="icon"
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

        <div className="flex justify-end gap-6">
          <Button variant="outline" size="lg" className="lg:w-60">
            Save List
          </Button>
          <Button variant="outline" size="lg" className="lg:w-60">
            Submit Request
          </Button>
        </div>
      </section>
    </main>
  );
}
