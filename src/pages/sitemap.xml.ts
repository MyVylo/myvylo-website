import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { articleUrl } from '../lib/help';

export const GET: APIRoute = async ({ site }) => {
  const articles = await getCollection('help');
  const paths = ['/', '/help/', '/updates/', ...articles.map(article => articleUrl(article.slug)).sort()];
  const escapeXml = (value: string) => value.replace(/[<>&"']/g, character => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;',
  })[character]!);
  const urls = paths.map(path => `  <url><loc>${escapeXml(new URL(path, site).href)}</loc></url>`);

  return new Response([
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n'), { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
