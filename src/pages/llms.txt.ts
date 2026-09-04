import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { alleBeitraege, sortiereBroschuere } from '../lib/inhalt';
import { SITE, KATEGORIEN } from '../lib/site';

export const GET: APIRoute = async () => {
  const alle = (await alleBeitraege()).sort(sortiereBroschuere);
  const schiffe = (await getCollection('schiffe')).sort((a, b) => a.data.reihenfolge - b.data.reihenfolge);
  const broschueren = (await getCollection('broschueren')).sort((a, b) => a.data.teil - b.data.teil);
  const u = (p: string) => `${SITE.url}${p}`;
  const zeile = (e: any) => `- [${e.title}](${u(e.url)}.md)${e.autoren.length ? ` – ${e.autoren.join(', ')}` : ''}${e.zusammenfassung ? `: ${e.zusammenfassung}` : ''}`;

  let t = `# ${SITE.name}\n\n> ${SITE.description}\n\n`;
  t += `Dieses Archiv dokumentiert die Küstenschutzschiffe (KSS) der Seestreitkräfte/Volksmarine der DDR 1956–1990: Projekt 50 (NATO: Riga-Klasse, 4 Schiffe, 1956–1977), Projekt 1159 (Koni-Klasse, 3 Schiffe: „Rostock“, „Berlin – Hauptstadt der DDR“, „Halle“, 1978–1990) und Projekt 133.1 (Parchim-Klasse, 16 U-Jagd-Schiffe, 1981–1990). Die Inhalte stammen aus den zwölf Broschüren „Küstenschutzschiffe (KSS) – 34 Jahre im Dienst der Volksmarine“ (1999–2013) und der Website der Marinekameradschaft KSS e.V., Rostock-Warnemünde (Verein 1996–2021). Alle Broschürentexte sind unverändert wiedergegeben. Jede Seite ist zusätzlich als Markdown verfügbar (URL + „.md“). Sprache: Deutsch.\n\n`;
  t += `## Einstieg\n\n- [Startseite](${u('/')})\n- [Die Schiffe](${u('/schiffe')}): Projektseiten und Datenblätter aller Einheiten\n- [Ereignistafel 1956–1991](${u('/chronik')}) – auch als [JSON](${u('/chronik/ereignistafel.json')}) und [Markdown](${u('/chronik/ereignistafel.md')})\n- [Glossar](${u('/glossar')}): Abkürzungen und Begriffe der Volksmarine\n- [Quellen und Urheber](${u('/quellen')})\n- [Vollständige Textfassung aller Beiträge](${u('/llms-full.txt')})\n\n`;
  t += `## Schiffe\n\n${schiffe.map((s) => `- [${s.data.name}](${u('/schiffe/' + s.id)}) – ${s.data.klasse}${s.data.zusammenfassung ? ': ' + s.data.zusammenfassung : ''}`).join('\n')}\n\n`;
  t += `## Broschüren\n\n${broschueren.map((b) => `- [Teil ${b.data.teil} (${b.data.jahr})](${u('/broschueren/teil-' + b.data.teil)})${b.data.zusammenfassung ? ': ' + b.data.zusammenfassung : ''}`).join('\n')}\n\n`;
  for (const [k, info] of Object.entries(KATEGORIEN)) {
    const es = alle.filter((e) => e.kategorie === k && e.sammlung === 'geschichten');
    if (es.length) t += `## ${info.name}\n\n${es.map(zeile).join('\n')}\n\n`;
  }
  const anh = alle.filter((e) => e.sammlung === 'anhaenge');
  if (anh.length) t += `## Technik, Daten und Anhänge\n\n${anh.map(zeile).join('\n')}\n\n`;
  const web = alle.filter((e) => e.sammlung === 'web');
  if (web.length) t += `## Der Verein und sein Leben\n\n${web.map(zeile).join('\n')}\n\n`;
  return new Response(t, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
