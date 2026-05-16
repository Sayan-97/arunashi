import Image from "next/image";
import { banners } from "@/constants";

export default function Banners() {
  const banner = banners[0];

  return (
    <section>
      <div className="relative w-full h-[381px]">
        <Image
          src={banner.image}
          alt="Banner Image"
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="object-cover object-top-left -z-10"
        />
      </div>
    </section>
  );
}
