import type { APIRoute } from "astro";
import {
  getAllEntries,
  getIncidents,
  getDecisions,
  DOMAIN_META,
  type Domain,
} from "../lib/collections";

export const GET: APIRoute = async () => {
  const [entries, incidents, decisions] = await Promise.all([
    getAllEntries(),
    getIncidents(),
    getDecisions(),
  ]);

  const items = [
    ...entries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      tags: entry.data.tags,
      url: `/${entry.domain}/${entry.format}/${entry.slug}/`,
      collection: DOMAIN_META[entry.domain as Domain].label,
    })),
    ...incidents.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      tags: entry.data.tags,
      url: `/incidents/${entry.slug}/`,
      collection: "Incident",
    })),
    ...decisions.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      tags: entry.data.tags,
      url: `/decisions/${entry.slug}/`,
      collection: "Decision",
    })),
  ];

  return new Response(JSON.stringify(items), {
    headers: { "Content-Type": "application/json" },
  });
};
