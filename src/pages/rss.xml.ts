import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { alleBeitraege, sortiereBroschuere } from '../lib/inhalt';
import { SITE } from '../lib/site';

export async function GET(context: APIContext) {
  const alle = (await alleBeitraege()).sort(sortiereBroschuere);
  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site!,
    items: alle.map((e) => ({
      title: e.title,
      link: e.url,
      description: e.zusammenfassung || e.title,
      author: e.autoren.join(', ') || undefined,
      categories: [...e.projekte.map((p) => `Projekt ${p}`), ...e.schlagworte],
    })),
    customData: '<language>de-DE</language>',
  });
}
