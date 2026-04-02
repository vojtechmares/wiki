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

const tutorials = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/tutorials" }),
  schema: baseSchema,
});

const howToGuides = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/how-to-guides" }),
  schema: baseSchema,
});

const explanations = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/explanations" }),
  schema: baseSchema,
});

const references = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./content/references" }),
  schema: baseSchema,
});

export const collections = {
  tutorials,
  "how-to-guides": howToGuides,
  explanations,
  references,
};
