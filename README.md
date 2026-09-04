# Die Geschichte von KSS

Digitales Archiv zu den Küstenschutzschiffen (KSS) der Volksmarine der DDR:
Projekt 50 (Riga-Klasse), Projekt 1159 (Koni-Klasse) und Projekt 133.1 (Parchim-Klasse).
Zusammengetragen von der ehemaligen Marinekameradschaft KSS e.V., Rostock-Warnemünde (1996–2021).

**Grundregel des Projekts: Die Texte der Autoren werden unter keinen Umständen verändert.**
Erlaubt ist ausschließlich das technische Zusammenfügen umbrochener Zeilen, das Auflösen von
Silbentrennungen und das Entfernen von Seitenzahlen. Eigene Formulierungen des Archivs stehen
nur in Zusammenfassungen, Schlagworten und redaktionellen Hinweisen und sind als solche
gekennzeichnet. Jede Sachangabe nennt ihre Quelle.

## Aufbau

    content/geschichten/   Beiträge aus den Rubriken Episoden, Amüsantes, Zeitschriften, Leser
    content/anhaenge/      Anhänge: technische Daten, Listen, Tabellen, Grafiken
    content/broschueren/   Vorwort und Inhaltsverzeichnis je Heft (Markdown + JSON)
    content/schiffe/       Datenblätter der 23 Schiffe, erzeugt aus belegten Angaben
    content/data/          Ereignistafel, Bildkataloge, Bildnachweise, Personenregister
    src/                   Astro-Seiten, Layouts, Komponenten
    scripts/               Einmalige Import- und Aufbereitungsskripte

## Entwicklung

    npm install
    npm run dev
    npm run build     # Astro-Build und Pagefind-Suchindex

## Broschüren-Medien

Seitenbilder, Foto-Ausschnitte und PDFs liegen unter `public/broschueren/` und sind von der
Versionsverwaltung ausgenommen. Sie werden aus den Original-PDFs erzeugt:

    node scripts/import-broschueren.mjs <seitenDir> <fotosDir> <pdfDir>
    node scripts/bildkatalog.mjs
    node scripts/bildnachweis.mjs
    node scripts/personen.mjs

## Veröffentlichung

Statisch, ohne Datenbank, auf Cloudflare Pages:

    npx wrangler pages deploy dist --project-name die-geschichte-von-kss

## Für Maschinen

Jede Beitragsseite ist zusätzlich als Markdown abrufbar (Adresse plus `.md`).
Die Ereignistafel gibt es als JSON und Markdown, alle Inhalte in `/llms.txt` und `/llms-full.txt`.

## Rechte

Texte und Bilder: Marinekameradschaft KSS e.V. und die jeweils genannten Autorinnen und Autoren.
Näheres unter `/quellen`.
