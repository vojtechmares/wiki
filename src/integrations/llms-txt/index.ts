import { fileURLToPath } from "node:url";
import type { AstroIntegration } from "astro";

/**
 * Adds two AI-agent-friendly endpoints, prerendered at build time:
 * - /llms.txt      a concise, sectioned index of the site (links + descriptions)
 * - /llms-full.txt the full Markdown text of every content entry
 *
 * @see https://llmstxt.org
 */
export default function llmsTxt(): AstroIntegration {
  return {
    name: "llms-txt",
    hooks: {
      "astro:config:setup": ({ injectRoute }) => {
        injectRoute({
          pattern: "/llms.txt",
          entrypoint: fileURLToPath(new URL("./llms-txt.ts", import.meta.url)),
          prerender: true,
        });
        injectRoute({
          pattern: "/llms-full.txt",
          entrypoint: fileURLToPath(
            new URL("./llms-full-txt.ts", import.meta.url)
          ),
          prerender: true,
        });
      },
    },
  };
}
