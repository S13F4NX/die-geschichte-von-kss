/* Erzeugt die Schiffs-Datenblätter ausschließlich aus belegten Angaben der
   KSS-Broschüren und der Ereignistafel. Jede Angabe trägt ihre Quelle.
   Keine erzählenden Ergänzungen. */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const ereignisse = JSON.parse(fs.readFileSync('content/data/ereignistafel.json', 'utf8'));

const Q = {
  ttd: 'KSS-Broschüre Teil 2, Anhang 1 (Taktisch-technische Daten und Bewaffnung)',
  kdt50: 'KSS-Broschüre Teil 2, Anhang 2 (BCH’s, ACH’s, Kommandanten Pr. 50 und 1159)',
  kdt133: 'KSS-Broschüre Teil 4, Anhang 2 (ACH’s und Kommandanten Pr. 133, 4. Sicherungsbrigade Warnemünde)',
  sowj: 'KSS-Broschüre Teil 6, Anhang 2 (Ergänzende Daten zu den KSS Pr. 50 und 1159, Übersetzung aus dem Russischen; die Broschüre vermerkt dazu: „Eine Garantie für die Richtigkeit aller Angaben kann nicht übernommen werden.“)',
  tafel: 'KSS-Broschüre Teil 11, Anhang 5 (Ereignistafel, Bearbeitungsschluss Dezember 2012)',
  bordnr: 'KSS-Broschüre Teil 5, „KSS Pr. 50: Unterstellung, Status des Truppenteiles, Bordnummern“ von Manfred Kretzschmar und Hans Steike',
};

const slugify = (s) => s.toLowerCase().replace(/ä/g,'ae').replace(/ö/g,'oe').replace(/ü/g,'ue').replace(/ß/g,'ss')
  .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');

