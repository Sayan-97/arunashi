import Link from "next/link";

export default function NotFound() {
  return (
    <main className="py-24 text-center select-none">
      <h1 className="font-sans font-medium text-2xl mb-4">Page Not Found</h1>
      <p className="text-[#868686] mb-8">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="border border-black px-6 py-2 uppercase text-sm font-semibold tracking-wider hover:bg-black hover:text-white transition-colors"
      >
        Back to Home
      </Link>
    </main>
  );
}
