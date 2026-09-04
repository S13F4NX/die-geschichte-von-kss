// Einmaliger Import: Seitenbilder, Foto-Ausschnitte und PDFs der Broschüren in public/ übernehmen.
// Aufruf: node scripts/import-broschueren.mjs <seitenDir> <fotosDir> <pdfDir>
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const [seitenDir, fotosDir, pdfDir] = process.argv.slice(2);
if (!seitenDir || !fotosDir || !pdfDir) { console.error('Aufruf: node scripts/import-broschueren.mjs <seitenDir> <fotosDir> <pdfDir>'); process.exit(1); }
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const pubSeiten = path.join(root, 'public/broschueren/seiten');
const pubFotos = path.join(root, 'public/broschueren/fotos');
const pubPdf = path.join(root, 'public/broschueren/pdf');
fs.mkdirSync(pubSeiten, { recursive: true }); fs.mkdirSync(pubFotos, { recursive: true }); fs.mkdirSync(pubPdf, { recursive: true });

const PDFS = { 'teil-02': 'broschuere2.pdf', 'teil-03': 'broschuere3.pdf', 'teil-04': 'kss_broschuere_4.pdf', 'teil-05': 'broschuere5.pdf', 'teil-06': 'broschuere_teil6.pdf', 'teil-07': 'broschuere_teil7.pdf', 'teil-08': 'broschuere8.pdf', 'teil-09': 'Broschuere9.pdf', 'teil-10': 'KSS Broschuere 2011 - Teil 10.pdf', 'teil-11a': '2 Text und Anhang 1 bis 2.pdf', 'teil-11b': '3 Anhang 3.pdf', 'teil-11c': '4 Anhang 4 bis 5.pdf' };

// 1. Seitenbilder
const seitenzahlen = {};
for (const key of fs.readdirSync(seitenDir).filter((d) => d.startsWith('teil-')).sort()) {
  const src = path.join(seitenDir, key);
  const dst = path.join(pubSeiten, key); const dstKlein = path.join(dst, 'klein');
  fs.mkdirSync(dstKlein, { recursive: true });
  const files = fs.readdirSync(src).filter((f) => f.endsWith('.jpg')).sort();
  seitenzahlen[key] = files.length;
  for (const f of files) {
    const nn = f.match(/(\d+)\.jpg$/)[1].padStart(2, '0');
    const out = path.join(dst, `s-${nn}.jpg`);
    if (!fs.existsSync(out)) await sharp(path.join(src, f)).resize({ width: 900 }).jpeg({ quality: 70, mozjpeg: true }).toFile(out);
    const outK = path.join(dstKlein, `s-${nn}.jpg`);
    if (!fs.existsSync(outK)) await sharp(path.join(src, f)).resize({ width: 220 }).jpeg({ quality: 60, mozjpeg: true }).toFile(outK);
  }
  console.log(key, files.length, 'Seiten');
}
fs.writeFileSync(path.join(root, 'content/data/seitenzahlen.json'), JSON.stringify(seitenzahlen, null, 1));

// 2. Foto-Ausschnitte
const manifest = JSON.parse(fs.readFileSync(path.join(fotosDir, 'manifest.json'), 'utf8'));
const out = [];
for (const m of manifest) {
  if (m.w < 250 || m.h < 180) continue;
  const dst = path.join(pubFotos, m.datei);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  const img = sharp(path.join(fotosDir, m.datei));
  const meta = await img.metadata();
  const w = Math.min(meta.width, 1400);
  if (!fs.existsSync(dst)) await img.resize({ width: w }).jpeg({ quality: 80, mozjpeg: true }).toFile(dst);
  const h = Math.round(meta.height * (w / meta.width));
  out.push({ teil: m.teil, seite: m.seite, datei: m.datei, w, h });
}
fs.writeFileSync(path.join(root, 'content/data/pdffotos.json'), JSON.stringify(out, null, 1));
console.log('Fotos:', out.length);

// 3. PDFs
for (const [key, name] of Object.entries(PDFS)) {
  const src = path.join(pdfDir, name);
  if (!fs.existsSync(src)) { console.warn('fehlt:', name); continue; }
  const dst = path.join(pubPdf, `kss-broschuere-${key}.pdf`);
  if (!fs.existsSync(dst)) fs.copyFileSync(src, dst);
}

// 4. Bildunterschriften aus den Broschüren-JSONs
const caps = [];
const bdir = path.join(root, 'content/broschueren');
for (const f of fs.readdirSync(bdir).filter((f) => f.endsWith('.json'))) {
  const j = JSON.parse(fs.readFileSync(path.join(bdir, f), 'utf8'));
  for (const b of j.bilder ?? []) caps.push({ teil: j.teil, pdfteil: b.pdfteil, seite: b.seite, bildunterschrift: b.bildunterschrift ?? '' });
}
fs.writeFileSync(path.join(root, 'content/data/bildunterschriften.json'), JSON.stringify(caps, null, 1));
console.log('Bildunterschriften:', caps.length);