// ---- Belegte Angaben ------------------------------------------------------
const riga = [
  { name:'Ernst Thälmann', reihe:1,
    bord:['1-61','401','101','121','141'], bordQ: Q.bordnr,
    bau:'50/1', sowjName:'„Oljen“ (Hirsch)', sowjBau:'120', schiffbauNr:'S-118',
    kiel:'22. August 1954, Werft Nr. 820 in Kaliningrad', stapel:'29. April 1955',
    uebernahmeSU:'27. August 1955; Dienst in der Baltischen Flotte 6. September 1955 bis 27. Februar 1956, in der Nordflotte 20. März bis 14. Juli 1956',
    ind:'15. Dezember 1956 in Saßnitz', aus:'29. August 1977',
    ausHinweis:'Die Ereignistafel nennt den 29. August 1977, der Beitrag „Historie des Projektes 50“ (Teil 11) den 31. August 1977.',
    kdt:[['1956','1958','Korvettenkapitän Kurt Hollatz','verstorben 1968'],['1958','1961','Kapitänleutnant Hermann Strecker','verstorben 28.6.97'],['1961','1965','Kapitänleutnant Werner Ebert',''],['1965','1966','Korvettenkapitän Karl-Heinz Kremkau',''],['1966','1970','Kapitänleutnant Peter Dölling','verstorben 11.5.00'],['1970','1976','Kapitänleutnant Peter Kühn',''],['1976','1977','Kapitänleutnant Manfred Eisenhut','']] },
  { name:'Karl Marx', reihe:2,
    bord:['1-62','501','601','102','122','142'], bordQ: Q.bordnr,
    bau:'50/2', sowjName:'„Sobol“ (Zobel) nach Teil 6; in Teil 5 wird das zweite 1956 übernommene Schiff als „Tur“ (Auerochse) bezeichnet', sowjBau:'111', schiffbauNr:'S-111',
    kiel:'27. September 1952, Werft Nr. 820 in Kaliningrad', stapel:'5. November 1953',
    uebernahmeSU:'13. Oktober 1954; Dienst in der Baltischen Flotte ab 22. Oktober 1954 bis 1956',
    ind:'15. Dezember 1956 in Saßnitz', aus:'31. August 1976',
    verbleib:'Diente nach der Außerdienststellung zeitweilig als Wohnschiff für die neu zu formierenden 1159-Besatzungen.',
    kdt:[['1956','1957','Oberleutnant zur See Helmut Berger',''],['1957','1959','Oberleutnant zur See Manfred Kretzschmar',''],['1959','1964','Oberleutnant zur See Günther Schreiber',''],['1964','1967','Kapitänleutnant Dieter Fröhlich',''],['1967','1975','Kapitänleutnant Lothar Winter',''],['1975','1976','Korvettenkapitän Günter Senf','']] },
  { name:'Karl Liebknecht', reihe:3,
    bord:['601','502','103','123'], bordQ: Q.bordnr,
    bau:'50/3', sowjName:'„Tur“ (Auerochse)', sowjBau:'118', schiffbauNr:'S-120',
    kiel:'24. März 1954, Werft Nr. 820 in Kaliningrad', stapel:'16. Dezember 1954',
    uebernahmeSU:'31. Januar 1955; Dienst in der Baltischen Flotte 9. Juli 1955 bis 27. Februar 1956, in der Nordflotte 20. März 1956 bis 1959',
    ind:'10. Oktober 1959, in Dienst gestellt durch den Minister für Nationale Verteidigung, Armeegeneral Willi Stoph', aus:'1. Oktober 1968',
    verbleib:'Die Bordnummer 123 übernahm nach der Außerdienststellung die „Friedrich Engels“ (vorher 124).',
    kdt:[['1959','1960','Kapitänleutnant Manfred Kretzschmar',''],['1960','1961','Kapitänleutnant Eckhard Wittrien',''],['1961','1964','Kapitänleutnant Fritz Dorn',''],['1964','1966','Kapitänleutnant Karl-Heinz Kremkau',''],['1966','1967','Korvettenkapitän Kurt Urmoneit',''],['1967','1968','Kapitänleutnant Fritz Naumann','']] },
  { name:'Friedrich Engels', reihe:4,
    bord:['701','702','104','124','123'], bordQ: Q.bordnr,
    bau:'50/4', sowjName:'„Enot“ (Waschbär)', sowjBau:'114', schiffbauNr:'S-114',
    kiel:'17. Oktober 1953, Werft Nr. 820 in Kaliningrad', stapel:'9. April 1954',
    uebernahmeSU:'30. Oktober 1954; Dienst in der Baltischen Flotte 10. November 1954 bis 1959',
    ind:'10. Oktober 1959, in Dienst gestellt durch den Minister für Nationale Verteidigung, Armeegeneral Willi Stoph', aus:'10. Oktober 1969, unmittelbar nach der Flottenparade',
    verbleib:'Nach der Außerdienststellung wurden 1969 an Bord Szenen des DEFA-Films „Rottenknechte“ gedreht. Der Beitrag „Historie des Projektes 50“ (Teil 11) hält fest, dass das Schiff danach noch viele Jahre unweit des Peenemünder Hakens als Ziel für die Jagdgeschwader der DDR-Luftstreitkräfte diente.',
    kdt:[['1959','1961','Kapitänleutnant Dietrich Dembiany',''],['1961','1963','Kapitänleutnant Ulrich Korn',''],['1963','1966','Kapitänleutnant Kurt Urmoneit',''],['1966','1967','Kapitänleutnant Lothar Winter',''],['1967','1969','Kapitänleutnant Dieter Sperling','']] },
];

