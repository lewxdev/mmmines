import type { MetadataRoute } from "next";
import { app } from "./utils/const";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: app.NAME,
    short_name: app.NAME,
    theme_color: app.THEME_COLOR_DARK,
    background_color: app.THEME_COLOR_DARK,
    display: "standalone",
    orientation: "any",
    scope: "/",
    start_url: "/",
    icons: [
      {
        src: "icon-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any maskable" as "maskable",
      },
      {
        src: "icon-monochrome.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "monochrome",
      },
    ],
  };
}
