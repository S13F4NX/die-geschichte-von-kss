import { PROJEKTE, slugify } from './site';

// Die von den Bildagenten erstellten Kataloge. Fehlt eine Datei, ist sie leer.
import t0305 from '../../content/data/fotos-teil-03-05.json';
import t0608 from '../../content/data/fotos-teil-06-08.json';
import t0911 from '../../content/data/fotos-teil-09-11.json';
import webBilder from '../../content/data/archivbilder.json';
import nachweise from '../../content/data/bildnachweis.json';

export type Bild = {
  src: string;
  alt: string;
  bildunterschrift: string;
  motiv: string;
  art: 'foto' | 'zeichnung' | 'dokument' | 'portraet' | 'titelbild';
  projekte: string[];
  schiffe: string[];
  orte: string[];
  personen: string[];
  schlagworte: string[];
  artikel: string | null;
  artikelUrl: string | null;
  herkunft: string;
  herkunftUrl: string | null;
  bildnachweis: string;
  teil?: number;
  seite?: number;
  pdfteil?: string;
};

function artikelUrl(pfad: string | null | undefined): string | null {
  if (!pfad) return null;
  const m = pfad.match(/^(geschichten|anhaenge|web)\/(.+)\.md$/);
  if (!m) return null;
  const basis = m[1] === 'geschichten' ? '/geschichten' : m[1] === 'anhaenge' ? '/wissen' : '/verein/beitraege';
  return `${basis}/${m[2]}`;
}

function ausBroschuere(e: any): Bild {
  const teilKey = e.pdfteil ? `${e.teil}${e.pdfteil}` : `${e.teil}`;
  return {
    src: `/broschueren/fotos/${e.datei}`,
    alt: e.motiv || e.bildunterschrift || 'Abbildung aus einer KSS-Broschüre',
    bildunterschrift: e.bildunterschrift || '',
    motiv: e.motiv || '',
    art: e.art || 'foto',
    projekte: e.projekte ?? [],
    schiffe: e.schiffe ?? [],
    orte: e.orte ?? [],
    personen: e.personen ?? [],
    schlagworte: e.schlagworte ?? [],
    artikel: e.artikel ?? null,
    artikelUrl: artikelUrl(e.artikel),
    herkunft: `KSS-Broschüre Teil ${teilKey}, Seite ${e.seite}`,
    bildnachweis: (nachweise as Record<string, string>)[String(e.teil)] ?? '',
    herkunftUrl: `/broschueren/seiten/teil-${String(e.teil).padStart(2, '0')}${e.pdfteil ?? ''}#seite-${e.seite}`,
    teil: e.teil,
    seite: e.seite,
    pdfteil: e.pdfteil ?? undefined,
  };
}

function ausWeb(e: any): Bild {
  return {
    src: e.src,
    alt: e.alt || e.motiv || e.bildunterschrift || 'Abbildung aus dem Archiv der Marinekameradschaft KSS e.V.',
    bildunterschrift: e.bildunterschrift || '',
    motiv: e.motiv || '',
    art: e.art || 'foto',
    projekte: e.projekte ?? (e.projekt ? [e.projekt] : []),
    schiffe: e.schiffe ?? [],
    orte: e.orte ?? [],
    personen: e.personen ?? [],
    schlagworte: e.schlagworte ?? [],
    artikel: e.artikel ?? null,
    artikelUrl: artikelUrl(e.artikel),
    herkunft: e.herkunft || 'Website der Marinekameradschaft KSS e.V.',
    bildnachweis: e.bildnachweis ?? '',
    herkunftUrl: e.herkunftUrl ?? null,
  };
}

/** Alle Bilder des Archivs, unabhängig davon, ob sie aus einem Heft oder von der Website stammen. */
export function alleBilder(): Bild[] {
  const b = [
    ...([...(t0305 as any[]), ...(t0608 as any[]), ...(t0911 as any[])].filter((e) => e.brauchbar !== false).map(ausBroschuere)),
    ...((webBilder as any[]).map(ausWeb)),
  ];
  // Deckblätter der Hefte gehören auf die Broschürenseite, nicht ins Bildarchiv.
  return b.filter((x) => x.art !== 'titelbild');
}

export const ARTEN: Record<string, { name: string; slug: string; kurz: string }> = {
  foto: { name: 'Fotografien', slug: 'fotos', kurz: 'Aufnahmen von Schiffen, Besatzungen, Übungen und Stützpunkten.' },
  portraet: { name: 'Porträts', slug: 'portraets', kurz: 'Kommandanten, Besatzungsangehörige, Autoren.' },
  zeichnung: { name: 'Zeichnungen und Risse', slug: 'zeichnungen', kurz: 'Seitenrisse, Lagepläne, Karten und Grafiken, unter anderem von Hans Räde und Hans Beyer.' },
  dokument: { name: 'Dokumente', slug: 'dokumente', kurz: 'Urkunden, Zeitungsausschnitte, Formulare und Faksimiles.' },
};

/** Facetten für das Bildarchiv: Klasse, Art, Schiff, Ort. */
export function facetten(bilder: Bild[]) {
  const zaehl = (werte: (b: Bild) => string[]) => {
    const m = new Map<string, { name: string; anzahl: number; bild: Bild }>();
    for (const b of bilder) for (const w of werte(b)) {
      const k = slugify(w);
      if (!k) continue;
      if (!m.has(k)) m.set(k, { name: w, anzahl: 0, bild: b });
      m.get(k)!.anzahl++;
    }
    return m;
  };
  return {
    projekte: zaehl((b) => b.projekte.map((p) => PROJEKTE[p]?.name ?? `Projekt ${p}`)),
    schiffe: zaehl((b) => b.schiffe),
    orte: zaehl((b) => b.orte),
    arten: zaehl((b) => (ARTEN[b.art] ? [ARTEN[b.art].name] : [])),
  };
}
