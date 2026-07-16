const getBackendUrl = () => process.env.API_URL || "http://localhost:8000";

export interface Gemstone {
  id: string;
  name: string;
  link: string;
}

export interface Diamond {
  id: string;
  name: string;
  link: string;
}

export async function getGemstones(): Promise<Gemstone[]> {
  try {
    const res = await fetch(`${getBackendUrl()}/api/gemstones`, {
      next: { revalidate: 60, tags: ["gemstones"] },
    });
    if (!res.ok) throw new Error("Failed to fetch gemstones");
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error loading gemstones:", error);
    return [];
  }
}

export async function getDiamonds(): Promise<Diamond[]> {
  try {
    const res = await fetch(`${getBackendUrl()}/api/diamonds`, {
      next: { revalidate: 60, tags: ["diamonds"] },
    });
    if (!res.ok) throw new Error("Failed to fetch diamonds");
    const json = await res.json();
    return json.data || [];
  } catch (error) {
    console.error("Error loading diamonds:", error);
    return [];
  }
}
