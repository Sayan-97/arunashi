import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { SHIMMER_SQUARE as SHIMMER_BASE64 } from "@/lib/shimmer";

export default function ProductCard({
  image,
  hoverImage,
  name,
  link,
  priority = false,
}: {
  image: StaticImageData | string;
  hoverImage?: StaticImageData | string;
  name: string;
  link: string;
  priority?: boolean;
}) {
  const isImageStatic =
    typeof image === "object" && image !== null && "blurDataURL" in image;
  const isHoverStatic =
    typeof hoverImage === "object" &&
    hoverImage !== null &&
    "blurDataURL" in hoverImage;

  return (
    <Link href={link} className="space-y-4 group">
      <div className="relative overflow-hidden h-[377px] w-full bg-[#f9f9f9]">
        <Image
          src={image}
          alt={name}
          fill
          priority={priority}
          placeholder="blur"
          blurDataURL={isImageStatic ? undefined : SHIMMER_BASE64}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
        {hoverImage && (
          <Image
            src={hoverImage}
            alt={`${name} Hover`}
            fill
            placeholder="blur"
            blurDataURL={isHoverStatic ? undefined : SHIMMER_BASE64}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="w-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out group-hover:scale-105"
          />
        )}
      </div>
      <p className="text-2xl text-center">{name}</p>
    </Link>
  );
}
