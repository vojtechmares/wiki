import { getCollection } from "astro:content";

export const DOMAINS = [
  "infrastructure",
  "delivery",
  "reliability",
  "security",
  "platform",
] as const;

export type Domain = (typeof DOMAINS)[number];

export const DOMAIN_META: Record<
  Domain,
  { label: string; description: string }
> = {
  infrastructure: {
    label: "Infrastructure",
    description:
      "Infrastructure as Code, Terraform, networking, storage, compute, cloud, and on-prem",
  },
  delivery: {
    label: "Delivery",
    description: "CI/CD, GitHub Actions, GitLab CI, and deployment pipelines",
  },
  reliability: {
    label: "Reliability",
    description:
      "Observability, Loki, Mimir, Prometheus, Grafana, and Tempo",
  },
  security: {
    label: "Security",
    description:
      "Policy as Code, Kyverno, Falco, Trivy, SBOMs, signing, and provenance",
  },
  platform: {
    label: "Platform",
    description: "Kubernetes, operators, and platform engineering",
  },
};

export const FORMATS = [
  "tutorials",
  "how-to-guides",
  "explanations",
  "references",
] as const;

export type Format = (typeof FORMATS)[number];

export const FORMAT_META: Record<
  Format,
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

export function parseEntryId(id: string): { format: Format; slug: string } {
  const separatorIndex = id.indexOf("/");
  const format = id.slice(0, separatorIndex) as Format;
  const slug = id.slice(separatorIndex + 1);
  return { format, slug };
}

function sortEntries<T extends { data: { order?: number; title: string } }>(
  entries: T[]
): T[] {
  return entries.sort((a, b) => {
    if (a.data.order !== undefined && b.data.order !== undefined) {
      return a.data.order - b.data.order;
    }
    if (a.data.order !== undefined) return -1;
    if (b.data.order !== undefined) return 1;
    return a.data.title.localeCompare(b.data.title);
  });
}

export async function getEntriesByDomain(domain: Domain) {
  const entries = await getCollection(domain, ({ data }) => !data.draft);
  return sortEntries(
    entries.map((entry) => {
      const { format, slug } = parseEntryId(entry.id);
      return { ...entry, domain, format, slug };
    })
  );
}

export async function getEntriesByDomainAndFormat(
  domain: Domain,
  format: Format
) {
  const entries = await getEntriesByDomain(domain);
  return entries.filter((entry) => entry.format === format);
}

export async function getAllEntries() {
  const all = await Promise.all(
    DOMAINS.map((domain) => getEntriesByDomain(domain))
  );
  return all.flat();
}
