import { chromium, devices } from 'playwright';
const B = 'http://localhost:4399';
const seiten = [
  ['start', '/'], ['schiffe', '/schiffe'], ['projekt', '/schiffe/projekt-1159'],
  ['schiff', '/schiffe/rostock'], ['chronik', '/chronik'], ['geschichten', '/geschichten'],
  ['artikel', '/geschichten/t06-als-kesselgast-auf-kss-1-61'], ['bilder', '/bilder'],
  ['broschuere', '/broschueren/teil-6'], ['personen', '/personen'], ['verein', '/verein'],
];
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 13'] });
const page = await ctx.newPage();
const befunde = [];
for (const [name, pfad] of seiten) {
  await page.goto(B + pfad, { waitUntil: 'networkidle' });
  const mass = await page.evaluate(() => {
    const d = document.documentElement;
    const ueber = [];
    for (const el of document.querySelectorAll('body *')) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && (r.right > window.innerWidth + 1 || r.left < -1)) {
        const s = el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0,2).join('.') : '');
        ueber.push(`${s} [${Math.round(r.left)}..${Math.round(r.right)}]`);
      }
    }
    // Zu kleine Tippziele
    const klein = [];
    for (const el of document.querySelectorAll('a, button')) {
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0 && (r.height < 32 || r.width < 24)) {
        klein.push(`${el.tagName.toLowerCase()}:${(el.textContent||'').trim().slice(0,24)} ${Math.round(r.width)}x${Math.round(r.height)}`);
      }
    }
    // Zu kleine Schrift
    const schrift = new Set();
    for (const el of document.querySelectorAll('p, li, td, dd, span, figcaption')) {
      const f = parseFloat(getComputedStyle(el).fontSize);
      if (f && f < 13 && (el.textContent||'').trim().length > 10) schrift.add(`${el.tagName.toLowerCase()} ${f}px`);
    }
    return {
      scrollBreite: d.scrollWidth, fensterBreite: window.innerWidth,
      ueber: [...new Set(ueber)].slice(0, 8),
      klein: [...new Set(klein)].slice(0, 8),
      schrift: [...schrift].slice(0, 5),
    };
  });
  befunde.push({ name, pfad, ...mass });
  await page.screenshot({ path: `/tmp/mobil-${name}.png`, fullPage: false });
}
await browser.close();
for (const b of befunde) {
  const ueberlauf = b.scrollBreite > b.fensterBreite + 1;
  console.log(`\n== ${b.name} (${b.pfad})`);
  console.log(`   Breite: ${b.scrollBreite} / ${b.fensterBreite} ${ueberlauf ? '  ÜBERLAUF' : 'ok'}`);
  if (b.ueber.length) console.log('   ragt heraus:', b.ueber.join(' | '));
  if (b.klein.length) console.log('   kleine Ziele:', b.klein.join(' | '));
  if (b.schrift.length) console.log('   kleine Schrift:', b.schrift.join(', '));
}
