import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const beitrag = z.object({
  title: z.string(),
  autoren: z.array(z.string()).default([]),
  kategorie: z.enum(['episode', 'amuesantes', 'leser', 'zeitschrift', 'gedicht', 'anhang', 'technik', 'verein', 'stuetzpunkt']).default('episode'),
  rubrik: z.string().default(''),
  broschuere: z.number().optional(),
  seiten: z.array(z.number()).default([]),
  pdfteil: z.string().optional(),
  projekte: z.array(z.string()).default([]),
  schiffe: z.array(z.string()).default([]),
  orte: z.array(z.string()).default([]),
  zeitraum: z.string().default(''),
  zusammenfassung: z.string().default(''),
  schlagworte: z.array(z.string()).default([]),
  quelle: z.string().default(''),
  datum: z.string().optional(),
  bilder: z.array(z.object({ src: z.string(), alt: z.string().default(''), bildunterschrift: z.string().default('') })).default([]),
  titelbild: z.string().optional(),
});

const geschichten = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/geschichten' }),
  schema: beitrag,
});
const anhaenge = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/anhaenge' }),
  schema: beitrag,
});
const web = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/web' }),
  schema: beitrag,
});
const broschueren = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/broschueren' }),
  schema: z.object({
    teil: z.number(),
    titel: z.string(),
    jahr: z.number(),
    seitenzahl: z.number().optional(),
    pdf: z.string().optional(),
    pdfs: z.array(z.string()).optional(),
    zusammenfassung: z.string().default(''),
  }),
});
const schiffe = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/schiffe' }),
  schema: z.object({
    name: z.string(),
    projekt: z.string(),
    klasse: z.string(),
    typ: z.string().default('Küstenschutzschiff'),
    bordnummern: z.array(z.string()).default([]),
    sowjetischerName: z.string().optional(),
    bauwerft: z.string().optional(),
    stapellauf: z.string().optional(),
    indienststellung: z.string().optional(),
    ausserdienststellung: z.string().optional(),
    verbleib: z.string().optional(),
    stuetzpunkt: z.string().optional(),
    verband: z.string().optional(),
    zusammenfassung: z.string().default(''),
    titelbild: z.string().optional(),
    reihenfolge: z.number().default(0),
  }),
});
const ereignisse = defineCollection({
  loader: file('./content/data/ereignistafel.json', {
    parser: (text) => JSON.parse(text).map((e: any, i: number) => ({ id: `e${String(i).padStart(4, '0')}`, ...e })),
  }),
  schema: z.object({
    jahr: z.number(),
    datum: z.string(),
    datumEnde: z.string().optional(),
    datumText: z.string().default(''),
    text: z.string(),
    projekte: z.array(z.string()).default([]),
    schiffe: z.array(z.string()).default([]),
  }),
});

export const collections = { geschichten, anhaenge, web, broschueren, schiffe, ereignisse };