const koni = [
  { name:'Rostock', reihe:5, bord:['141'],
    bau:'1159/1', sowjName:'„Nerpa“ (Ringelrobbe)', sowjBau:'202',
    kiel:'22. Oktober 1974, Werft Nr. 203 „Krasnij Metallist“ in Selenodolsk', stapel:'4. Juni 1974 laut Quelle (die Angabe steht im Widerspruch zum genannten Kiellegungsdatum)',
    uebernahmeSU:'31. Dezember 1977; dokumentiert als „Nerpa“ ab 2. Oktober 1974',
    ueberfuehrung:'15. Mai bis 16. Juni 1978 mit sowjetischer Bordnummer 693 von Sewastopol über Schwarzes Meer, Mittelmeer, Ost-Atlantik, Nordsee und Ostsee nach Warnemünde geschleppt',
    ind:'Kleine Indienststellung am 6. Juli 1978 durch den Chef der 4. Flottille; offiziell am 25. Juli 1978 im Stützpunkt Warnemünde durch den Minister für Nationale Verteidigung, Armeegeneral Heinz Hoffmann',
    aus:'Mit dem 2. Oktober 1990 hörte die Volksmarine auf zu bestehen; die Ereignistafel führt die „Rostock“ unter den Schiffen, die laut Einigungsvertrag zeitweilig noch im Flottendienst verblieben.',
    kdt:[['1978','1983','Korvettenkapitän Günter Senf',''],['1983','1989','Kapitänleutnant Klaus Niehusen',''],['1989','1990','Kapitänleutnant Andreas Lettau','']] },
  { name:'Berlin – Hauptstadt der DDR', reihe:6, bord:['142'],
    bau:'1159/2', sowjName:'„Kretschet“ (Gerfalke)', sowjBau:'203',
    kiel:'19. Januar 1977, Werft Nr. 203 in Selenodolsk', stapel:'3. Juli 1978',
    uebernahmeSU:'31. Dezember 1978; dokumentiert als „Kretschet“ ab 1975',
    ueberfuehrung:'Über das Binnenwasserstraßen-System der Sowjetunion in die Ostsee nach Baltijsk überführt und dort komplettiert',
    ind:'Kleine Indienststellung im Mai 1979 durch den Chef der 4. Flottille; am 10. Mai 1979 stellte der Chef der Volksmarine, Admiral Wilhelm Ehm, das KSS 142 offiziell unter dem Namen „Berlin“ in Dienst. Einige Wochen später wurde der Name in „Berlin – Hauptstadt der DDR“ geändert; die Komplettierung des Namens war von der Berliner Bezirksleitung der SED gefordert worden.',
    aus:'Mit dem 2. Oktober 1990 hörte die Volksmarine auf zu bestehen. Die Ereignistafel nennt die „Berlin“ nicht unter den Schiffen, die danach zeitweilig im Flottendienst verblieben.',
    kdt:[['1979','1980','Korvettenkapitän Bernd Kulbe',''],['1980','1988','Korvettenkapitän Dieter Dziuballe','verstorben 12.8.00'],['1988','1990','Kapitänleutnant Roland Lepke','']] },
  { name:'Halle', reihe:7, bord:['143','F 225'],
    bau:'1159/3', sowjName:'„KSS-149“', sowjBau:'206',
    kiel:'8. April 1983, Werft Nr. 203 in Selenodolsk', stapel:'30. Juni 1984',
    uebernahmeSU:'25. Juni 1985; dokumentiert ab 29. Februar 1983',
    ueberfuehrung:'Über die inneren Gewässer der Sowjetunion in die Ostsee überführt, dort komplettiert und erprobt',
    ind:'28. Januar 1986 als letztes KSS des Projektes 1159 durch den Chef des Stabes der Volksmarine, Konteradmiral Hoffmann',
    aus:'Mit dem 2. Oktober 1990 hörte die Volksmarine auf zu bestehen; die Ereignistafel führt die „Halle“ unter den Schiffen, die laut Einigungsvertrag zeitweilig noch im Flottendienst verblieben.',
    verbleib:'Im Dezember 1990 besuchte die „Halle“ als „F225“ Wilhelmshaven. Die Ereignistafel bezeichnet dies als letzte Fahrt eines KSS Projekt 1159.',
    kdt:[['1986','1991','Korvettenkapitän Werner Lukoschat','']] },
];

