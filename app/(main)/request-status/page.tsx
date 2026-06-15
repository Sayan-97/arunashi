import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import ContactUs from "@/components/layout/contact-us";
import { Button } from "@/components/ui/button";
import { getMyRequests } from "@/services/products";

export const dynamic = "force-dynamic";

interface RequestedProductItem {
  id: number;
  name: string;
  itemNo: string;
  msrp: string;
  stockStatus: string;
  image: string;
  notes?: string;
  requestId: string;
  requestStatus: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export default async function RequestStatus() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("arunashiAccessToken")?.value;
  const adminAccessToken = cookieStore.get("arunashiAdminAccessToken")?.value;

  console.log("--- [DEBUG] RequestStatus Page Load ---");
  console.log("arunashiAccessToken cookie exists:", !!accessToken);
  console.log("arunashiAdminAccessToken cookie exists:", !!adminAccessToken);

  // Prioritize arunashiAccessToken (retailer) over arunashiAdminAccessToken (admin)
  const cookieHeader = accessToken
    ? `arunashiAccessToken=${accessToken}`
    : adminAccessToken
      ? `arunashiAdminAccessToken=${adminAccessToken}`
      : "";

  console.log(
    "Formatted cookieHeader:",
    cookieHeader
      ? `${cookieHeader.split("=")[0]}=${cookieHeader.split("=")[1].substring(0, 15)}...`
      : "NONE",
  );

  if (!cookieHeader) {
    console.log("[DEBUG] No token found, redirecting to /login");
    redirect("/login");
  }

  let requests: any[] = [];
  try {
    requests = await getMyRequests(cookieHeader);
    console.log("[DEBUG] Fetch requests count:", requests.length);
  } catch (err: any) {
    console.log("[DEBUG] Fetch requests threw error:", err.message);
    if (err.message === "Unauthorized") {
      redirect("/login");
    }
    throw err;
  }

  // Flatten the requests to list each product separately with its request's status
  const requestedProductsList: RequestedProductItem[] = requests.flatMap(
    (req: any) =>
      (req.items || []).map((item: any) => ({
        ...item,
        requestId: req.id,
        requestStatus: req.status as "PENDING" | "APPROVED" | "REJECTED",
        createdAt: req.createdAt,
      })),
  );

  if (requestedProductsList.length === 0) {
    return (
      <main className="py-15 min-h-[65vh] flex flex-col items-center justify-center bg-white space-y-6">
        <h1 className="uppercase tracking-widest text-3xl font-light">
          Request Status
        </h1>
        <p className="text-gray-400 text-lg font-light">
          You have not submitted any request lists yet.
        </p>
        <Link href="/">
          <Button variant="outline" size="lg" className="px-10 h-12">
            Explore Products
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="py-15 space-y-25">
      <div className="app_container space-y-10">
        <section className="space-y-10">
          <h1 className="uppercase">Request status</h1>
        </section>

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
                  <th className="font-normal text-sm text-gray-400 py-4 px-6 text-right">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {requestedProductsList.map((product) => {
                  const status = product.requestStatus;

                  return (
                    <tr
                      key={`${product.requestId}-${product.id}`}
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
                            <p className="text-[10px] text-gray-300">
                              Submitted:{" "}
                              {new Date(product.createdAt).toLocaleDateString()}
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
                            <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap break-words">
                              {product.notes}
                            </p>
                          ) : (
                            <p>-</p>
                          )}
                        </div>
                      </td>
                      <td className="p-6 align-top text-right">
                        <div className="pt-1 flex justify-end">
                          <div
                            className={`inline-block px-4 py-2 text-sm font-medium tracking-wide ${
                              status === "APPROVED"
                                ? "bg-green-200/50 text-green-700"
                                : status === "REJECTED"
                                  ? "bg-red-100 text-red-600"
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

          {/* Mobile Card View */}
          <div className="md:hidden space-y-6">
            {requestedProductsList.map((product) => {
              const status = product.requestStatus;
              return (
                <div
                  key={`${product.requestId}-${product.id}`}
                  className="border border-black/10 p-5 space-y-5"
                >
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
                      <p className="text-[10px] text-gray-400">
                        Submitted:{" "}
                        {new Date(product.createdAt).toLocaleDateString()}
                      </p>
                      <div
                        className={`inline-block px-4 py-2 text-sm font-medium mt-1 ${
                          status === "APPROVED"
                            ? "bg-green-200/50 text-green-700"
                            : status === "REJECTED"
                              ? "bg-red-100 text-red-600"
                              : "bg-[#fff4cc] text-gray-800"
                        }`}
                      >
                        {status}
                      </div>
                    </div>
                  </div>

                  <div className="pt-1">
                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap break-words">
                      Notes:{" "}
                      {product.notes || (
                        <span className="text-highlight">-</span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <ContactUs />
      </div>
    </main>
  );
}
