// Zieht die Fotonachweise aus dem Quellennachweis jeder Broschüre.
import fs from 'node:fs';
const out = {};
for (const f of fs.readdirSync('content/broschueren').filter((f) => f.endsWith('.json'))) {
  const j = JSON.parse(fs.readFileSync('content/broschueren/' + f, 'utf8'));
  const q = (j.quellennachweis || '').replace(/\r/g, '');
  // Zeile(n), die mit „Fotos“ oder „Grafiken“ beginnen
  const treffer = [];
  for (const zeile of q.split('\n')) {
    const m = zeile.match(/^\s*\|?\s*(Fotos?|Grafiken?|Fotos der Titelseite|Grafiken Titelblatt)\s*:?\s*\|?\s*(.+?)\s*\|?\s*$/i);
    if (m && m[2] && m[2].length > 3 && !/^-+$/.test(m[2])) treffer.push(`${m[1]}: ${m[2].replace(/\s*\|\s*/g, ', ').trim()}`);
  }
  if (treffer.length) out[j.teil] = treffer.join('; ');
}
fs.writeFileSync('content/data/bildnachweis.json', JSON.stringify(out, null, 1));
console.log(Object.entries(out).map(([k, v]) => `Teil ${k}: ${v.slice(0, 110)}`).join('\n'));
