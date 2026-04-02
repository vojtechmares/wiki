import { getCollection } from "astro:content";

export const CATEGORIES = [
  "tutorials",
  "how-to-guides",
  "explanations",
  "references",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_META: Record<
  Category,
  { label: string; description: string }
> = {
  tutorials: {
    label: "Tutorials",
    description: "Step-by-step lessons to learn new concepts",
  },
  "how-to-guides": {
    label: "How-To Guides",
    description: "Practical recipes for solving specific problems",
  },
  explanations: {
    label: "Explanations",
    description: "Deep dives into concepts and architecture",
  },
  references: {
    label: "References",
    description: "Quick-lookup technical reference material",
  },
};

export async function getEntriesByCategory(category: Category) {
  const entries = await getCollection(category, ({ data }) => !data.draft);
  return entries.sort((a, b) => {
    if (a.data.order !== undefined && b.data.order !== undefined) {
      return a.data.order - b.data.order;
    }
    if (a.data.order !== undefined) return -1;
    if (b.data.order !== undefined) return 1;
    return a.data.title.localeCompare(b.data.title);
  });
}

export async function getAllEntries() {
  const all = await Promise.all(
    CATEGORIES.map(async (category) => {
      const entries = await getEntriesByCategory(category);
      return entries.map((entry) => ({ ...entry, category }));
    })
  );
  return all.flat();
}