const parchim = [
  ['242','Parchim','9. April 1981 durch den Chef des Hauptstabes, Generaloberst Streletz; von der Peenewerft Wolgast am 6. April 1981 an die Volksmarine übergeben','4. UAWSA, ab 1984 4. KSSA','4. Flottille','Warnemünde',
    [['1981/1','1981/2','Kapitänleutnant Gerd Hensel',''],['1981/2','1984/1','Kapitänleutnant Wolfgang Lödel',''],['1984/1','1984/2','Oberleutnant zur See Dietmar Uhlitzsch',''],['1984/2','1986/2','Oberleutnant zur See Peter Jahn',''],['1986/2','1989/2','Kapitänleutnant Uwe Münch',''],['1989/2','1990/2','Kapitänleutnant Ralf Weigel','']],
    'Erstes in Dienst gestelltes Schiff des Projektes 133.'],
  ['241','Wismar','9. Juli 1981','4. UAWSA, ab 1984 4. KSSA','4. Flottille','Warnemünde',
    [['1981/2','1991/2','Oberleutnant zur See Wulf Habeck','Die „Wismar“ blieb noch bis 1991 im Dienst der Bundesmarine']],
    'Die Ereignistafel führt die „Wismar“ unter den Schiffen, die nach dem 3. Oktober 1990 zeitweilig im Flottendienst verblieben. Im Juli 1991 besuchten die „Lübz“ und die „Wismar“ zu einer Ausbildungsfahrt Wilhelmshaven; Hin- und Rückreise erfolgten durch den Nord-Ostsee-Kanal. Die Ereignistafel bezeichnet dies als letzte Fahrt der KSS 133 der ehemaligen 4. Flottille.'],
  ['243','Perleberg','19. September 1981','4. UAWSA, ab 1984 4. KSSA','4. Flottille','Warnemünde',
    [['1981/2','1982/1','Kapitänleutnant Benno Lungwitz',''],['1982/1','1987/1','Kapitänleutnant Wolfgang Stimm',''],['1987/1','1987/2','Kapitänleutnant Frank Heldner',''],['1987/2','1989/2','Oberleutnant zur See Steffen Derlath',''],['1989/2','1990/2','Oberleutnant zur See Knut Richter','']],
    ''],
  ['244','Bützow','30. Dezember 1981','4. UAWSA, ab 1984 4. KSSA','4. Flottille','Warnemünde',
    [['1981/2','1990/2','Korvettenkapitän Siegfried Kühn','']],
    'Mit der Indienststellung der „Bützow“ war die 4. UAW-Schiffsabteilung der 4. Flottille im vollen Bestand formiert.'],
  ['221','Lübz','12. Februar 1982','2. UAWSA, ab 1984 2. KSSA','4. Flottille','Warnemünde',
    [['1982/1','1984/2','Kapitänleutnant Rainer Harms',''],['1984/2','1991/2','Kapitänleutnant Uwe Dotzlaff','Die „Lübz“ blieb noch bis 1991 im Dienst der Bundesmarine']],
    'Die Ereignistafel führt die „Lübz“ unter den Schiffen, die nach dem 3. Oktober 1990 zeitweilig im Flottendienst verblieben.'],
  ['222','Bad Doberan','30. Juni 1982','2. UAWSA, ab 1984 2. KSSA','4. Flottille','Warnemünde',
    [['1982/1','1986/2','Kapitänleutnant Dietrich Vogler',''],['1986/2','1987/2','Oberleutnant zur See Steffen Derlath',''],['1987/2','1990/2','Kapitänleutnant Peter Jennert','']],
    ''],
  ['223','Güstrow','10. November 1982','2. UAWSA, ab 1984 2. KSSA','4. Flottille','Warnemünde',
    [['1982/2','1986/1','Korvettenkapitän Norbert Matwejczuk',''],['1986/1','1988/2','Kapitänleutnant Reiner Tottlepp',''],['1988/2','1990/2','Kapitänleutnant Mario Wiefel','']],
    ''],
  ['224','Waren','23. November 1982','2. UAWSA, ab 1984 2. KSSA','4. Flottille','Warnemünde',
    [['1982/2','1990/2','Kapitänleutnant Richard Fester','']],
    'Mit der Indienststellung der „Waren“ war die 2. UAWSA der 4. Flottille im vollen Bestand formiert.'],
  ['231','Prenzlau','11. Mai 1983','3. UAWSA, ab 1984 3. KSSA','1. Flottille','Peenemünde, ab 1. Dezember 1983 Warnemünde', [], 'Am 1. Dezember 1983 verlegte die 3. UAWSA mit den KSS 231, 232 und 233 von Peenemünde nach Warnemünde.'],
  ['232','Ludwigslust','4. Juli 1983','3. UAWSA, ab 1984 3. KSSA','1. Flottille','Peenemünde, ab 1. Dezember 1983 Warnemünde', [], 'Am 1. Dezember 1983 verlegte die 3. UAWSA mit den KSS 231, 232 und 233 von Peenemünde nach Warnemünde.'],
  ['233','Ribnitz-Damgarten','29. Oktober 1983','3. UAWSA, ab 1984 3. KSSA','1. Flottille','Peenemünde, ab 1. Dezember 1983 Warnemünde', [], 'Am 1. Dezember 1983 verlegte die 3. UAWSA mit den KSS 231, 232 und 233 von Peenemünde nach Warnemünde.'],
  ['234','Teterow','27. Januar 1984','3. UAWSA, ab 1984 3. KSSA','1. Flottille','Peenemünde', [],
    'Mit der Indienststellung der „Teterow“ erreichte die 3. UAWSA der 1. Flottille ihren vollen Bestand. Die Ereignistafel führt die „Teterow“ unter den Schiffen, die nach dem 3. Oktober 1990 zeitweilig im Flottendienst verblieben; am 17. April 1991 besuchten „Teterow“ und „Gadebusch“ Kiel, am 12. September 1991 Kopenhagen.'],
  ['211','Gadebusch','31. August 1984','1. UAWSA, ab 1984 1. KSSA','1. Flottille','Peenemünde', [],
    'Die Ereignistafel führt die „Gadebusch“ unter den Schiffen, die nach dem 3. Oktober 1990 zeitweilig im Flottendienst verblieben. Am 5. Oktober 1991 lief sie die dänischen Häfen Aarhus und Vejle an; die Ereignistafel bezeichnet dies als vermutlich letzte Fahrt eines KSS Pr. 133.'],
  ['212','Grevesmühlen','21. September 1984','1. UAWSA, ab 1984 1. KSSA','1. Flottille','Peenemünde', [],
    'Die Ereignistafel führt die „Grevesmühlen“ unter den Schiffen, die nach dem 3. Oktober 1990 zeitweilig im Flottendienst verblieben.'],
  ['213','Bergen','1. Februar 1985','1. UAWSA, ab 1984 1. KSSA','1. Flottille','Peenemünde', [], ''],
  ['214','Angermünde','26. Juli 1985','1. UAWSA, ab 1984 1. KSSA','1. Flottille','Peenemünde', [],
    'Als letztes Schiff des Projektes 133 in Dienst gestellt; damit war die 1. KSSA der 1. Flottille komplett.'],
];

