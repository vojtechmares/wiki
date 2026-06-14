import type { APIRoute } from "astro";
import { buildLlmsFullTxt } from "./generate";

export const prerender = true;

export const GET: APIRoute = async ({ site }) => {
  return new Response(await buildLlmsFullTxt(site!), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
