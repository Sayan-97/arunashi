import Link from "next/link";

const getBackendUrl = () => process.env.API_URL || "http://localhost:8000";

async function getPrivacyContent(): Promise<string> {
  try {
    const res = await fetch(`${getBackendUrl()}/api/privacy`, {
      next: { revalidate: 60, tags: ["privacy"] },
    });
    if (!res.ok) throw new Error("Failed to fetch privacy policy");
    const json = await res.json();
    if (json.success && json.data) {
      return json.data.content || "";
    }
    return "";
  } catch (error) {
    console.error("Error fetching privacy policy:", error);
    return "";
  }
}

function renderMarkdown(markdown: string) {
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
        // Identify if paragraph starts with a bold key-value prefix, e.g. **Foo**: Bar
        const boldMatch = line.match(/^\*\*(.*?)\*\*:\s*(.*)/);
        if (boldMatch) {
          elements.push(
            <p
              key={`p-${i}`}
              className="text-[#333] text-[17px] leading-[1.85] mb-8 font-light tracking-wide animate-fade-in"
            >
              <strong className="font-bold text-foreground">
                {boldMatch[1]}:
              </strong>{" "}
              {boldMatch[2]}
            </p>,
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
  }

  if (inList) {
    flushList("list-end");
  }

  return elements;
}

export default async function PrivacyPage() {
  const content = await getPrivacyContent();

  return (
    <main className="py-10">
      <div className="app_container">
        {/* Breadcrumbs */}
        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#a0a0a0] mb-8 font-sans">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>&gt;</span>
          <span className="text-[#627426]">Privacy Policy</span>
        </div>

        {/* Title */}
        <h1 className="text-center font-fleur text-5xl lg:text-[70px] leading-tight capitalize tracking-wider mb-14 text-foreground animate-fade-in">
          Privacy Policy
        </h1>

        {/* Content */}
        <div className="max-w-none text-[#333] pt-6 select-text">
          {renderMarkdown(content)}
        </div>
      </div>
    </main>
  );
}
