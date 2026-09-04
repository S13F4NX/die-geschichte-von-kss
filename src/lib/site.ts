export const SITE = {
  name: 'Die Geschichte von KSS',
  claim: 'Küstenschutzschiffe der Volksmarine 1956–1990',
  url: 'https://die-geschichte-von-kss.de',
  description:
    'Digitales Archiv zur Geschichte der Küstenschutzschiffe (KSS) der Volksmarine der DDR: Projekt 50 (Riga-Klasse), Projekt 1159 (Koni-Klasse) und Projekt 133.1 (Parchim-Klasse). Zusammengetragen von der ehemaligen Marinekameradschaft KSS e.V., Rostock-Warnemünde.',
  herausgeber: 'Marinekameradschaft KSS e.V. (1996–2021), Rostock-Warnemünde',
  betreiber: 'Stefan Köhler',
};

export const PROJEKTE: Record<string, { slug: string; name: string; klasse: string; nato: string; zeitraum: string; kurz: string; css: string }> = {
  '50': {
    slug: 'projekt-50',
    name: 'Projekt 50',
    klasse: 'Riga-Klasse',
    nato: 'Riga',
    zeitraum: '1956–1977',
    kurz: 'Vier in der Sowjetunion gebaute Wachschiffe. Mit den beiden ersten Einheiten begann am 15. Dezember 1956 in Saßnitz der Truppenteil KSS.',
    css: 'p50',
  },
  '1159': {
    slug: 'projekt-1159',
    name: 'Projekt 1159',
    klasse: 'Koni-Klasse',
    nato: 'Koni',
    zeitraum: '1978–1990',
    kurz: 'Drei Schiffe aus der Werft Selenodolsk: „Rostock“, „Berlin – Hauptstadt der DDR“ und „Halle“. Mit 96,50 m Länge die größten der drei KSS-Klassen.',
    css: 'p1159',
  },
  '133.1': {
    slug: 'projekt-133-1',
    name: 'Projekt 133.1',
    klasse: 'Parchim-Klasse',
    nato: 'Parchim',
    zeitraum: '1981–1990',
    kurz: 'Sechzehn auf der Peenewerft Wolgast gebaute U-Boot-Abwehr-Schiffe, ab 1. Dezember 1986 als Küstenschutzschiffe 3. Ranges bezeichnet.',
    css: 'p133',
  },
};

export const KATEGORIEN: Record<string, { name: string; slug: string; beschreibung: string }> = {
  episode: { name: 'Episoden und Gedanken', slug: 'episoden', beschreibung: 'Erlebnisberichte, Erinnerungen und historische Beiträge, überwiegend von ehemaligen Angehörigen der Küstenschutzschiffe.' },
  amuesantes: { name: 'Amüsantes', slug: 'amuesantes', beschreibung: 'Die „Antichronik“, wie Teil 2 sie nennt: die Sammlung der lustigen Ereignisse um KSS.' },
  leser: { name: 'Leser melden sich zu Wort', slug: 'leserbriefe', beschreibung: 'Zuschriften, Ergänzungen und Gastbeiträge.' },
  zeitschrift: { name: 'In alten Zeitschriften geblättert', slug: 'zeitschriften', beschreibung: 'Nachdrucke aus Armeerundschau, Ausbilder, Militärwesen und anderen Zeitschriften der DDR.' },
  gedicht: { name: 'Lieder und Gedichte', slug: 'lieder-gedichte', beschreibung: 'Das KSS-Lied und gereimte Bordimpressionen.' },
  technik: { name: 'Technik und Ausbildung', slug: 'technik', beschreibung: 'Waffen, Anlagen, Ausbildung.' },
  verein: { name: 'Vereinsleben', slug: 'vereinsleben', beschreibung: 'Treffen, Versammlungen und Berichte der Marinekameradschaft KSS e.V.' },
  stuetzpunkt: { name: 'Stützpunkte', slug: 'stuetzpunkte', beschreibung: 'Saßnitz, Hohe Düne, Peenemünde.' },
  anhang: { name: 'Anhänge', slug: 'anhaenge', beschreibung: 'Daten, Listen, Tabellen.' },
};

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function projektSlug(p: string): string {
  return PROJEKTE[p]?.slug ?? slugify('projekt-' + p);
}

export function teilLabel(n: number): string {
  return `Teil ${n}`;
}

export function heftPfad(teil: number, pdfteil?: string): string {
  const t = String(teil).padStart(2, '0');
  return `/broschueren/seiten/teil-${t}${pdfteil ?? ''}`;
}

export function textAuszug(md: string, len = 220): string {
  const t = md
    .replace(/^---[\s\S]*?---/, '')
    .replace(/[#>*_`|]/g, ' ')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  return t.length > len ? t.slice(0, len).replace(/\s\S*$/, '') + ' …' : t;
}
