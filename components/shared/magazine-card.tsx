import { Download, ExternalLink } from "lucide-react";
import Image from "next/image";
import { SHIMMER_PORTRAIT as SHIMMER_BASE64 } from "@/lib/shimmer";
import { cn } from "@/lib/utils";

const getFormattedIssue = (issue: string | null | undefined) => {
  if (!issue) return "";
  const cleaned = issue.trim();
  if (/^(issue\s*no\.?|issue)/i.test(cleaned)) {
    const num = cleaned.replace(/^(issue\s*no\.?|issue)\s*/i, "");
    return `Issue No. ${num}`;
  }
  return `Issue No. ${cleaned}`;
};

export default function MagazineCard({
  image,
  title,
  link,
  date,
  issueNumber,
  imageContainerClassName,
}: {
  image?: string;
  title?: string;
  link: string;
  date?: string;
  issueNumber?: string | null;
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

  const isExternalLink = link.includes("canva.com") || link.startsWith("http");

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
            <Image
              src={image}
              alt="Magazine Cover"
              fill
              placeholder="blur"
              blurDataURL={SHIMMER_BASE64}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
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
          href={
            isExternalLink
              ? link
              : `/api/download?url=${encodeURIComponent(link)}`
          }
          download={isExternalLink ? undefined : ""}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 bg-transparent hover:bg-black/[0.82] transition-colors duration-300 flex flex-col items-center justify-center gap-3 text-white opacity-0 hover:opacity-100"
        >
          {isExternalLink ? (
            <ExternalLink className="size-8" strokeWidth={1.5} />
          ) : (
            <Download className="size-8" strokeWidth={1.5} />
          )}
          <span className="text-xl font-normal tracking-wide">
            {isExternalLink ? "View Magazine" : "Download"}
          </span>
        </a>
      </div>
      {displayTitle && (
        <div className="text-center space-y-1">
          <p className="text-2xl">{displayTitle}</p>
          {issueNumber && (
            <p className="text-base text-gray-500 font-light">
              {getFormattedIssue(issueNumber)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
