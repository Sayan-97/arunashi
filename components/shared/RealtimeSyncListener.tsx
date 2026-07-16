"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { revalidateForEvent } from "@/actions/revalidate";

export default function RealtimeSyncListener() {
  const router = useRouter();

  useEffect(() => {
    // Determine the SSE URL (direct connection in development to bypass Next.js middleware buffering)
    const getSseUrl = () => {
      if (process.env.NEXT_PUBLIC_API_URL) {
        return `${process.env.NEXT_PUBLIC_API_URL}/api/realtime/stream`;
      }
      if (
        typeof window !== "undefined" &&
        window.location.hostname === "localhost"
      ) {
        return "http://localhost:8000/api/realtime/stream";
      }
      return "/api/realtime/stream";
    };

    const eventSource = new EventSource(getSseUrl());

    eventSource.onopen = () => {
      console.log(
        "Real-time synchronization channel established (Storefront).",
      );
    };

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);

        // Filter out pings
        if (payload.type === "ping" || payload.type === "connected") {
          return;
        }

        console.log("Real-time sync event received (Storefront):", payload);

        // Trigger global Server Components reload on updates
        if (
          payload.type === "products:updated" ||
          payload.type === "gemstones:updated" ||
          payload.type === "diamonds:updated" ||
          payload.type === "banners:updated" ||
          payload.type === "magazines:updated" ||
          payload.type === "requests:updated" ||
          payload.type === "terms:updated" ||
          payload.type === "privacy:updated" ||
          payload.type === "about:updated"
        ) {
          revalidateForEvent(payload.type)
            .catch((err) =>
              console.error("Failed to revalidate cache tag:", err),
            )
            .finally(() => router.refresh());
          const syncEvent = new CustomEvent("realtime-sync", {
            detail: payload,
          });
          window.dispatchEvent(syncEvent);
        }
      } catch (error) {
        console.error("Failed to parse storefront realtime message:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error(
        "Real-time synchronization channel error (Storefront):",
        error,
      );
    };

    return () => {
      eventSource.close();
    };
  }, [router]);

  return null;
}
