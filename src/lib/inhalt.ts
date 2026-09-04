import { getCollection } from 'astro:content';
import { slugify } from './site';

export type Eintrag = {
  id: string; url: string; title: string; autoren: string[]; kategorie: string; broschuere?: number; seiten: number[];
  zeitraum: string; projekte: string[]; schiffe: string[]; orte: string[]; zusammenfassung: string; schlagworte: string[]; datum?: string; sammlung: string; body: string; rubrik: string;
};

export async function alleBeitraege(): Promise<Eintrag[]> {
  const g = (await getCollection('geschichten')).map((e) => ({ e, basis: '/geschichten', sammlung: 'geschichten' }));
  const a = (await getCollection('anhaenge')).map((e) => ({ e, basis: '/wissen', sammlung: 'anhaenge' }));
  const w = (await getCollection('web')).map((e) => ({ e, basis: '/verein/beitraege', sammlung: 'web' }));
  return [...g, ...a, ...w].map(({ e, basis, sammlung }) => ({
    id: e.id, url: `${basis}/${e.id}`, sammlung, body: e.body ?? '', ...e.data,
  })) as Eintrag[];
}

export function sortiereBroschuere(a: Eintrag, b: Eintrag) {
  return (a.broschuere ?? 99) - (b.broschuere ?? 99) || (a.seiten[0] ?? 0) - (b.seiten[0] ?? 0) || a.title.localeCompare(b.title, 'de');
}

export async function schlagwortIndex() {
  const alle = await alleBeitraege();
  const map = new Map<string, { name: string; eintraege: Eintrag[] }>();
  for (const e of alle) {
    for (const s of [...e.schlagworte, ...e.orte]) {
      const k = slugify(s);
      if (!k) continue;
      if (!map.has(k)) map.set(k, { name: s, eintraege: [] });
      map.get(k)!.eintraege.push(e);
    }
  }
  return map;
}

export async function autorenIndex() {
  const alle = await alleBeitraege();
  const map = new Map<string, { name: string; eintraege: Eintrag[] }>();
  for (const e of alle) {
    for (const a of e.autoren) {
      const k = slugify(a);
      if (!k) continue;
      if (!map.has(k)) map.set(k, { name: a, eintraege: [] });
      map.get(k)!.eintraege.push(e);
    }
  }
  return map;
}

export function markdownFassung(e: Eintrag, siteUrl: string): string {
  const fm = [
    `title: "${e.title.replace(/"/g, '\\"')}"`,
    e.autoren.length ? `autoren: [${e.autoren.map((a) => `"${a}"`).join(', ')}]` : null,
    e.broschuere ? `quelle: "Marinekameradschaft KSS e.V., KSS-Broschüre Teil ${e.broschuere}"` : e.datum ? `datum: "${e.datum}"` : null,
    e.projekte.length ? `projekte: [${e.projekte.map((a) => `"${a}"`).join(', ')}]` : null,
    e.schiffe.length ? `schiffe: [${e.schiffe.map((a) => `"${a}"`).join(', ')}]` : null,
    e.zeitraum ? `zeitraum: "${e.zeitraum}"` : null,
    `url: "${siteUrl}${e.url}"`,
    `lizenz: "Texte unverändert; Rechte bei Marinekameradschaft KSS e.V. und den Autoren. Siehe ${siteUrl}/quellen"`,
  ].filter(Boolean).join('\n');
  return `---\n${fm}\n---\n\n# ${e.title}\n\n${e.zusammenfassung ? `> ${e.zusammenfassung}\n\n` : ''}${e.body.trim()}\n`;
}
