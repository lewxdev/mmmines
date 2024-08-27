import type { MetadataRoute } from "next";
import { APP_NAME, APP_THEME_COLOR_DARK } from "./utils/const";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_NAME,
    short_name: APP_NAME,
    theme_color: APP_THEME_COLOR_DARK,
    background_color: APP_THEME_COLOR_DARK,
    display: "standalone",
    orientation: "any",
    scope: "/",
    start_url: "/",
    icons: [
      {
        src: "icon-maskable.svg",
        sizes: "any",
        type: "image/svg+xml",
        // @ts-expect-error: `purpose` only supports individual values
        purpose: "any maskable",
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
