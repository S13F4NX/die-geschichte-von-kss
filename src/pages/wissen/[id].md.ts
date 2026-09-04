import type { APIRoute } from 'astro';
import { alleBeitraege, markdownFassung } from '../../lib/inhalt';
import { SITE } from '../../lib/site';
export async function getStaticPaths() {
  return (await alleBeitraege()).filter((e) => e.sammlung === 'anhaenge').map((e) => ({ params: { id: e.id }, props: { e } }));
}
export const GET: APIRoute = ({ props }) => new Response(markdownFassung(props.e, SITE.url), { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
