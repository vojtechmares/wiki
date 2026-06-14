import type { APIRoute } from "astro";
import { getAllEntries } from "../../../lib/collections";
import { readEntrySource } from "../../../lib/markdown";

export const prerender = true;

type Entry = Awaited<ReturnType<typeof getAllEntries>>[number];

export async function getStaticPaths() {
  const entries = await getAllEntries();
  return entries.map((entry) => ({
    params: { domain: entry.domain, format: entry.format, slug: entry.slug },
    props: { entry },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { entry } = props as { entry: Entry };
  return new Response(await readEntrySource(entry), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
