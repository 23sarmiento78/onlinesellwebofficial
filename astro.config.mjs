import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://service.hgaruna.org/",
  integrations: [sitemap()],
  trailingSlash: 'always',
  content: {
    collections: {
      articles: {
        type: 'content',
        schema: {
          title: 'string',
          description: 'string',
          date: 'date',
          image: 'string?',
          category: 'string?',
          author: 'string?',
          tags: 'string[]?',
        },
      },
    },
  },
});
