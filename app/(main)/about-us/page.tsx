import Link from "next/link";

const getBackendUrl = () => process.env.API_URL || "http://localhost:8000";

async function getAboutContent(): Promise<string> {
  try {
    const res = await fetch(`${getBackendUrl()}/api/about`, {
      next: { revalidate: 60, tags: ["about"] },
    });
    if (!res.ok) throw new Error("Failed to fetch about details");
    const json = await res.json();
    if (json.success && json.data) {
      return json.data.content || "";
    }
    return "";
  } catch (error) {
    console.error("Error fetching about details:", error);
    return "";
  }
}

function renderMarkdown(markdown: string) {
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
          className="text-[#333] text-lg leading-[1.95] mb-8 font-light tracking-wide align-justify"
        >
          {line}
        </p>,
      );
    }
  }

  return elements;
}

export default async function AboutPage() {
  const content = await getAboutContent();

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
        <div className="max-w-none text-[#333] pt-6 select-text animate-fade-in">
          {renderMarkdown(content)}
        </div>
      </div>
    </main>
  );
}
