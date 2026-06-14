import type { APIRoute } from "astro";
import { getDecisions } from "../../lib/collections";
import { readEntrySource } from "../../lib/markdown";

export const prerender = true;

type Entry = Awaited<ReturnType<typeof getDecisions>>[number];

export async function getStaticPaths() {
  const decisions = await getDecisions();
  return decisions.map((entry) => ({
    params: { slug: entry.slug },
    props: { entry },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const { entry } = props as { entry: Entry };
  return new Response(await readEntrySource(entry), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
};
