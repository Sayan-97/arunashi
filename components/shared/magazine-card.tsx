import { Download } from "lucide-react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function MagazineCard({
  image,
  title,
  link,
  imageContainerClassName,
}: {
  image: StaticImageData;
  title?: string;
  link: string;
  imageContainerClassName?: string;
}) {
  return (
    <Link href={link} className="space-y-4 group block">
      <div
        className={cn(
          "relative overflow-hidden w-full",
          imageContainerClassName || "h-[540px]",
        )}
      >
        <Image
          src={image}
          alt="Magazine Cover"
          fill
          priority
          placeholder="blur"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-black/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 text-white">
          <Download className="size-7" strokeWidth={1.5} />
          <span className="text-lg font-light tracking-wide">Download</span>
        </div>
      </div>
      {title && <p className="text-2xl text-center">{title}</p>}
    </Link>
  );
}
