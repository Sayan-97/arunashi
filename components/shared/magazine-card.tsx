import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MagazineCard({
  image,
  title,
  link,
  date,
  imageContainerClassName,
}: {
  image?: string;
  title?: string;
  link: string;
  date?: string;
  imageContainerClassName?: string;
}) {
  const displayTitle =
    title ||
    (date
      ? new Date(date).toLocaleString("default", {
          month: "long",
          year: "numeric",
        })
      : "");

  return (
    <div className="space-y-4 group block relative">
      <div
        className={cn(
          "relative overflow-hidden w-full rounded-md border border-[#EEEEEE]",
          imageContainerClassName || "h-[540px]",
        )}
      >
        {typeof image === "string" && image.trim() !== "" ? (
          <>
            {/* biome-ignore lint/performance/noImgElement: Native img is used to bypass Next.js image domain config for local uploads */}
            <img
              src={image}
              alt="Magazine Cover"
              className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            />
          </>
        ) : (
          <iframe
            src={link}
            title={displayTitle || "Magazine Viewer"}
            loading="lazy"
            className="absolute top-0 left-0 w-full h-full border-none pointer-events-none scale-100 transition-transform duration-500 ease-in-out group-hover:scale-105"
            allowFullScreen
            allow="fullscreen"
          />
        )}

        {/* Clickable Overlay */}
        <a
          href={`/api/download?url=${encodeURIComponent(link)}`}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 bg-transparent hover:bg-black/[0.82] transition-colors duration-300 flex flex-col items-center justify-center gap-3 text-white opacity-0 hover:opacity-100"
        >
          <Download className="size-8" strokeWidth={1.5} />
          <span className="text-xl font-normal tracking-wide">Download</span>
        </a>
      </div>
      {displayTitle && <p className="text-2xl text-center">{displayTitle}</p>}
    </div>
  );
}
