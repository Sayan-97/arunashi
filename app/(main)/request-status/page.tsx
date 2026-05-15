import { PlusCircle } from "lucide-react";
import Image from "next/image";
import ContactUs from "@/components/layout/contact-us";
import { Button } from "@/components/ui/button";
import { requestedProducts } from "@/constants";

export default function RequestStatus() {
  return (
    <main className="py-15 space-y-25">
      <div className="space-y-10">
        <section className="app_container space-y-10">
          <h1 className="uppercase">Request status</h1>
        </section>

        <section className="app_container">
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
                  <th className="font-normal text-sm text-gray-400 py-4 px-6 text-right">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {requestedProducts.map((product, index) => {
                  const status = index === 2 ? "APPROVED" : "PENDING";

                  return (
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
                        <div className="pt-1 max-w-sm">
                          {product.notes ? (
                            <p className="text-gray-600 text-sm leading-relaxed">
                              {product.notes}
                            </p>
                          ) : (
                            <Button
                              variant="ghost"
                              className="text-highlight p-0 h-auto hover:bg-transparent"
                            >
                              <PlusCircle
                                className="size-5"
                                strokeWidth={1.5}
                              />
                              <span className="text-sm">Add Notes</span>
                            </Button>
                          )}
                        </div>
                      </td>
                      <td className="p-6 align-top text-right">
                        <div className="pt-1 flex justify-end">
                          <div
                            className={`inline-block px-4 py-2 text-sm font-medium ${
                              status === "APPROVED"
                                ? "bg-green-200/50 text-green-700"
                                : "bg-[#fff4cc] text-gray-800"
                            }`}
                          >
                            {status}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <ContactUs />
    </main>
  );
}
