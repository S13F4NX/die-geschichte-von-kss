/* Baut ein Personenregister aus den Listen der Broschüren.
   Quellen: Teil 2 Anhang 2 (BCH/ACH und Kommandanten Pr. 50 und 1159),
            Teil 4 Anhang 2 (ACH und Kommandanten Pr. 133.1).
   Es werden ausschließlich Angaben übernommen, die dort stehen. */
import fs from 'node:fs';

const rollen = [];
const add = (name, rolle, von, bis, quelle, bemerkung = '') =>
  rollen.push({ name, rolle, von, bis, quelle, bemerkung });

const Q2 = 'KSS-Broschüre Teil 2, Anhang 2';
const Q4 = 'KSS-Broschüre Teil 4, Anhang 2';

// Brigade- bzw. Abteilungschefs (Teil 2, Anhang 2)
[['Gerhard Thomas','1959','1962',''],['Helmut Berger','1962','1962','Januar bis November 1962'],
 ['Manfred Kretzschmar','1962','1966',''],['Hermann Strecker','1966','1972','verstorben 28.6.97'],
 ['Fritz Naumann','1972','1980',''],['Hans Steike','1980','1985',''],['Ulrich Zumkeller','1985','1990','']]
 .forEach(([n,v,b,bem]) => add(n, 'Brigade- bzw. Abteilungschef der KSS', v, b, Q2, bem));

// Kommandanten Projekt 50 und 1159 (Teil 2, Anhang 2)
const kdt50 = {
  'Ernst Thälmann': [['Kurt Hollatz','1956','1958'],['Hermann Strecker','1958','1961'],['Werner Ebert','1961','1965'],['Karl-Heinz Kremkau','1965','1966'],['Peter Dölling','1966','1970'],['Peter Kühn','1970','1976'],['Manfred Eisenhut','1976','1977']],
  'Karl Marx': [['Helmut Berger','1956','1957'],['Manfred Kretzschmar','1957','1959'],['Günther Schreiber','1959','1964'],['Dieter Fröhlich','1964','1967'],['Lothar Winter','1967','1975'],['Günter Senf','1975','1976']],
  'Karl Liebknecht': [['Manfred Kretzschmar','1959','1960'],['Eckhard Wittrien','1960','1961'],['Fritz Dorn','1961','1964'],['Karl-Heinz Kremkau','1964','1966'],['Kurt Urmoneit','1966','1967'],['Fritz Naumann','1967','1968']],
  'Friedrich Engels': [['Dietrich Dembiany','1959','1961'],['Ulrich Korn','1961','1963'],['Kurt Urmoneit','1963','1966'],['Lothar Winter','1966','1967'],['Dieter Sperling','1967','1969']],
  'Rostock': [['Günter Senf','1978','1983'],['Klaus Niehusen','1983','1989'],['Andreas Lettau','1989','1990']],
  'Berlin – Hauptstadt der DDR': [['Bernd Kulbe','1979','1980'],['Dieter Dziuballe','1980','1988'],['Roland Lepke','1988','1990']],
  'Halle': [['Werner Lukoschat','1986','1991']],
};
for (const [schiff, liste] of Object.entries(kdt50))
  for (const [n, v, b] of liste) add(n, `Kommandant KSS „${schiff}“`, v, b, Q2);

// ACH und Kommandanten Projekt 133.1 (Teil 4, Anhang 2)
[['Klaus Rohde','1982/1','1984/1','2. KSSA (bis 1984 2. UAWSA)'],['Gerd Hensel','1984/1','1984/2','2. KSSA'],
 ['Manfred Kromrey','1984/2','1985/2','2. KSSA'],['Wolfgang Lödel','1985/2','1986/2','2. KSSA'],
 ['Jürgen Tietz','1986/2','198?','2. KSSA'],['Dietmar Uhlitzsch','198?','1989/2','2. KSSA'],
 ['Reiner Tottlepp','1989/2','1990/1','2. KSSA'],
 ['Bernd Eue','1982/1','1985/2','4. KSSA (bis 1984 4. UAWSA)'],['Klaus Schäfer','1985/2','1987/2','4. KSSA'],
 ['Reiner Harms','1987/2','1990/2','4. KSSA']]
 .forEach(([n,v,b,abt]) => add(n, `Abteilungschef ${abt}`, v, b, Q4));

