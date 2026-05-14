import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

export default function ProductCard({
  image,
  name,
  link,
}: {
  image: StaticImageData;
  name: string;
  link: string;
}) {
  return (
    <Link href={link} className="space-y-4">
      <div className="relative overflow-hidden h-[377px] w-full">
        <Image
          src={image}
          alt="Product Image"
          fill
          priority
          placeholder="blur"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="w-full object-cover hover:scale-105 transition-transform ease-in-out"
        />
      </div>
      <p className="text-2xl text-center">{name}</p>
    </Link>
  );
}
