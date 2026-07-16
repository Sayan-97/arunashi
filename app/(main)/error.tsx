"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="py-24 text-center select-none">
      <h1 className="font-sans font-medium text-2xl mb-4">
        Something went wrong
      </h1>
      <p className="text-[#868686] mb-8">
        We couldn&apos;t load this page. Please try again.
      </p>
      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={reset}
          className="border border-black px-6 py-2 uppercase text-sm font-semibold tracking-wider hover:bg-black hover:text-white transition-colors cursor-pointer"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="border border-black px-6 py-2 uppercase text-sm font-semibold tracking-wider hover:bg-black hover:text-white transition-colors"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
