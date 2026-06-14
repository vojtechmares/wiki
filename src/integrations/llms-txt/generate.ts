import fs from "node:fs/promises";
import {
  getAllEntries,
  getIncidents,
  getDecisions,
  DOMAINS,
  DOMAIN_META,
} from "../../lib/collections";

const SITE_NAME = "DevOps Wiki";
const SUMMARY =
  "Internal DevOps knowledge base covering infrastructure, delivery, reliability, security, platform, and agents.";
const SEPARATOR = "=".repeat(72);

function abs(site: URL, path: string): string {
  return new URL(path, site).href;
}

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function mdNote(site: URL): string {
  const example = abs(
    site,
    "/platform/tutorials/getting-started-with-kubernetes.md"
  );
  return [
    "Note: Append `.md` to any documentation page URL to get its raw Markdown",
    `(e.g. ${example}). Do not append \`.md\` to asset URLs such as images (\`.png\`).`,
    "This is a planned feature and may not be available yet.",
  ].join("\n");
}

/** Raw Markdown body of an entry, falling back to reading the source file. */
async function getBody(entry: {
  body?: string;
  filePath?: string;
}): Promise<string> {
  if (entry.body && entry.body.trim().length > 0) {
    return entry.body.trim();
  }
  if (entry.filePath) {
    const raw = await fs.readFile(entry.filePath, "utf-8");
    return raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "").trim();
  }
  return "";
}

/** Concise, agent-friendly index: title, summary, sectioned links. */
export async function buildLlmsTxt(site: URL): Promise<string> {
  const [entries, incidents, decisions] = await Promise.all([
    getAllEntries(),
    getIncidents(),
    getDecisions(),
  ]);

  const lines: string[] = [
    `# ${SITE_NAME}`,
    "",
    `> ${SUMMARY}`,
    "",
    `Full text version: ${abs(site, "/llms-full.txt")}`,
    "",
    mdNote(site),
  ];

  for (const domain of DOMAINS) {
    const domainEntries = entries.filter((entry) => entry.domain === domain);
    if (domainEntries.length === 0) continue;
    lines.push("", `## ${DOMAIN_META[domain].label}`, "");
    lines.push(`> ${DOMAIN_META[domain].description}`, "");
    for (const entry of domainEntries) {
      const url = abs(site, `/${entry.domain}/${entry.format}/${entry.slug}`);
      lines.push(`- [${entry.data.title}](${url}): ${entry.data.description}`);
    }
  }

  if (incidents.length > 0) {
    lines.push("", "## Incidents", "");
    for (const entry of incidents) {
      const url = abs(site, `/incidents/${entry.slug}`);
      lines.push(`- [${entry.data.title}](${url}): ${entry.data.description}`);
    }
  }

  if (decisions.length > 0) {
    lines.push("", "## Decisions", "");
    for (const entry of decisions) {
      const url = abs(site, `/decisions/${entry.slug}`);
      lines.push(`- [${entry.data.title}](${url}): ${entry.data.description}`);
    }
  }

  lines.push("");
  return lines.join("\n");
}

interface BlockInput {
  title: string;
  url: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  tags: string[];
  extra?: string[];
  body: string;
}

function entryBlock(input: BlockInput): string {
  const meta: string[] = [`URL: ${input.url}`, `Description: ${input.description}`];
  meta.push(`Published: ${formatDate(input.pubDate)}`);
  if (input.updatedDate) meta.push(`Updated: ${formatDate(input.updatedDate)}`);
  if (input.extra) meta.push(...input.extra);
  if (input.tags.length > 0) meta.push(`Tags: ${input.tags.join(", ")}`);

  return [SEPARATOR, "", `# ${input.title}`, "", meta.join("\n"), "", input.body, ""].join(
    "\n"
  );
}

/** Full text of every content entry, concatenated for LLM consumption. */
export async function buildLlmsFullTxt(site: URL): Promise<string> {
  const [entries, incidents, decisions] = await Promise.all([
    getAllEntries(),
    getIncidents(),
    getDecisions(),
  ]);

  const parts: string[] = [
    `# ${SITE_NAME} - Full Content`,
    "",
    `> ${SUMMARY}`,
    "",
    `This file contains the full text of every page on ${site.origin}, concatenated for LLM consumption.`,
    "",
    mdNote(site),
    "",
  ];

  for (const entry of entries) {
    parts.push(
      entryBlock({
        title: entry.data.title,
        url: abs(site, `/${entry.domain}/${entry.format}/${entry.slug}`),
        description: entry.data.description,
        pubDate: entry.data.pubDate,
        updatedDate: entry.data.updatedDate,
        tags: entry.data.tags,
        body: await getBody(entry),
      })
    );
  }

  for (const entry of incidents) {
    parts.push(
      entryBlock({
        title: entry.data.title,
        url: abs(site, `/incidents/${entry.slug}`),
        description: entry.data.description,
        pubDate: entry.data.pubDate,
        updatedDate: entry.data.updatedDate,
        tags: entry.data.tags,
        extra: entry.data.severity
          ? [`Severity: ${entry.data.severity}`]
          : undefined,
        body: await getBody(entry),
      })
    );
  }

  for (const entry of decisions) {
    parts.push(
      entryBlock({
        title: entry.data.title,
        url: abs(site, `/decisions/${entry.slug}`),
        description: entry.data.description,
        pubDate: entry.data.pubDate,
        updatedDate: entry.data.updatedDate,
        tags: entry.data.tags,
        extra: [
          `Status: ${entry.data.status}`,
          ...(entry.data.supersededBy
            ? [`Superseded by: ${entry.data.supersededBy}`]
            : []),
        ],
        body: await getBody(entry),
      })
    );
  }

  return parts.join("\n");
}
