import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import netlify from '@astrojs/netlify';
import react from '@astrojs/react';

export default defineConfig({
  site: "https://service.hgaruna.org/",
  integrations: [sitemap(), netlify(), react()],
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

  adapter: netlify(),
  vite: {
    resolve: {
      // alias: {
      //   '@plasmicapp/host/registerComponent': '@plasmicapp/host/registerComponent/dist/index.cjs.js',
      // },
    },
    optimizeDeps: {
      include: ['@plasmicapp/host'],
    },
    ssr: {
      noExternal: ['@plasmicpkgs/plasmic-rich-components', '@plasmicapp/host'],
    },
    build: {
      commonjsOptions: {
        transformMixedEsModules: true,
      },
    },
  },
});