/* Übernimmt die Vereinsbeiträge (Veranstaltungen) von der archivierten Website
   marinekameradschaft-kss.de. Der Text wird unverändert übernommen, nur die
   HTML-Auszeichnung wird nach Markdown überführt. */
import fs from 'node:fs';
import path from 'node:path';

const QUELLE = process.argv[2];
const ZIEL = 'content/web';
const BILDZIEL = 'public/webbilder';
fs.mkdirSync(ZIEL, { recursive: true });
fs.mkdirSync(BILDZIEL, { recursive: true });

const ent = (s) => s
  .replace(/&#8222;/g, '„').replace(/&#8220;/g, '“').replace(/&#8221;/g, '“').replace(/&#8218;/g, '‚')
  .replace(/&#8216;/g, '‚').replace(/&#8217;/g, '’').replace(/&#8211;/g, '–').replace(/&#8212;/g, '—')
  .replace(/&#8230;/g, '…').replace(/&nbsp;/g, ' ').replace(/&auml;/g, 'ä').replace(/&ouml;/g, 'ö')
  .replace(/&uuml;/g, 'ü').replace(/&Auml;/g, 'Ä').replace(/&Ouml;/g, 'Ö').replace(/&Uuml;/g, 'Ü')
  .replace(/&szlig;/g, 'ß').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&#(\d+);/g, (_, c) => String.fromCharCode(+c));

const slugify = (s) => s.toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss')
  .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0, 80);

function nachMarkdown(html, bilder) {
  let s = html;
  s = s.replace(/<!--.*?-->/gs, '');
  s = s.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
  // Bilder merken und als Marke einsetzen
  s = s.replace(/<img[^>]*src="([^"]+)"[^>]*>/g, (m, src) => {
    const bild = bilder.find((b) => m.includes(b.roh) || src.includes(b.basis));
    return bild ? `\n\n@@BILD:${bild.basis}@@\n\n` : '';
  });
  s = s.replace(/<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g, (m, href, txt) => {
    const t = txt.replace(/<[^>]+>/g, '').trim();
    if (!t) return '';
    return /^https?:/.test(href) && !href.includes('marinekameradschaft-kss.de') ? `[${t}](${href})` : t;
  });
  s = s.replace(/<(strong|b)>([\s\S]*?)<\/\1>/g, '**$2**');
  s = s.replace(/<(em|i)>([\s\S]*?)<\/\1>/g, '*$2*');
  s = s.replace(/<br\s*\/?>/g, '\n');
  s = s.replace(/<li[^>]*>([\s\S]*?)<\/li>/g, (m, t) => `- ${t.replace(/<[^>]+>/g, '').trim()}\n`);
  s = s.replace(/<\/(p|div|ul|ol|h[1-6]|figure|figcaption)>/g, '\n\n');
  s = s.replace(/<h([1-6])[^>]*>/g, (m, n) => `\n\n${'#'.repeat(Math.min(6, Number(n) + 1))} `);
  s = s.replace(/<[^>]+>/g, '');
  s = ent(s);
  s = s.replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  return s;
}

const dateien = fs.readdirSync(QUELLE).filter((f) => f.endsWith('.html'));
// Nur Beiträge, die es nicht schon aus den Broschüren gibt: das Vereinsleben.
const istVeranstaltung = (f, html) =>
  /category-veranstaltungen|category-allgemein/.test(html) ||
  /^(kameradschaftstreffen|jaehrliche-mitgliederversammlung|maiauslaufen|herbsttreffen|mitgliederversammlung)/.test(f);

let n = 0, uebersprungen = 0;
const bekannteTitel = new Set();
for (const ordner of ['content/geschichten', 'content/anhaenge']) {
  for (const f of fs.readdirSync(ordner)) {
    const t = fs.readFileSync(path.join(ordner, f), 'utf8').match(/^title:\s*"(.+?)"/m);
    if (t) bekannteTitel.add(t[1].toLowerCase().replace(/[^a-zäöüß0-9]/g, ''));
  }
}

