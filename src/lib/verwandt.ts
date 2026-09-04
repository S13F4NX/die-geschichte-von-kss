import { getCollection } from 'astro:content';

export async function verwandte(entry: any, sammlung: string, n = 6) {
  const d = entry.data;
  const alle = [
    ...(await getCollection('geschichten')).map((e) => ({ e, basis: '/geschichten' })),
    ...(await getCollection('anhaenge')).map((e) => ({ e, basis: '/wissen' })),
    ...(await getCollection('web')).map((e) => ({ e, basis: '/verein/beitraege' })),
  ];
  const meine = new Set([...d.schlagworte, ...d.schiffe, ...d.orte].map((s: string) => s.toLowerCase()));
  const bewertet = alle
    .filter(({ e }) => e.id !== entry.id)
    .map(({ e, basis }) => {
      const x = e.data;
      let punkte = 0;
      for (const s of [...x.schlagworte, ...x.schiffe, ...x.orte]) if (meine.has(s.toLowerCase())) punkte += 2;
      for (const p of x.projekte) if (d.projekte.includes(p)) punkte += 1;
      for (const a of x.autoren) if (d.autoren.includes(a)) punkte += 3;
      if (x.kategorie === d.kategorie) punkte += 0.5;
      return { punkte, url: `${basis}/${e.id}`, title: x.title, autoren: x.autoren, broschuere: x.broschuere };
    })
    .filter((x) => x.punkte >= 2)
    .sort((a, b) => b.punkte - a.punkte);
  return bewertet.slice(0, n);
}