// ---- Ausgabe --------------------------------------------------------------
const q = (s) => `"${String(s).replace(/"/g, '\\"')}"`;
const arr = (a) => `[${a.map(q).join(', ')}]`;

function tafelAuszug(name, bord) {
  const treffer = ereignisse.filter((e) =>
    (e.schiffe || []).some((s) => s === name || s === name.replace(' – Hauptstadt der DDR', '') || bord.includes(s)));
  if (!treffer.length) return '';
  return `\n## Aus der Ereignistafel\n\n` +
    treffer.map((e) => `- **${e.datumText || e.jahr}** ${e.text}`).join('\n') +
    `\n\nQuelle: ${Q.tafel}. Die vollständige Chronik steht unter [Ereignistafel 1956–1991](/chronik).\n`;
}

function kdtTabelle(kdt, quelle) {
  if (!kdt || !kdt.length) return `\n## Kommandanten\n\nFür dieses Schiff enthält ${quelle} keine Kommandantenliste.\n`;
  const bem = kdt.some((k) => k[3]);
  return `\n## Kommandanten\n\n| von | bis | Dienstgrad und Name${bem ? ' | Bemerkung' : ''} |\n|---|---|---|${bem ? '---|' : ''}\n` +
    kdt.map((k) => `| ${k[0]} | ${k[1]} | ${k[2]}${bem ? ` | ${k[3] || ''}` : ''} |`).join('\n') +
    `\n\nQuelle: ${quelle}. Der Dienstgrad gilt für den Antritt der Dienststellung.\n`;
}

