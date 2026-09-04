import type { APIRoute } from 'astro';
import { ereignisse } from '../../lib/chronik';
export const GET: APIRoute = async () => {
  const alle = await ereignisse();
  const out = {
    name: 'Ereignistafel der Küstenschutzschiffe der Volksmarine 1956–1991',
    quelle: 'Marinekameradschaft KSS e.V., KSS-Broschüre Teil 11 (2013), Anhang 5, Bearbeitungsschluss Dezember 2012',
    url: 'https://die-geschichte-von-kss.de/chronik',
    anzahl: alle.length,
    ereignisse: alle.map(({ id, ...e }) => e),
  };
  return new Response(JSON.stringify(out, null, 1), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
