import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { alleBeitraege, sortiereBroschuere, markdownFassung } from '../lib/inhalt';
import { ereignisse } from '../lib/chronik';
import { SITE } from '../lib/site';

export const GET: APIRoute = async () => {
  const alle = (await alleBeitraege()).sort(sortiereBroschuere);
  const schiffe = (await getCollection('schiffe')).sort((a, b) => a.data.reihenfolge - b.data.reihenfolge);
  const ev = await ereignisse();
  let t = `# ${SITE.name} – Volltext\n\n${SITE.description}\n\nQuelle: Marinekameradschaft KSS e.V. (1996–2021). Alle Broschürentexte unverändert. Rechte: siehe ${SITE.url}/quellen\n\n`;
  t += `\n\n# Die Schiffe\n\n`;
  for (const s of schiffe) {
    const d = s.data;
    t += `## ${d.name} (${d.klasse}, Projekt ${d.projekt})\n\n`;
    const felder: [string, string | undefined][] = [['Typ', d.typ], ['Bordnummern', d.bordnummern.join(', ')], ['Sowjetischer Name', d.sowjetischerName], ['Bauwerft', d.bauwerft], ['Stapellauf', d.stapellauf], ['Indienststellung', d.indienststellung], ['Außerdienststellung', d.ausserdienststellung], ['Verbleib', d.verbleib], ['Stützpunkt', d.stuetzpunkt], ['Verband', d.verband]];
    for (const [k, v] of felder) if (v) t += `- ${k}: ${v}\n`;
    t += `\n${(s.body ?? '').trim()}\n\n`;
  }
  t += `\n\n# Ereignistafel 1956–1991\n\n`;
  let jahr = 0;
  for (const e of ev) {
    if (e.jahr !== jahr) { jahr = e.jahr; t += `\n## ${jahr}\n\n`; }
    t += `- ${e.datumText || e.datum}: ${e.text}\n`;
  }
  t += `\n\n# Beiträge\n\n`;
  for (const e of alle) t += `\n\n---\n\n${markdownFassung(e, SITE.url)}`;
  return new Response(t, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