const dir = path.join(root, 'content/schiffe');
for (const f of fs.readdirSync(dir)) fs.unlinkSync(path.join(dir, f));
let n = 0;

function schreibe(name, fm, body) {
  const datei = path.join(dir, slugify(name) + '.md');
  fs.writeFileSync(datei, `---\n${fm}\n---\n\n${body}`);
  n++;
}

for (const s of riga) {
  const fm = [
    `name: ${q(s.name)}`, `projekt: "50"`, `klasse: "Riga-Klasse"`,
    `typ: "Küstenschutzschiff; in der sowjetischen Seekriegsflotte als Wachschiff (SKR) geführt"`,
    `bordnummern: ${arr(s.bord)}`,
    `sowjetischerName: ${q(`${s.sowjName}, sowjetische Baunummer ${s.sowjBau}; Schiffbau-Nr. ${s.schiffbauNr}; deutsche Bau-Nr. ${s.bau}`)}`,
    `bauwerft: ${q(`Kiellegung ${s.kiel}`)}`,
    `stapellauf: ${q(`${s.stapel}; Übernahme durch die sowjetische Seekriegsflotte ${s.uebernahmeSU}`)}`,
    `indienststellung: ${q(s.ind)}`,
    `ausserdienststellung: ${q(s.aus)}`,
    s.verbleib ? `verbleib: ${q(s.verbleib)}` : null,
    `stuetzpunkt: "Saßnitz; mit Verlegung der Abteilung im Oktober 1965 Warnemünde"`,
    `verband: "6. Flottille (1956–1959), KSS-Brigade (ab 1. Januar 1960), Selbständige KSS-Abteilung (ab 31. Dezember 1961), ab Oktober 1965 unter der 4. Flottille"`,
    `zusammenfassung: ${q(`Küstenschutzschiff des Projektes 50 (Riga-Klasse), Bau-Nr. ${s.bau}, am ${s.ind.split(',')[0]} in Dienst gestellt und am ${s.aus.split(',')[0]} außer Dienst gestellt.`)}`,
    `reihenfolge: ${s.reihe}`,
  ].filter(Boolean).join('\n');

  let body = `Alle Angaben auf dieser Seite stammen aus den Broschüren der Marinekameradschaft KSS e.V. Die Quelle ist jeweils genannt.\n\n`;
  body += `## Bordnummern\n\nDas Schiff führte nacheinander die Bordnummern ${s.bord.join(', ')}. Die Wechsel sind in ${Q.bordnr} und in der Ereignistafel dargestellt.\n`;
  if (s.ausHinweis) body += `\n> Anmerkung des Archivs: ${s.ausHinweis}\n`;
  body += kdtTabelle(s.kdt, Q.kdt50);
  body += tafelAuszug(s.name, s.bord);
  body += `\n## Quellen\n\n- ${Q.ttd}\n- ${Q.kdt50}\n- ${Q.sowj}\n- ${Q.bordnr}\n- ${Q.tafel}\n`;
  schreibe(s.name, fm, body);
}

