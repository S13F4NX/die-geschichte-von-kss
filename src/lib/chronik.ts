import { getCollection } from 'astro:content';

export const DEKADEN = [
  { slug: '1956-1959', von: 1956, bis: 1959, name: 'Die Anfänge 1956–1959', kurz: 'Gründung der Seestreitkräfte, Übernahme der ersten KSS des Projekts 50 in Saßnitz.' },
  { slug: '1960-1969', von: 1960, bis: 1969, name: 'Die sechziger Jahre', kurz: 'Namensgebung 1961, Modernisierung in Kronstadt, Verlegung nach Warnemünde, Orkanfahrt 1967.' },
  { slug: '1970-1979', von: 1970, bis: 1979, name: 'Die siebziger Jahre', kurz: 'Ende des Projekts 50, Ausbildung in Baku, Überführung der „Rostock“ und der „Berlin“.' },
  { slug: '1980-1991', von: 1980, bis: 1991, name: 'Die achtziger Jahre bis zum Ende', kurz: 'Projekt 133.1 kommt, KSS „Halle“, Wendezeit und Außerdienststellung 1990.' },
];

export async function ereignisse() {
  const alle = await getCollection('ereignisse');
  return alle.map((e) => e.data).sort((a, b) => (a.datum < b.datum ? -1 : a.datum > b.datum ? 1 : 0));
}

export function dekadeFuer(jahr: number) {
  return DEKADEN.find((d) => jahr >= d.von && jahr <= d.bis) ?? DEKADEN[DEKADEN.length - 1];
}

export function isoZuText(iso: string): string {
  const [j, m, t] = iso.split('-');
  const monate = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
  if (t) return `${Number(t)}. ${monate[Number(m) - 1]} ${j}`;
  if (m) return `${monate[Number(m) - 1]} ${j}`;
  return j;
}