const kdt133 = {
  'Lübz': [['Rainer Harms','1982/1','1984/2'],['Uwe Dotzlaff','1984/2','1991/2']],
  'Bad Doberan': [['Dietrich Vogler','1982/1','1986/2'],['Steffen Derlath','1986/2','1987/2'],['Peter Jennert','1987/2','1990/2']],
  'Güstrow': [['Norbert Matwejczuk','1982/2','1986/1'],['Reiner Tottlepp','1986/1','1988/2'],['Mario Wiefel','1988/2','1990/2']],
  'Waren': [['Richard Fester','1982/2','1990/2']],
  'Wismar': [['Wulf Habeck','1981/2','1991/2']],
  'Parchim': [['Gerd Hensel','1981/1','1981/2'],['Wolfgang Lödel','1981/2','1984/1'],['Dietmar Uhlitzsch','1984/1','1984/2'],['Peter Jahn','1984/2','1986/2'],['Uwe Münch','1986/2','1989/2'],['Ralf Weigel','1989/2','1990/2']],
  'Perleberg': [['Benno Lungwitz','1981/2','1982/1'],['Wolfgang Stimm','1982/1','1987/1'],['Frank Heldner','1987/1','1987/2'],['Steffen Derlath','1987/2','1989/2'],['Knut Richter','1989/2','1990/2']],
  'Bützow': [['Siegfried Kühn','1981/2','1990/2']],
};
for (const [schiff, liste] of Object.entries(kdt133))
  for (const [n, v, b] of liste) add(n, `Kommandant KSS „${schiff}“`, v, b, Q4);

// Offiziersbesetzung bei Indienststellung (Teil 2, Anhang 3)
const Q3 = 'KSS-Broschüre Teil 2, Anhang 3 (Offiziersbesetzung bei Indienststellung)';
[['Kurt Hollatz','Kommandant'],['Hermann Strecker','Gehilfe des Kommandanten'],['Rolf Sieg','Gehilfe des Kommandanten für PA'],
 ['Günter Heitmann','Sekretär GO FDJ'],['Jürgen Hoffmann','Kommandeur GA-I'],['Dietrich Dembiany','Kommandeur GA-II'],
 ['Manfred Loleit','Feuerleitoffizier'],['Kurt Schulz','Kommandeur GA-III'],['Gerd Bossow','Kommandeur GA-IV (NO)'],
 ['Karl Hahn','Leiter FTD'],['Ulrich Mädel','Leitender Ingenieur'],['Roland Hermann','I. WI'],['Jochen Gerlach','II. WI'],
 ['Martin Voigt','Leiter VD'],['Peter Ertel','Leiter Medizinischer Dienst']]
 .forEach(([n, funktion]) => add(n, `${funktion} bei Indienststellung des KSS 1-61 am 15. Dezember 1956`, '1956', '', Q3));
[['Helmut Berger','Kommandant'],['Manfred Kretzschmar','Gehilfe des Kommandanten'],['Max Zawichowski','Gehilfe des Kommandanten für PA'],
 ['Robert Müller','Sekretär GO FDJ'],['Horst Reichenbecher','Kommandeur GA-I'],['Rudolf Lehmann','Kommandeur GA-II'],
 ['Gerhard Nahlik','Feuerleitoffizier'],['Horst Seegert','Kommandeur GA-III'],['Alfred Leder','Kommandeur GA-IV (NO)'],
 ['Helmut Reuter','Leiter FTD'],['Ernst Julius','Leitender Ingenieur'],['Rolf Backofen','I. TO'],
 ['Willi Schläger','Leiter VD'],['Walter Ludwig','Leiter Medizinischer Dienst']]
 .forEach(([n, funktion]) => add(n, `${funktion} bei Indienststellung des KSS 1-62 am 15. Dezember 1956`, '1956', '', Q3));

// Zusammenfassen je Person
const register = {};
for (const r of rollen) {
  (register[r.name] ??= []).push({ rolle: r.rolle, von: r.von, bis: r.bis, quelle: r.quelle, bemerkung: r.bemerkung });
}
fs.writeFileSync('content/data/personen.json', JSON.stringify(register, null, 1));
console.log(Object.keys(register).length, 'Personen mit belegten Dienststellungen,', rollen.length, 'Einträge');
