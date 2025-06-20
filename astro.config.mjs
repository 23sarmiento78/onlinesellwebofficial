import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://service.hgaruna.org/",
  integrations: [sitemap()],
  trailingSlash: 'always',
});
