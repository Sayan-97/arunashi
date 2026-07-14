import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

// Tiny shimmer used as a blur placeholder for remote banner images
const SHIMMER_BASE64 =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwMCIgaGVpZ2h0PSI0MjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEyMDAiIGhlaWdodD0iNDIwIiBmaWxsPSIjZjVmNWY1Ii8+PC9zdmc+";

interface Banner {
  id: string;
  image: string;
  link?: string | null;
  isActive: boolean;
  order: number;
}

export default async function Banners() {
  let activeBanners: Banner[] = [];
  try {
    const res = await fetch(
      `${process.env.API_URL || "http://localhost:8000"}/api/banners`,
      { cache: "no-store" },
    );
    const data = await res.json();
    if (data.success) {
      activeBanners = data.data;
    }
  } catch (error) {
    console.error("Error fetching banners:", error);
  }

  if (activeBanners.length === 0) {
    return null;
  }

  const resolveUrl = (image: string) => {
    if (!image) return "";
    if (image.startsWith("http")) return image;
    return `${process.env.API_URL || "http://localhost:8000"}${image}`;
  };

  // Single Banner Display
  if (activeBanners.length === 1) {
    const banner = activeBanners[0];
    const resolvedImage = resolveUrl(banner.image);

    const content = (
      <div className="relative w-full h-[420px]">
        <Image
          src={resolvedImage}
          alt="Banner"
          fill
          priority
          placeholder="blur"
          blurDataURL={SHIMMER_BASE64}
          sizes="100vw"
          className="object-cover object-top-left -z-10"
        />
      </div>
    );

    return (
      <section className="app_container">
        {banner.link ? (
          <Link href={banner.link} className="block w-full h-full">
            {content}
          </Link>
        ) : (
          content
        )}
      </section>
    );
  }

  // Multiple Banners Slider Display
  return (
    <section className="app_container">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent>
          {activeBanners.map((banner, index) => {
            const resolvedImage = resolveUrl(banner.image);

            const content = (
              <div className="relative w-full h-[381px]">
                <Image
                  src={resolvedImage}
                  alt="Banner"
                  fill
                  priority={index === 0}
                  placeholder="blur"
                  blurDataURL={SHIMMER_BASE64}
                  sizes="100vw"
                  className="object-cover object-top-left -z-10"
                />
              </div>
            );

            return (
              <CarouselItem key={banner.id}>
                {banner.link ? (
                  <Link href={banner.link} className="block w-full h-full">
                    {content}
                  </Link>
                ) : (
                  content
                )}
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </section>
  );
}
