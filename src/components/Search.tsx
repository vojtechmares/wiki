import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";

interface SearchItem {
  title: string;
  description: string;
  tags: string[];
  url: string;
  collection: string;
}

let cachedIndex: SearchItem[] | null = null;

async function loadIndex(): Promise<SearchItem[]> {
  if (cachedIndex) return cachedIndex;
  const res = await fetch("/search-index.json");
  cachedIndex = await res.json();
  return cachedIndex!;
}

function scoreItem(item: SearchItem, query: string): number {
  const q = query.toLowerCase();
  let score = 0;
  if (item.title.toLowerCase().includes(q)) score += 3;
  if (item.tags.some((t) => t.toLowerCase().includes(q))) score += 2;
  if (item.description.toLowerCase().includes(q)) score += 1;
  return score;
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const search = useCallback((q: string) => {
    if (!q.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    loadIndex().then((index) => {
      const scored = index
        .map((item) => ({ item, score: scoreItem(item, q) }))
        .filter(({ score }) => score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 8)
        .map(({ item }) => item);
      setResults(scored);
      setSelectedIndex(0);
      setIsOpen(true);
    });
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 150);
  };

  const navigate = (url: string) => {
    setIsOpen(false);
    setQuery("");
    window.location.href = url;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) {
      if (e.key === "Escape") {
        inputRef.current?.blur();
        setIsOpen(false);
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % results.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((i) => (i - 1 + results.length) % results.length);
        break;
      case "Enter":
        e.preventDefault();
        navigate(results[selectedIndex].url);
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleGlobalKey);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleGlobalKey);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <Field className="relative gap-0">
        <FieldLabel className="sr-only">Search</FieldLabel>
        <div className="relative">
          <svg
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <Input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => {
              loadIndex();
              if (query.trim()) search(query);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search..."
            className="h-auto w-full rounded-none md:w-48 md:focus:w-64 transition-all duration-200 bg-zinc-800 border border-zinc-700 text-zinc-100 text-sm pl-8 pr-12 py-1.5 placeholder-zinc-500 focus:outline-none focus:border-zinc-500 focus-visible:ring-0 focus-visible:border-zinc-500"
          />
          <kbd className="hidden md:inline-flex absolute right-2 top-1/2 -translate-y-1/2 items-center gap-0.5 px-1.5 py-0.5 text-[10px] text-zinc-500 bg-zinc-700/50 border border-zinc-600 rounded">
            ⌘K
          </kbd>
        </div>
      </Field>

      {isOpen && results.length > 0 && (
        <ul className="absolute top-full left-0 right-0 md:w-96 mt-1 bg-zinc-800 border border-zinc-700 shadow-lg max-h-96 overflow-y-auto z-50">
          {results.map((item, i) => (
            <li key={item.url}>
              <a
                href={item.url}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.url);
                }}
                onMouseEnter={() => setSelectedIndex(i)}
                className={`block px-3 py-2 no-underline transition-colors ${
                  i === selectedIndex ? "bg-zinc-700" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-zinc-100 truncate">
                    {item.title}
                  </span>
                  <span className="shrink-0 text-[10px] px-1.5 py-0.5 bg-zinc-900 text-zinc-400 border border-zinc-700">
                    {item.collection}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 truncate mt-0.5">
                  {item.description}
                </p>
              </a>
            </li>
          ))}
        </ul>
      )}

      {isOpen && query.trim() && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 md:w-96 mt-1 bg-zinc-800 border border-zinc-700 shadow-lg z-50 px-3 py-4 text-sm text-zinc-400 text-center">
          No results for "{query}"
        </div>
      )}
    </div>
  );
}
