// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://die-geschichte-von-kss.de',
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [
    sitemap({
      changefreq: 'monthly',
      priority: 0.7,
      lastmod: new Date(),
      i18n: { defaultLocale: 'de', locales: { de: 'de-DE' } },
    }),
  ],
  markdown: {
    shikiConfig: { theme: 'github-light' },
  },
});
