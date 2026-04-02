import type { APIRoute } from "astro";
import { getAllEntries } from "../../lib/collections";

export async function getStaticPaths() {
  const entries = await getAllEntries();
  return entries.map((entry) => ({
    params: { category: entry.category, slug: entry.id },
    props: { entry },
  }));
}

export const GET: APIRoute = ({ props }) => {
  const { entry } = props;

  const frontmatterLines = Object.entries(entry.data)
    .map(([key, value]) => {
      if (value instanceof Date) {
        return `${key}: ${value.toISOString().split("T")[0]}`;
      }
      if (Array.isArray(value)) {
        return `${key}:\n${value.map((v: unknown) => `  - ${JSON.stringify(v)}`).join("\n")}`;
      }
      if (typeof value === "string") {
        return `${key}: "${value}"`;
      }
      return `${key}: ${value}`;
    })
    .join("\n");

  const rawMarkdown = `---\n${frontmatterLines}\n---\n\n${entry.body}`;

  return new Response(rawMarkdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
};
