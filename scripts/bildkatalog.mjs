// Baut den Bildkatalog aus den extrahierten Broschürenfotos, den Bildunterschriften
// der Hefte und den Seitenbereichen der Artikel.
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const rd = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));
const fotos = rd('content/data/pdffotos.json');
const caps = rd('content/data/bildunterschriften.json');

// Artikel-Frontmatter einlesen
function frontmatter(datei) {
  const t = fs.readFileSync(datei, 'utf8');
  const m = t.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return null;
  const d = {};
  for (const line of m[1].split(/\r?\n/)) {
    const mm = line.match(/^(\w+):\s*(.*)$/);
    if (!mm) continue;
    let v = mm[2].trim();
    if (v.startsWith('[')) {
      v = v.slice(1, -1).split(',').map((x) => x.trim().replace(/^"|"$/g, '')).filter(Boolean);
    } else if (v.startsWith('"')) v = v.slice(1, -1);
    else if (/^\d+$/.test(v)) v = Number(v);
    d[mm[1]] = v;
  }
  return d;
}
const artikel = [];
for (const ordner of ['geschichten', 'anhaenge', 'web']) {
  const dir = path.join(root, 'content', ordner);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith('.md'))) {
    const d = frontmatter(path.join(dir, f));
    if (!d) continue;
    artikel.push({ pfad: `${ordner}/${f}`, ...d });
  }
}

const teilNr = (key) => Number(key.match(/teil-(\d+)/)[1]);
const pdfteilOf = (key) => (key.match(/teil-\d+([a-c])$/) || [])[1];

function findeArtikel(teil, pdfteil, seite) {
  const treffer = artikel.filter((a) => a.broschuere === teil && (a.pdfteil ?? undefined) === pdfteil
    && Array.isArray(a.seiten) && a.seiten.length
    && seite >= Math.min(...a.seiten.map(Number)) && seite <= Math.max(...a.seiten.map(Number)));
  // Bei Überschneidung den Artikel mit dem engsten Seitenbereich nehmen
  treffer.sort((a, b) => (Math.max(...a.seiten) - Math.min(...a.seiten)) - (Math.max(...b.seiten) - Math.min(...b.seiten)));
  return treffer[0] ?? null;
}

const zeichnungWort = /grafik|seitenriss|riss|zeichnung|wink-alphabet|karte|plan|rollenbuch|kommandotabelle|gefechtsorganisation|aufbau/i;
const dokumentWort = /berichtigung|literatur|dokument|rollenbuch|kommandotabelle|buch der guten taten|anlagen|wendezeit|kaiserzeit|terminarbeiten|seesack/i;

const out = [];
for (const f of fotos) {
  const teil = teilNr(f.teil);
  const pdfteil = pdfteilOf(f.teil);
  if (f.seite === 1) continue;               // Deckblatt
  const seitenFotos = fotos.filter((x) => x.teil === f.teil && x.seite === f.seite);
  const verhaeltnis = f.w / f.h;
  // Offensichtlich unbrauchbare Ausschnitte aussortieren
  const brauchbar = f.w >= 260 && f.h >= 190 && verhaeltnis > 0.28 && verhaeltnis < 4.2 && f.w * f.h >= 90000;
  if (!brauchbar) continue;

  const a = findeArtikel(teil, pdfteil, f.seite);
  const cap = caps.find((c) => c.teil === teil && (c.pdfteil ?? undefined) === pdfteil && c.seite === f.seite);
  const bildunterschrift = cap && seitenFotos.length === 1 ? (cap.bildunterschrift || '') : '';

  let art = 'foto';
  const titel = a?.title ?? '';
  if (zeichnungWort.test(titel) || zeichnungWort.test(bildunterschrift)) art = 'zeichnung';
  else if (a?.pfad?.startsWith('anhaenge/') && dokumentWort.test(titel)) art = 'dokument';

  const motiv = bildunterschrift ? '' :
    art === 'zeichnung' ? `Zeichnung aus der KSS-Broschüre Teil ${teil}, Seite ${f.seite}${titel ? `, zum Beitrag „${titel}“` : ''}`
    : art === 'dokument' ? `Dokument aus der KSS-Broschüre Teil ${teil}, Seite ${f.seite}${titel ? `, zum Beitrag „${titel}“` : ''}`
    : `Abbildung aus der KSS-Broschüre Teil ${teil}, Seite ${f.seite}${titel ? `, zum Beitrag „${titel}“` : ''}`;

  out.push({
    datei: f.datei, teil, pdfteil: pdfteil ?? null, seite: f.seite,
    brauchbar: true, art,
    motiv,
    bildunterschrift,
    projekte: a?.projekte ?? [],
    schiffe: a?.schiffe ?? [],
    orte: a?.orte ?? [],
    personen: a?.autoren ?? [],
    artikel: a?.pfad ?? null,
    schlagworte: a?.schlagworte ?? [],
  });
}
fs.writeFileSync(path.join(root, 'content/data/fotos-teil-03-05.json'), JSON.stringify(out.filter((x) => x.teil <= 5), null, 1));
fs.writeFileSync(path.join(root, 'content/data/fotos-teil-06-08.json'), JSON.stringify(out.filter((x) => x.teil >= 6 && x.teil <= 8), null, 1));
fs.writeFileSync(path.join(root, 'content/data/fotos-teil-09-11.json'), JSON.stringify(out.filter((x) => x.teil >= 9), null, 1));
const zaehl = {};
for (const o of out) zaehl[o.teil] = (zaehl[o.teil] || 0) + 1;
console.log('Katalog:', out.length, 'Bilder von', fotos.length, 'Ausschnitten');
console.log('je Teil:', zaehl);
console.log('mit Bildunterschrift:', out.filter((o) => o.bildunterschrift).length);
console.log('mit Projektzuordnung:', out.filter((o) => o.projekte.length).length);
console.log('mit Artikel:', out.filter((o) => o.artikel).length);
console.log('Arten:', out.reduce((a, o) => ({ ...a, [o.art]: (a[o.art] || 0) + 1 }), {}));
