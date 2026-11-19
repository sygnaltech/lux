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

  // ── Ported from the Webflow site's own redirect table ─────────────────────
  // Source: https://lux-radiology.webflow.io/manifest.json (publish 142).
  // These URLs are in the wild — advertising and inbound links — and Webflow
  // was answering them; without this block they all 404 on the new site.
  // Where Webflow's own destination no longer exists (or never did), the entry
  // is re-pointed at the nearest real page and the `why` says so.
  {
    from: '/confirm',
    to: '/c',
    why: 'Webflow redirect, carried verbatim: the booking-confirmation page moved to /c.',
  },
  {
    from: '/maternity',
    to: '/scan',
    why: "Webflow had /maternity -> /scan-planner -> /scan as a two-hop chain; flattened to the chain's final destination.",
  },
  {
    from: '/scan-planner',
    to: '/scan',
    why: 'Webflow redirect, carried verbatim: the scan-planner page was renamed to /scan.',
  },
  {
    from: '/services/ultrasound-maternity',
    to: '/services/pregnancy-scan',
    why: 'Webflow redirect, carried verbatim: the service was re-slugged.',
  },
  {
    from: '/reviews/alexandria-ahchee',
    to: '/reviews',
    why: 'Webflow redirect, carried verbatim: the review item was removed, so the old URL falls back to the reviews landing page.',
  },
  {
    from: '/blog',
    to: '/',
    why: 'Webflow redirect, carried verbatim: there is no blog landing page; posts live at /post/<slug>.',
  },
  {
    from: '/loc/582-k-road',
    to: '/contact',
    why: 'Webflow redirect, carried verbatim: the loc collection (old location pages) was retired in favour of /contact. The collection was not ported.',
  },
  {
    from: '/loc/195-ponsonby-rd',
    to: '/contact',
    why: 'Webflow redirect, carried verbatim: the loc collection (old location pages) was retired in favour of /contact. The collection was not ported.',
  },
  {
    from: '/team/ginny-frame',
    to: '/about',
    why: "RE-POINTED. Webflow sent this to /team/ginny, which 404s on the live site too (the team member left and the renamed profile was later removed; there is no /team index page either). /about is where the team is presented, so it is the nearest real destination.",
  },
  {
    from: '/poac-liver',
    to: '/poac',
    why: 'RE-POINTED. Webflow sent this to /liver, which does not exist on the live site and never made it into the manifest. The POAC referrer content lives behind the gated /poac page, so POAC links land there.',
  },
  {
    from: '/test/test-book-now',
    to: '/book',
    why: 'RE-POINTED. Webflow sent this to /test/book, but the /test/* pages were deliberately not ported. The real booking page is the honest destination for anything still holding the test URL.',
  },
  {
    from: '/test/modal',
    to: '/book',
    why: 'RE-POINTED. Webflow sent this to /test/modals, but the /test/* pages were deliberately not ported. The modals under test were the booking popups, so /book is the nearest real destination.',
  },
];

export const STATUS = 301;

/** Map lookup for the Worker-side fallback. */
export const redirectFor = (pathname) => {
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  return REDIRECTS.find((r) => r.from === clean)?.to;
};
