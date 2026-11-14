/**
 * PER-SITE. Copy to `migration-scripts/pages.config.mjs` and fill in from §1.
 *
 * Every published Webflow page being ported, as `slug: path`.
 *
 * The slug becomes the Astro route (and the name of its extracted HTML
 * fragment), so it must match the published path exactly — Webflow serves
 * extensionless URLs and we keep them byte-identical. No redirects, no
 * trailing-slash change, nothing for Google to re-crawl.
 *
 * THIS FILE IS THE §1 INVENTORY IN CODE. Reconcile it to the live sitemap and
 * state the arithmetic in the comment below: that number is the acceptance test
 * for the whole migration, and every later count check refers back to it.
 *
 *   <n>  home
 *   <n>  static pages
 *   <n>  <collection> items
 *   ---
 *   <total>  = the live sitemap's URL count
 */
export const PAGES = {
  // Home is usually handled by its own src/pages/index.astro rather than a
  // generated route, because it tends to carry JSON-LD and several CMS lists.
  home: '/',

  // Every other static page, as `slug: /path`. A nested path keeps its slashes
  // in the path and uses a flat slug — the extractor maps `/` to `__` for the
  // filename.
  '<slug>': '/<path>',
};

/**
 * Pages whose content comes from Sanity rather than the port, so the structural
 * verifier skips them by default.
 *
 * Their lists now come from the dataset and the live page lists whatever
 * Webflow had — which is the thing being deliberately replaced. Comparing them
 * measures how much the content changed, not the port's fidelity, and that
 * noise trains everyone to ignore a red line. `npm run verify -- --cms`
 * includes them for a deliberate look.
 */
export const CMS_PAGES = new Set(['home', '<collection-landing-page>']);

/**
 * Webflow collection TEMPLATES, extracted from one sample item each.
 *
 * PICK THE SAMPLE BY COUNTING LISTS, NOT BY JUDGEMENT. Webflow omits an empty
 * collection list from the rendered HTML entirely, so a thin item silently
 * hides whole regions of its own template. Take the item that renders the most
 * — `npm run seams` reports the counts.
 *
 * Keys are prefixed `tpl-` because a collection's template and its landing page
 * share a name — `/<base>` is a page, `/<base>/<slug>` is a template — and an
 * unprefixed key makes them collide, silently overwriting one page's extracted
 * HTML with the other's.
 */
export const TEMPLATES = {
  'tpl-<collection>': '/<base-path>/<richest-sample-item-slug>',
};

/**
 * The shared shell, by CSS class. The extractor punches these subtrees out of
 * each page body and leaves a marker in their place, so one nav and one footer
 * serve every page.
 *
 * CHECK WHERE THE NAV ACTUALLY SITS. It is frequently NOT a top-level sibling:
 * on many Webflow sites it is nested inside the page's hero section, and the
 * hero class may differ between the home page and inner pages. Punching out
 * the subtree in place rather than slicing the body at a fixed offset is what
 * makes that a non-issue — but the tag and class below still have to be right.
 */
export const SHELL = {
  nav: { tag: '<tag>', cls: '<class>' },
  footer: { tag: '<tag>', cls: '<class>' },
};
