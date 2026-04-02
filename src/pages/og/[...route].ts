import { OGImageRoute } from "astro-og-canvas";
import { getAllEntries } from "../../lib/collections";

const allEntries = await getAllEntries();

const pages = Object.fromEntries(
  allEntries.map((entry) => [
    `${entry.category}/${entry.id}`,
    { title: entry.data.title, description: entry.data.description },
  ])
);

export const { getStaticPaths, GET } = await OGImageRoute({
  param: "route",
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    bgGradient: [[24, 24, 27]],
    font: {
      title: {
        color: [244, 244, 245],
        size: 64,
        families: ["IBM Plex Sans"],
        weight: "Bold",
      },
      description: {
        color: [212, 212, 216],
        size: 28,
        families: ["Inter"],
      },
    },
    border: {
      color: [249, 115, 22],
      width: 4,
      side: "block-end",
    },
  }),
});
