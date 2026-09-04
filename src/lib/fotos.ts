import manifest from '../../content/data/pdffotos.json';
import bildunterschriften from '../../content/data/bildunterschriften.json';

type Foto = { teil: string; seite: number; datei: string; w: number; h: number };
type Cap = { teil: number; pdfteil?: string; seite: number; bildunterschrift: string };

function key(teil: number, pdfteil?: string) {
  return `teil-${String(teil).padStart(2, '0')}${pdfteil ?? ''}`;
}
function seitenBereich(seiten: number[]): [number, number] {
  if (!seiten?.length) return [0, -1];
  return [Math.min(...seiten), Math.max(...seiten)];
}

export function fotosFuer(teil: number, seiten: number[], pdfteil?: string) {
  const k = key(teil, pdfteil);
  const [a, b] = seitenBereich(seiten);
  const caps = (bildunterschriften as Cap[]).filter((c) => c.teil === teil && (c.pdfteil ?? '') === (pdfteil ?? ''));
  return (manifest as Foto[])
    .filter((f) => f.teil === k && f.seite >= a && f.seite <= b)
    // Titelseite (Seite 1) ausblenden – die ist die Deckblatt-Collage
    .filter((f) => f.seite > 1)
    .map((f) => {
      const proSeite = (manifest as Foto[]).filter((x) => x.teil === k && x.seite === f.seite).length;
      const cap = caps.find((c) => c.seite === f.seite);
      return {
        src: `/broschueren/fotos/${f.datei}`,
        seite: f.seite,
        w: f.w,
        h: f.h,
        bildunterschrift: cap && proSeite === 1 ? cap.bildunterschrift : '',
      };
    });
}

export function alleFotos() {
  return (manifest as Foto[]).filter((f) => f.seite > 1).map((f) => {
    const m = f.teil.match(/^teil-(\d+)([a-c]?)$/);
    const teil = m ? Number(m[1]) : 0;
    const pdfteil = m?.[2] || undefined;
    const cap = (bildunterschriften as Cap[]).find((c) => c.teil === teil && (c.pdfteil ?? '') === (pdfteil ?? '') && c.seite === f.seite);
    return { src: `/broschueren/fotos/${f.datei}`, teil, pdfteil, seite: f.seite, w: f.w, h: f.h, bildunterschrift: cap?.bildunterschrift ?? '' };
  });
}

export function seitenBilder(teil: number, seiten: number[], pdfteil?: string) {
  const k = key(teil, pdfteil);
  const [a, b] = seitenBereich(seiten);
  const out: { nr: number; thumb: string; src: string }[] = [];
  for (let n = a; n <= b && n > 0; n++) {
    const nn = String(n).padStart(2, '0');
    out.push({ nr: n, thumb: `/broschueren/seiten/${k}/klein/s-${nn}.jpg`, src: `/broschueren/seiten/${k}/s-${nn}.jpg` });
  }
  return out;
}

export function seitenAnzahl(teil: number, pdfteil?: string): number {
  const k = key(teil, pdfteil);
  const counts = (seitenzahlen as Record<string, number>);
  return counts[k] ?? 0;
}
import seitenzahlen from '../../content/data/seitenzahlen.json';
