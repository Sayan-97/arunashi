import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

export default function ProductCard({
  image,
  hoverImage,
  name,
  link,
}: {
  image: StaticImageData | string;
  hoverImage?: StaticImageData | string;
  name: string;
  link: string;
}) {
  const getSrcStr = (img: any): string => {
    if (typeof img === "string") return img;
    if (img && typeof img === "object" && "src" in img) return img.src;
    return "";
  };

  const isRemote = (img: any) => {
    const src = getSrcStr(img);
    return src.startsWith("http") || src.startsWith("//");
  };

  const isImageStatic = !isRemote(image);
  const isHoverStatic = hoverImage && !isRemote(hoverImage);

  return (
    <Link href={link} className="space-y-4 group">
      <div className="relative overflow-hidden h-[377px] w-full bg-[#f9f9f9]">
        <Image
          src={image}
          alt={name}
          fill
          priority
          placeholder={isImageStatic ? "blur" : undefined}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
        {hoverImage && (
          <Image
            src={hoverImage}
            alt={`${name} Hover`}
            fill
            placeholder={isHoverStatic ? "blur" : undefined}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="w-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out group-hover:scale-105"
          />
        )}
      </div>
      <p className="text-2xl text-center">{name}</p>
    </Link>
  );
}
