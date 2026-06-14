import fs from "node:fs/promises";

/** Verbatim source Markdown (frontmatter + body) of a content entry. */
export async function readEntrySource(entry: {
  filePath?: string;
  body?: string;
}): Promise<string> {
  if (entry.filePath) return fs.readFile(entry.filePath, "utf-8");
  return entry.body ?? ""; // fallback if filePath is ever absent
}