for (const f of dateien.sort()) {
  const roh = fs.readFileSync(path.join(QUELLE, f), 'utf8');
  const art = roh.match(/<article[\s\S]*?<\/article>/);
  if (!art) continue;
  const a = art[0];
  if (!istVeranstaltung(f, a)) { uebersprungen++; continue; }

  const tit = a.match(/<h1[^>]*class="entry-title"[^>]*>([\s\S]*?)<\/h1>/);
  if (!tit) continue;
  const titel = ent(tit[1].replace(/<[^>]+>/g, '')).trim();
  const norm = titel.toLowerCase().replace(/[^a-zäöüß0-9]/g, '');
  if (bekannteTitel.has(norm)) { uebersprungen++; continue; }

  const datum = (a.match(/<time[^>]*class="entry-date published"[^>]*datetime="([\d-]{10})/) || a.match(/datetime="([\d-]{10})/) || [])[1] || '';
  const autor = ent(((a.match(/rel="author"[^>]*>([\s\S]*?)</) || [])[1] || '').replace(/<[^>]+>/g, '')).trim();

  const inhalt = a.match(/<div class="entry-content">([\s\S]*?)<\/div><!--|<div class="entry-content">([\s\S]*?)<footer/);
  let ic = inhalt ? (inhalt[1] || inhalt[2]) : '';
  if (!ic) {
    const i = a.indexOf('entry-content');
    if (i < 0) continue;
    ic = a.slice(i, a.indexOf('entry-footer', i) > 0 ? a.indexOf('entry-footer', i) : a.length);
  }

  // Bilder des Beitrags einsammeln
  const bilder = [];
  for (const m of a.matchAll(/<img[^>]*src="([^"]+\.(?:jpg|jpeg|png|gif))"[^>]*>/gi)) {
    const src = m[1];
    if (/srpthumb|logo|avatar|smilie|spacer|pixel/i.test(src)) continue;
    const basis = decodeURIComponent(src.split('/').pop().split('?')[0]);
    const alt = ent(((m[0].match(/alt="([^"]*)"/) || [])[1] || '')).trim();
    if (!bilder.some((b) => b.basis === basis)) bilder.push({ roh: m[0], basis, alt, src });
  }

  const md = nachMarkdown(ic, bilder);
  if (md.replace(/@@BILD:[^@]+@@/g, '').trim().length < 120) { uebersprungen++; continue; }

  const slug = slugify(titel);
  const jahr = datum.slice(0, 4);
  const kategorie = /kameradschaftstreffen|mitgliederversammlung|maiauslaufen|herbsttreffen|familientreffen/i.test(titel) ? 'verein' : 'verein';
  const fm = [
    '---',
    `title: "${titel.replace(/"/g, '\\"')}"`,
    autor && autor !== 'admin' ? `autoren: ["${autor}"]` : 'autoren: []',
    `kategorie: "${kategorie}"`,
    'rubrik: "Aus dem Vereinsleben"',
    datum ? `datum: "${datum}"` : null,
    jahr ? `zeitraum: "${jahr}"` : null,
    `zusammenfassung: "Bericht von der Website der Marinekameradschaft KSS e.V.${datum ? `, veröffentlicht am ${datum.split('-').reverse().join('.')}` : ''}."`,
    'schlagworte: ["Vereinsleben"]',
    'quelle: "Website der Marinekameradschaft KSS e.V. (marinekameradschaft-kss.de), überliefert im Internet Archive"',
    '---',
  ].filter(Boolean).join('\n');

  fs.writeFileSync(path.join(ZIEL, `${slug}.md`), `${fm}\n\n${md}\n`);
  n++;
  // Bilder kopieren
  for (const b of bilder) {
    const kandidaten = [
      path.join(QUELLE, 'wp-content'),
    ];
    // Datei im Archivbaum suchen
    const suche = (dir) => {
      let treffer = null;
      const stack = [dir];
      while (stack.length && !treffer) {
        const d = stack.pop();
        let eintr = [];
        try { eintr = fs.readdirSync(d, { withFileTypes: true }); } catch { continue; }
        for (const e of eintr) {
          const p = path.join(d, e.name);
          if (e.isDirectory()) stack.push(p);
          else if (e.name === b.basis) { treffer = p; break; }
        }
      }
      return treffer;
    };
    const gefunden = suche(kandidaten[0]) || suche(QUELLE);
    if (gefunden) {
      const ziel = path.join(BILDZIEL, b.basis);
      if (!fs.existsSync(ziel)) fs.copyFileSync(gefunden, ziel);
      b.gefunden = true;
    }
  }
  // Bildmarken ersetzen
  let inhaltText = fs.readFileSync(path.join(ZIEL, `${slug}.md`), 'utf8');
  inhaltText = inhaltText.replace(/@@BILD:([^@]+)@@/g, (m, basis) => {
    const b = bilder.find((x) => x.basis === basis);
    if (!b || !b.gefunden) return '';
    return `![${b.alt || titel}](/webbilder/${basis})`;
  });
  fs.writeFileSync(path.join(ZIEL, `${slug}.md`), inhaltText.replace(/\n{3,}/g, '\n\n'));
}
console.log(n, 'Vereinsbeiträge übernommen,', uebersprungen, 'übersprungen');
console.log(fs.readdirSync(BILDZIEL).length, 'Bilder kopiert');
