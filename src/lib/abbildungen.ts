import katalog0305 from '../../content/data/fotos-teil-03-05.json';
import katalog0608 from '../../content/data/fotos-teil-06-08.json';
import katalog0911 from '../../content/data/fotos-teil-09-11.json';
import rohfotos from '../../content/data/pdffotos.json';
import nachweise from '../../content/data/bildnachweis.json';

type Roh = { teil: string; seite: number; datei: string; w: number; h: number };
const katalog = [...(katalog0305 as any[]), ...(katalog0608 as any[]), ...(katalog0911 as any[])];

function schluessel(teil: number, pdfteil?: string) {
  return `teil-${String(teil).padStart(2, '0')}${pdfteil ?? ''}`;
}

/** Alle extrahierten Bildbereiche einer Broschürenseite, in Lesereihenfolge. */
export function bilderDerSeite(teil: number, seite: number, pdfteil?: string) {
  const k = schluessel(teil, pdfteil);
  return (rohfotos as Roh[])
    .filter((f) => f.teil === k && f.seite === seite)
    .sort((a, b) => a.datei.localeCompare(b.datei, 'de', { numeric: true }))
    .map((f) => {
      const kat = katalog.find((x) => x.datei === f.datei);
      return {
        src: `/broschueren/fotos/${f.datei}`,
        w: f.w, h: f.h,
        brauchbar: kat ? kat.brauchbar !== false : true,
        motiv: kat?.motiv ?? '',
        art: kat?.art ?? 'foto',
      };
    });
}

const marke = /<p>\s*<em>\s*Abbildung\s*\(Teil\s*([0-9]+)(?:\s*([a-c]))?,\s*S\.\s*([0-9]+)\)\s*:?\s*([\s\S]*?)<\/em>\s*<\/p>/g;

/**
 * Ersetzt die Abbildungsmarken im gerenderten Artikeltext durch die zugehörigen
 * Bilder aus der Broschüre. Der Text der Autoren bleibt unangetastet; ersetzt
 * wird ausschließlich die vom Archiv gesetzte Marke, und zwar an genau der
 * Stelle, an der sie steht.
 */
export function abbildungenEinsetzen(html: string, pdfteilDesArtikels?: string) {
  const verbraucht = new Map<string, number>();
  let eingesetzt = 0;
  const neu = html.replace(marke, (voll, teilS, teilBuchstabe, seiteS, beschriftungRoh) => {
    const teil = Number(teilS);
    const seite = Number(seiteS);
    const pdfteil = teilBuchstabe || pdfteilDesArtikels;
    const liste = bilderDerSeite(teil, seite, pdfteil).filter((b) => b.brauchbar);
    const k = `${teil}${pdfteil ?? ''}-${seite}`;
    const i = verbraucht.get(k) ?? 0;
    const bild = liste[i];
    verbraucht.set(k, i + 1);
    const beschriftung = beschriftungRoh.replace(/\s+/g, ' ').trim();
    if (!bild) {
      // Kein Bildbereich vorhanden: die Marke bleibt als Hinweis stehen.
      return voll;
    }
    eingesetzt++;
    const nachweis = (nachweise as Record<string, string>)[String(teil)] ?? '';
    const alt = beschriftung.replace(/"/g, '&quot;') || `Abbildung aus der KSS-Broschüre Teil ${teil}, Seite ${seite}`;
    return `<figure class="bild-im-text"><a href="${bild.src}" target="_blank" rel="noopener">` +
      `<img src="${bild.src}" alt="${alt}" loading="lazy" decoding="async" width="${bild.w}" height="${bild.h}" />` +
      `</a><figcaption>${beschriftung ? beschriftung + ' ' : ''}` +
      `<span class="herkunft">Broschüre Teil ${teil}, Seite ${seite}</span>` +
      (nachweis ? `<span class="nachweis">Bildnachweis des Heftes: ${nachweis}</span>` : '') +
      `</figcaption></figure>`;
  });
  return { html: neu, eingesetzt };
}

/** Seiten, deren Bilder bereits im Text stehen – für die Nachlese am Artikelende. */
export function markierteSeiten(rohMarkdown: string) {
  const s = new Set<string>();
  for (const m of rohMarkdown.matchAll(/\*Abbildung\s*\(Teil\s*([0-9]+)([a-c])?,\s*S\.\s*([0-9]+)\)/g)) {
    s.add(`${m[1]}${m[2] ?? ''}-${m[3]}`);
  }
  return s;
}
