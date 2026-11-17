/**
 * PER-SITE. Copy to `migration-scripts/redirects.config.mjs`. An empty REDIRECTS array
 * is a perfectly good state — most migrations keep every URL.
 *
 * Permanent redirects, as `from -> to`.
 *
 * Every entry here is a URL that was live and indexed on the Webflow site and
 * is deliberately not being carried across. A migration that promises
 * byte-identical URLs still needs this file, because "byte-identical" is a
 * goal and not a law: sometimes the old URL is wrong enough to be worth a 301.
 * The usual case is a slug Webflow deduplicated with a random suffix.
 *
 * ONE LIST, TWO CONSUMERS. `migration-scripts/gen-redirects.mjs` writes
 * `public/_redirects` from this (handled by Cloudflare's asset layer, so the
 * Worker is never invoked), and `src/middleware.ts` reads it directly as a
 * fallback for anything that does reach the Worker. Keeping them derived from
 * one array is the only way they cannot drift — a redirect that exists in one
 * and not the other is a redirect that works until it does not.
 *
 * It is also read by the converter (which slug a document publishes), by
 * check-sitemap.mjs (a 301'd URL must NOT appear in the new sitemap) and by
 * the dataset verifier (the target exists, the source is gone). So a redirect
 * declared here propagates everywhere by construction.
 *
 * `from` must be an absolute path with no query string and no trailing slash.
 * 301 is the only status used: these are permanent, and a 302 would tell
 * Google to keep the old URL in the index.
 */
export const REDIRECTS = [
  // {
  //   from: '/<base-path>/<old-slug>',
  //   to: '/<base-path>/<new-slug>',
  //   why: 'why this URL is not being carried across',
  // },
  {
    from: '/services/3d4d',
    to: '/3d4d',
    why: 'Hand-typed link in the Pregnancy Ultrasound service copy that never resolved — there is no service with that slug, and the page it meant is the standalone /3d4d. The CMS link is fixed, so nothing on the site emits this URL any more; the 301 is for anything already out in the wild that followed it.',
  },
];

export const STATUS = 301;

/** Map lookup for the Worker-side fallback. */
export const redirectFor = (pathname) => {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return REDIRECTS.find((r) => r.from === clean)?.to;
};
