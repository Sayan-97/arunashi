"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function TermsPage() {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchTerms = () => {
    fetch("/api/terms")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setContent(json.data.content);
        }
      })
      .catch((err) => console.error("Error fetching terms:", err))
      .finally(() => setLoading(false));
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: fetchTerms runs on mount
  useEffect(() => {
    fetchTerms();
  }, []);

  // Scroll to top when page loading completes to prevent starting from the bottom
  useEffect(() => {
    if (!loading) {
      window.scrollTo(0, 0);
    }
  }, [loading]);

  // Listen to realtime updates to keep page updated in real time
  // biome-ignore lint/correctness/useExhaustiveDependencies: fetchTerms is stable
  useEffect(() => {
    const handleRealtime = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail.type === "terms:updated") {
        fetchTerms();
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
    let listItems: React.ReactNode[] = [];
    let inList = false;

    const flushList = (key: string) => {
      if (listItems.length > 0) {
        elements.push(
          <ul
            key={key}
            className="list-disc pl-6 mb-8 space-y-3 text-[#333] text-[17px] font-light tracking-wide"
          >
            {listItems}
          </ul>,
        );
        listItems = [];
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) {
        continue;
      }

      if (line.startsWith("- ") || line.startsWith("* ")) {
        inList = true;
        const text = line.substring(2);
        listItems.push(<li key={`li-${i}`}>{text}</li>);
      } else {
        if (inList) {
          flushList(`list-${i}`);
          inList = false;
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
              className="text-[18px] font-bold text-foreground uppercase mt-14 mb-6 tracking-widest font-sans border-b border-black/5 pb-2"
            >
              {text}
            </h2>,
          );
        } else {
          elements.push(
            <p
              key={`p-${i}`}
              className="text-[#333] text-[17px] leading-[1.85] mb-8 font-light tracking-wide"
            >
              {line}
            </p>,
          );
        }
      }
    }

    if (inList) {
      flushList("list-end");
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
          <span className="text-[#627426]">Terms & Conditions</span>
        </div>

        {/* Title */}
        <h1 className="text-center font-fleur text-5xl lg:text-[70px] leading-tight capitalize tracking-wider mb-14 text-foreground">
          Terms & Conditions
        </h1>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#627426] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="max-w-none text-[#333] pt-6 select-text">
            {renderMarkdown(content)}
          </div>
        )}
      </div>
    </main>
  );
}
