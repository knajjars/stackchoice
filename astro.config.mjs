import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import icon from "astro-icon";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  site: "https://stackchoice.dev",
  integrations: [
    mdx(),
    sitemap(),
    tailwind(),
    icon({ include: { mdi: ["*"] } }),
    react(),
  ],
});
