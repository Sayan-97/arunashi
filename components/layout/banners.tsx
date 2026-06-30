import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

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
      { cache: "no-store" }, // Use no-store to ensure we always get latest active banners
    );
    const data = await res.json();
    if (data.success) {
      activeBanners = data.data;
    }
  } catch (error) {
    console.error("Error fetching banners:", error);
  }

  if (activeBanners.length === 0) {
    return null; // Return nothing if no active banners
  }

  // Single Banner Display
  if (activeBanners.length === 1) {
    const banner = activeBanners[0];
    let resolvedImage = banner.image;
    if (resolvedImage && !resolvedImage.startsWith("http")) {
      resolvedImage = `${process.env.API_URL || "http://localhost:8000"}${resolvedImage}`;
    }

    const content = (
      <div className="relative w-full h-[420px]">
        {/* biome-ignore lint/performance/noImgElement: Native img is used to bypass Next.js image domain config for local uploads */}
        <img
          src={resolvedImage}
          alt="Banner"
          className="w-full h-full object-cover object-top-left -z-10 absolute inset-0"
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
        // Autoplay requires client component wrapper or plugin config passed to Carousel wrapper if implemented
        // Since we are using standard shadcn/embla setup, we can use the plugin if needed,
        // but for now, we'll just loop. The `plugins` prop could be passed if `Autoplay` was imported.
        className="w-full"
      >
        <CarouselContent>
          {activeBanners.map((banner) => {
            let resolvedImage = banner.image;
            if (resolvedImage && !resolvedImage.startsWith("http")) {
              resolvedImage = `${process.env.API_URL || "http://localhost:8000"}${resolvedImage}`;
            }

            const content = (
              <div className="relative w-full h-[381px]">
                {/* biome-ignore lint/performance/noImgElement: Native img is used to bypass Next.js image domain config for local uploads */}
                <img
                  src={resolvedImage}
                  alt="Banner"
                  className="w-full h-full object-cover object-top-left -z-10 absolute inset-0"
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
