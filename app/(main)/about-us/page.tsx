"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AboutPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAbout = () => {
    fetch("/api/about")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setContent(json.data.content);
        }
      })
      .catch((err) => console.error("Error fetching about details:", err))
      .finally(() => setLoading(false));
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: fetchAbout runs on mount
  useEffect(() => {
    fetchAbout();
  }, []);

  // Scroll to top when page loading completes to prevent starting from the bottom
  useEffect(() => {
    if (!loading) {
      window.scrollTo(0, 0);
    }
  }, [loading]);

  // Listen to realtime updates to keep page updated in real time
  // biome-ignore lint/correctness/useExhaustiveDependencies: fetchAbout is stable
  useEffect(() => {
    const handleRealtime = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail.type === "about:updated") {
        fetchAbout();
      }
    };
    window.addEventListener("realtime-sync", handleRealtime);
    return () => {
      window.removeEventListener("realtime-sync", handleRealtime);
    };
  }, []);

  const renderMarkdown = (markdown: string) => {
    if (!markdown) return null;
    const lines = markdown.split("\n");
    const elements: React.ReactNode[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) {
        continue;
      }

      if (
        line.startsWith("### ") ||
        line.startsWith("## ") ||
        line.startsWith("# ")
      ) {
        const text = line.replace(/^#+\s+/, "");
        elements.push(
          <h2
            key={`h-${i}`}
            className="text-[18px] font-bold text-foreground uppercase mt-10 mb-6 tracking-widest font-sans border-b border-black/5 pb-2"
          >
            {text}
          </h2>,
        );
      } else {
        elements.push(
          <p
            key={`p-${i}`}
            className="text-[#555] text-lg leading-[1.95] mb-8 font-light tracking-wide align-justify"
          >
            {line}
          </p>,
        );
      }
    }

    return elements;
  };

  return (
    <main className="py-10">
      <div className="app_container">
        {/* Breadcrumbs */}
        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#a0a0a0] mb-8 font-sans">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>&gt;</span>
          <span className="text-[#627426]">About Us</span>
        </div>

        {/* Title */}
        <h1 className="text-center font-fleur text-5xl lg:text-[70px] leading-tight uppercase tracking-wider mb-16 text-foreground">
          About Us
        </h1>

        {/* Dynamic Text Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#627426] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="max-w-none text-[#333] pt-6 select-text animate-fade-in">
            {renderMarkdown(content)}
          </div>
        )}
      </div>
    </main>
  );
}
