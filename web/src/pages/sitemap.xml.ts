/**
 * sitemap.xml, generated from the SAME sources the routes are generated from.
 *
 * That is the whole design: the static pages come from the extractor's
 * manifest and the item pages from Sanity, so adding a page or a document adds
 * its URL and there is no second list to forget. `npm run sitemap` then diffs
 * the result against the live Webflow sitemap in both directions.
 *
 * `lastmod` IS ONLY EMITTED WHERE IT IS TRUE.
 *
 * CMS documents have a real `_updatedAt`. The ported static pages do not have
 * anything of the kind — their content is frozen Webflow markup — so emitting
 * the build time for them would tell Google that every page on the site
 * changed on every deploy, which trains the crawler to ignore the field
 * entirely and costs us the signal on the pages where it is genuine.
 */
import type {APIRoute} from 'astro';

import manifest from '../data/pages.json';
import {client} from '../lib/sanity';
import {WEBFLOW_SOURCE} from '../lib/project.mjs';

interface PageEntry {
  path: string;
  template: boolean;
}

/**
 * Static pages excluded from the sitemap, with the reason.
 *
 * EMPTY ON PURPOSE, and `/search` is the reason it is worth explaining.
 *
 * `/search` is Webflow's native search results page: the markup ports, the
 * function does not — it posts to Webflow's own search backend, which stops
 * answering at cut-over. Dropping it from the sitemap was the first instinct
 * and it is the wrong default. It is a live, indexed URL, and removing a live
 * URL is a decision for the PM, not a side effect of a migration. A dropped
 * URL also has to be declared in migration-scripts/redirects.config.mjs so
 * `npm run sitemap` can tell an intended difference from a regression — and
 * there is no redirect target to declare until someone decides where search
 * should go.
 *
 * So the URL stays listed and the broken backend is reported in the handover.
 * When it is decided, the change is a REDIRECTS entry, not an entry here.
 *
 * Webflow's `/404` is absent from this site's live sitemap so it needs no
 * exclusion. Worth knowing anyway: Webflow serves /404 with HTTP **200**, so a
 * status check will not catch it and it must be excluded by name if it ever
 * appears.
 */
const EXCLUDED = new Map<string, string>();

const xmlEscape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

interface Entry {
  path: string;
  lastmod?: string;
}

export const GET: APIRoute = async () => {
  const entries: Entry[] = [];

  // ── Static pages, from the extractor's manifest ──────────────────────────
  for (const [slug, page] of Object.entries(manifest.pages as Record<string, PageEntry>)) {
    if (page.template) continue; // collection templates have no URL of their own
    if (EXCLUDED.has(page.path)) continue;
    entries.push({path: slug === 'home' ? '/' : page.path});
  }

  // ── CMS item pages, from Sanity ──────────────────────────────────────────
  const docs = await client.fetch<Array<{_type: string; slug: string; _updatedAt: string}>>(
    `*[_type in ["review","service","team","post","category"] && defined(slug.current)]{
      _type, "slug": slug.current, _updatedAt
    }`,
  );

  /** Document type -> URL prefix. `reviews` is plural; the others are not. */
  const BASE: Record<string, string> = {
    review: '/reviews',
    service: '/services',
    team: '/team',
    post: '/post',
    category: '/category',
  };

  for (const doc of docs) {
    const base = BASE[doc._type];
    if (!base) continue;
    entries.push({path: `${base}/${doc.slug}`, lastmod: doc._updatedAt});
  }

  entries.sort((a, b) => a.path.localeCompare(b.path));

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    (e) =>
      `  <url>\n    <loc>${xmlEscape(WEBFLOW_SOURCE + e.path)}</loc>${
        e.lastmod ? `\n    <lastmod>${e.lastmod.slice(0, 10)}</lastmod>` : ''
      }\n  </url>`,
  )
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: {'content-type': 'application/xml; charset=utf-8'},
  });
};
