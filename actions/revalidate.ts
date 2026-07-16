"use server";

import { updateTag } from "next/cache";

// Maps the realtime SSE event payload "type" to the Next.js fetch cache
// tag(s) that should be invalidated, so cached data is refreshed instantly
// on the same event that already triggers router.refresh() on the client.
const EVENT_TAG_MAP: Record<string, string[]> = {
  "products:updated": ["products"],
  "gemstones:updated": ["gemstones"],
  "diamonds:updated": ["diamonds"],
  "banners:updated": ["banners"],
  "magazines:updated": ["magazines"],
  "terms:updated": ["terms"],
  "privacy:updated": ["privacy"],
  "about:updated": ["about"],
};

export async function revalidateForEvent(eventType: string): Promise<void> {
  const tags = EVENT_TAG_MAP[eventType];
  if (!tags) return;
  for (const tag of tags) {
    updateTag(tag);
  }
}
