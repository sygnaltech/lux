/**
 * PER-SITE — Lux Radiology.
 *
 * Every published Webflow page being ported, as `slug: path`. The slug becomes
 * the Astro route and the name of its extracted HTML fragment, so it must match
 * the published path exactly: Webflow serves extensionless URLs and we keep
 * them byte-identical. No redirects, no trailing-slash change, nothing for
 * Google to re-crawl.
 *
 * THE §1 INVENTORY, IN CODE — reconciled against the live sitemap:
 *
 *     1  home
 *    17  static pages
 *   169  reviews items
 *     7  services items
 *     3  team items
 *     3  post items
 *     2  category items
 *   ---
 *   202  = the live sitemap's URL count
 *
 * That number is the acceptance test for the whole migration; every later count
 * check refers back to it.
 */
export const PAGES = {
  // Home has its own src/pages/index.astro rather than a generated route: it
  // carries the most CMS lists on the site (11 against a nav+footer baseline
  // of 7) plus its own JSON-LD.
  home: '/',

  about: '/about',
  book: '/book',
  'book/sat': '/book/sat',
  c: '/c',
  contact: '/contact',
  covid: '/covid',
  parking: '/parking',
  prep: '/prep',
  privacy: '/privacy',
  referrer: '/referrer',
  reviews: '/reviews',
  scan: '/scan',
  terms: '/terms',
  '3d4d': '/3d4d',
  '3d4d/book': '/3d4d/book',

  // ── The two pages that are NOT like the others ────────────────────────────
  // Both are ported verbatim, because that is §3's job and dropping a live URL
  // silently is not a decision this file gets to make. Both need a decision
  // from the PM before §7, and both are flagged in the handover.

  // Webflow TEMPLATE LEFTOVER. Renders no site nav and no footer — its navbar
  // is literally `nav.navbar--delete-me` — and its whole body is 84 bytes of
  // Webflow panel furniture. It is in the live sitemap, so it is listed here
  // to keep the inventory reconciling, but it almost certainly should be
  // deleted rather than migrated. The extractor will warn `shell: bare` for it.
  // Quoted: an unquoted numeric key is reordered to the FRONT of the object by
  // JS property-order rules, which would make this the first page extracted —
  // and the first page carrying a nav becomes the shared-shell reference.
  // It has none, so it would be filtered out anyway, but relying on that is
  // an accident waiting to matter.
  '410': '/410',

  // WEBFLOW'S NATIVE SEARCH PAGE. `form.w-form` posting to Webflow's own
  // search backend, no nav, no footer. The markup ports fine and the FUNCTION
  // does not: site search dies at cut-over regardless of what we do here.
  // Either implement search against Sanity or redirect this away — see §7.
  search: '/search',
};

/**
 * Pages whose content comes from Sanity rather than the port, so the
 * structural verifier skips them by default.
 *
 * Their lists come from the dataset while the live page lists whatever Webflow
 * had — the thing being deliberately replaced. Comparing them measures how
 * much the content changed, not the port's fidelity, and that noise trains
 * everyone to ignore a red line. `npm run verify -- --cms` includes them.
 *
 * Deliberately SHORT to begin with. Every page on this site carries 6-11
 * `w-dyn-list`s, but ~7 of those are the nav's services dropdown and the
 * footer's link lists, which get punched out into the shared shell. Only
 * pages whose MAIN region is CMS-driven belong here, and the honest way to
 * find them is to let `npm run verify` be noisy and add the ones that are.
 */
export const CMS_PAGES = new Set(['home', 'reviews']);

/**
 * Webflow collection TEMPLATES, extracted from one sample item each.
 *
 * SAMPLES PICKED BY COUNTING, NOT BY JUDGEMENT. Webflow omits an empty
 * collection list from the rendered HTML entirely, so a thin item silently
 * hides whole regions of its own template. `w-dyn-list` counts came back
 * uniform within every collection here, so the richest was taken by rendered
 * byte count:
 *
 *   services   pregnancy-scan           39,415  (next: 36,529)
 *   reviews    waimaria-hauraki-ngapo   31,677  (10 sampled, all 30-31k)
 *   team       alan                     25,359  (all three within 350 bytes)
 *   post       ponsonbys-new-radiology  34,682  (next: 30,521)
 *   category   ultrasound               40,876  — also 8 lists vs 7 elsewhere
 *
 * Re-check with `npm run seams`, which reports the seam counts directly.
 *
 * Keys are prefixed `tpl-` because a collection's template and its landing
 * page share a name — `/reviews` is a page, `/reviews/<slug>` is a template —
 * and an unprefixed key makes them collide, silently overwriting one page's
 * extracted HTML with the other's.
 */
export const TEMPLATES = {
  'tpl-services': '/services/pregnancy-scan',
  'tpl-reviews': '/reviews/waimaria-hauraki-ngapo',
  'tpl-team': '/team/alan',
  'tpl-post': '/post/ponsonbys-new-radiology-service',
  'tpl-category': '/category/ultrasound',
};

/**
 * The shared shell, punched out of each page body and replaced with a marker,
 * so one nav and one footer serve every page.
 *
 * THE NAV HAS NO CLASS. Every page here begins:
 *
 *     <body><div><div class="mobile-navigation … w-nav"> …
 *
 * That bare `<div>` is the whole navigation region — mobile navbar, desktop
 * navbar, sticky scroll navbar, mobile nav section and the parking alert bar,
 * all siblings inside it. No class covers the set, so it is addressed by
 * `childCls`: the innermost `div` wrapping `.mobile-navigation`. Verified
 * byte-identical (10,277 bytes) across all 16 real pages once Webflow's
 * `w--current` markers are stripped, which is what the extractor compares.
 *
 * `childCls` must stay INNERMOST-matching: `/book` nests its whole page in
 * `div.page_wrapper`, so an outermost match would return the entire page there
 * and the nav region on every other page — a one-page-in-eighteen mismatch.
 *
 * The footer is a normal classed element and needs no such trick; it is
 * byte-identical across all 16 pages too.
 *
 * NOT SHELL, despite appearances: `div.contact-wrapper` sits after the footer
 * on every page and looks like furniture, but its contents differ on EVERY
 * page. It stays in main.
 */
export const SHELL = {
  nav: { tag: 'div', childCls: 'mobile-navigation' },
  footer: { tag: 'div', cls: 'footer' },
};