for (const s of koni) {
  const fm = [
    `name: ${q(s.name)}`, `projekt: "1159"`, `klasse: "Koni-Klasse"`,
    `typ: "Küstenschutzschiff; mit Anordnung 44/86 des Chefs der Volksmarine ab 1. Dezember 1986 als KSS 2. Ranges bezeichnet"`,
    `bordnummern: ${arr(s.bord)}`,
    `sowjetischerName: ${q(`${s.sowjName}, sowjetische Baunummer ${s.sowjBau}; deutsche Bau-Nr. ${s.bau}`)}`,
    `bauwerft: ${q(`Kiellegung ${s.kiel}`)}`,
    `stapellauf: ${q(`${s.stapel}; Übernahme durch die sowjetische Seekriegsflotte ${s.uebernahmeSU}`)}`,
    `indienststellung: ${q(s.ind)}`,
    `ausserdienststellung: ${q(s.aus)}`,
    s.verbleib ? `verbleib: ${q(s.verbleib)}` : null,
    `stuetzpunkt: "Warnemünde"`,
    `verband: "4. KSS-Abteilung der 4. Flottille; im Mai 1984 zur 4. KSS-Brigade umgebildet"`,
    `zusammenfassung: ${q(`Küstenschutzschiff des Projektes 1159 (Koni-Klasse), Bau-Nr. ${s.bau}, Bordnummer ${s.bord[0]}, in der Volksmarine in Dienst gestellt ${s.ind.match(/\d{1,2}\. \w+ \d{4}/)?.[0] ?? ''}.`)}`,
    `reihenfolge: ${s.reihe}`,
  ].filter(Boolean).join('\n');

  let body = `Alle Angaben auf dieser Seite stammen aus den Broschüren der Marinekameradschaft KSS e.V. Die Quelle ist jeweils genannt.\n\n`;
  body += `## Überführung\n\n${s.ueberfuehrung}. Quelle: ${Q.tafel}.\n`;
  body += kdtTabelle(s.kdt, Q.kdt50);
  body += tafelAuszug(s.name, s.bord);
  body += `\n## Quellen\n\n- ${Q.ttd}\n- ${Q.kdt50}\n- ${Q.sowj}\n- ${Q.tafel}\n`;
  schreibe(s.name, fm, body);
}

parchim.forEach(([bord, name, ind, abt, fl, ort, kdt, hinweis], i) => {
  const fm = [
    `name: ${q(name)}`, `projekt: "133.1"`, `klasse: "Parchim-Klasse"`,
    `typ: "U-Boot-Abwehr-Schiff; mit Anordnung 44/86 des Chefs der Volksmarine ab 1. Dezember 1986 als Küstenschutzschiff 3. Ranges bezeichnet"`,
    `bordnummern: ${arr([bord])}`,
    `bauwerft: "VEB Peenewerft Wolgast"`,
    `indienststellung: ${q(ind)}`,
    `ausserdienststellung: "Mit dem 2. Oktober 1990 hörte die Volksmarine laut Einigungsvertrag auf zu bestehen; am 3. Oktober 1990 wurden Stützpunkte, Schiffe, Technik und Personal von der Bundesmarine übernommen."`,
    hinweis ? `verbleib: ${q(hinweis)}` : null,
    `stuetzpunkt: ${q(ort)}`,
    `verband: ${q(`${abt} der ${fl}`)}`,
    `zusammenfassung: ${q(`U-Boot-Abwehr-Schiff des Projektes 133.1 (Parchim-Klasse) mit der Bordnummer ${bord}, gebaut auf der Peenewerft Wolgast, in Dienst gestellt am ${ind.split(' durch')[0].split(';')[0]}.`)}`,
    `reihenfolge: ${10 + i}`,
  ].filter(Boolean).join('\n');

  let body = `Alle Angaben auf dieser Seite stammen aus den Broschüren der Marinekameradschaft KSS e.V. Die Quelle ist jeweils genannt.\n\n`;
  body += `## Einordnung\n\nDas Schiff gehörte zur ${abt} der ${fl} mit Stationierungsort ${ort}. Die Schiffe des Projektes 133.1 wurden zunächst als UAW-Schiffe geführt; laut ${Q.kdt50.replace('Teil 2, Anhang 2 (BCH’s, ACH’s, Kommandanten Pr. 50 und 1159)', 'Teil 6, Anhang 1 (Leserzuschrift Helmut Bechert)')} legte die Anordnung 44/86 des Chefs der Volksmarine ab 1. Dezember 1986 die Bezeichnung als Küstenschutzschiff 3. Ranges fest.\n`;
  body += kdtTabelle(kdt, Q.kdt133);
  body += tafelAuszug(name, [bord]);
  body += `\n## Quellen\n\n- ${Q.ttd}\n- ${Q.kdt133}\n- ${Q.tafel}\n`;
  schreibe(name, fm, body);
});

console.log(n, 'Schiffsseiten geschrieben, ausschließlich aus belegten Angaben.');
