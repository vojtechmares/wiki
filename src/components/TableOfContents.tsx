import {useState, useEffect} from "react";

interface Heading {
  depth: number;
  slug: string;
  text: string;
}

interface Props {
  headings: Heading[];
}

export default function TableOfContents({headings}: Props) {
  const [activeId, setActiveId] = useState<string>("");

  const tocHeadings = headings.filter((h) => h.depth >= 2 && h.depth <= 3);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      {rootMargin: "-80px 0px -80% 0px"},
    );

    for (const heading of tocHeadings) {
      const el = document.getElementById(heading.slug);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  if (tocHeadings.length === 0) return null;

  return (
    <nav className="hidden xl:block xl:col-span-3">
      <div className="sticky top-[3.75rem] h-[calc(100vh-3.75rem)] overflow-y-auto py-6 pl-4">
        <h2 className="font-semibold text-sm text-zinc-400 uppercase tracking-wider mb-3">
          On this page
        </h2>
        <ul className="space-y-1">
          {tocHeadings.map((heading) => (
            <li key={heading.slug}>
              <a
                href={`#${heading.slug}`}
                className={`block text-sm no-underline transition-colors ${
                  heading.depth === 3 ? "pl-4" : ""
                } ${
                  activeId === heading.slug
                    ? "text-orange-500"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
                style={{paddingTop: "0.25rem", paddingBottom: "0.25rem"}}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
