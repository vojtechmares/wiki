import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const baseSchema = z.object({
  title: z.string(),
  description: z.string(),
  pubDate: z.coerce.date(),
  updatedDate: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(false),
  order: z.number().optional(),
});

const infrastructure = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/infrastructure" }),
  schema: baseSchema,
});

const delivery = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/delivery" }),
  schema: baseSchema,
});

const reliability = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/reliability" }),
  schema: baseSchema,
});

const security = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/security" }),
  schema: baseSchema,
});

const platform = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/platform" }),
  schema: baseSchema,
});

const agents = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/agents" }),
  schema: baseSchema,
});

const incidentSchema = baseSchema.extend({
  severity: z.enum(["critical", "major", "minor"]).optional(),
});

const incidents = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/incidents" }),
  schema: incidentSchema,
});

const decisionSchema = baseSchema.extend({
  status: z
    .enum(["draft", "proposed", "accepted", "deprecated", "superseded"])
    .default("draft"),
  supersededBy: z.string().optional(),
});

const decisions = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/decisions" }),
  schema: decisionSchema,
});

export const collections = {
  infrastructure,
  delivery,
  reliability,
  security,
  platform,
  agents,
  incidents,
  decisions,
};
