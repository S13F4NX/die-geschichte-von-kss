import { getCollection } from 'astro:content';
import { slugify } from './site';

export async function schiffsIndex() {
  const schiffe = (await getCollection('schiffe')).sort((a, b) => a.data.reihenfolge - b.data.reihenfolge);
  const slugs = new Map<string, string>();
  for (const s of schiffe) {
    slugs.set(slugify(s.data.name), s.id);
    for (const b of s.data.bordnummern) slugs.set(slugify(b), s.id);
    // Kurzformen
    if (s.data.name.startsWith('Berlin')) slugs.set('berlin', s.id);
  }
  return { schiffe, slugs };
}

/** Liefert Schiffs-URL für einen Namen aus dem Frontmatter (oder null, wenn kein Datenblatt existiert). */
export function schiffUrl(slugs: Map<string, string>, name: string): string | null {
  const k = slugify(name);
  if (slugs.has(k)) return `/schiffe/${slugs.get(k)}`;
  // „KSS 1-61“ → 1-61
  const m = name.match(/(\d-\d\d|\d{3})$/);
  if (m && slugs.has(slugify(m[1]))) return `/schiffe/${slugs.get(slugify(m[1]))}`;
  return null;
}

export function erwaehntSchiff(text: string, name: string, bordnummern: string[]): boolean {
  const n = name.replace(' – Hauptstadt der DDR', '');
  const re = new RegExp(`[„"']${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[“"']`);
  if (re.test(text)) return true;
  for (const b of bordnummern) {
    if (/^\d-\d\d$/.test(b) && text.includes(b)) return true;
    if (/^\d{3}$/.test(b) && new RegExp(`\\(${b}\\)|KSS ${b}\\b`).test(text)) return true;
  }
  return false;
}
