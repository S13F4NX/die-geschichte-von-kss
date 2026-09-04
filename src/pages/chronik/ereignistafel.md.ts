import type { APIRoute } from 'astro';
import { ereignisse } from '../../lib/chronik';
import einleitung from '../../../content/data/ereignistafel-einleitung.md?raw';
export const GET: APIRoute = async () => {
  const alle = await ereignisse();
  let md = `# Ereignistafel der Küstenschutzschiffe der Volksmarine 1956–1991\n\nQuelle: Marinekameradschaft KSS e.V., KSS-Broschüre Teil 11 (2013), Anhang 5, Bearbeitungsschluss Dezember 2012. Online: https://die-geschichte-von-kss.de/chronik\n\n${einleitung.trim()}\n`;
  let jahr = 0;
  for (const e of alle) {
    if (e.jahr !== jahr) { jahr = e.jahr; md += `\n## ${jahr}\n\n`; }
    md += `- **${e.datumText || e.datum}** – ${e.text}\n`;
  }
  return new Response(md, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};
