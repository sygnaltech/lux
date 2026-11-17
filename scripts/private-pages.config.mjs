/**
 * PER-SITE — Lux Radiology. The protected pages, where their bytes come from,
 * and how they become a complete HTML document.
 *
 * THREE CONSUMERS, ONE DEFINITION:
 *   scripts/prepare-private.mjs                  reads PRIVATE_PAGES — renders
 *                                                each one into the Worker bundle
 *   migration-scripts/extract-private-page.mjs   reads PRIVATE_SOURCES — ports
 *                                                them out of Webflow
 *   migration-scripts/verify-private-page.mjs    reads PRIVATE_SOURCES — diffs
 *                                                the render against live Webflow
 *
 * THESE ROUTES MUST NOT APPEAR IN `migration-scripts/pages.config.mjs`, must not
 * be reachable from `web/src/pages/[...slug].astro`, and must not be in
 * `sitemap.xml.ts`. Being a separate definitions file read by a separate
 * pipeline is what makes that structural rather than a thing to remember —
 * adding /poac to PAGES would emit `web/dist/poac.html` and the gate would be
 * decoration. `prepare-private.mjs` fails the build if that happens anyway.
 *
 * THE §1 INVENTORY, AMENDED. pages.config.mjs reconciles 202 URLs against the
 * live sitemap. /poac is the 203rd page and is deliberately NOT one of them: it
 * is absent from Webflow's sitemap, which is *why* the inventory missed it and
 * why the cut-over shipped a 404 at a live URL. Protected pages are counted
 * here, separately, and never added to that total.
 *
 * ── WHERE §6's CMS WORK FOR /poac LANDS, WHEN IT DOES ──────────────────────
 *
 * The overview has two open items for this page: the 14 `poac` documents in
 * Sanity that nothing renders, and the page itself. This file closes the second
 * one with a VERBATIM PORT — the Webflow markup, frozen, exactly as every other
 * ported static page carries its lists. The dataset half is still open.
 *
 * When it is picked up, THE CHANGE IS `render()` BELOW, NOT A NEW ASTRO ROUTE.
 * That is the whole trap this file exists to keep shut: adding
 * `web/src/pages/poac.astro` to "render it properly from Sanity" emits
 * `web/dist/poac.html`, and the page is then a public static asset with a
 * password gate standing uselessly beside it. `prepare-private.mjs` fails the
 * build if that happens — but the reflex is strong enough to be worth naming.
 *
 * The data is already sufficient. Each `poac` document references a
 * `serviceItem`, which carries `sbmServiceId` (the `book-serviceid` the
 * weekday buttons read) and `poacWeekendBookingUrl` (the Saturday link). So the
 * shape is: query the 14 documents ordered by `order`, bind them into the
 * `w-dyn-list` in `private/html/main.poac.html` the way `web/src/lib/bind.ts`
 * binds the public templates, and return the same complete document this
 * renderer already returns. `npm run verify:private` then says whether the
 * result still matches the Webflow original.
 */
import {readFileSync, existsSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const PRIVATE_DIR = join(ROOT, 'private');
const SHARED_DIR = join(ROOT, 'web', 'src', 'html');

/**
 * Read LAZILY, not at import time.
 *
 * `migration-scripts/extract-private-page.mjs` imports this file for
 * PRIVATE_SOURCES and is the thing that WRITES private/pages.json — so on a
 * first run, or after the file is deleted, an eager read makes the extractor
 * unable to start and the only fix is to hand-write the manifest it was about
 * to generate.
 */
const readManifest = () =>
  JSON.parse(readFileSync(join(PRIVATE_DIR, 'pages.json'), 'utf8'));

const read = (dir, name) => {
  const file = join(dir, name);
  if (!existsSync(file)) return '';
  return readFileSync(file, 'utf8');
};

/**
 * Webflow's site identifier, constant across every page of this site.
 *
 * DUPLICATED FROM `web/src/layouts/BaseLayout.astro`, knowingly. It is a markup
 * constant on the live `<html>` element that Webflow's shipped runtime reads,
 * and the runtime is still loaded here. The alternative is importing a `.astro`
 * module from a plain Node build step, which needs Vite — see the note on
 * `renderPortedPage` below.
 */
const WF_SITE = '60f0b32c84789d2d1b5ddbb8';

/** HTML-escape text content. */
const text = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** HTML-escape an attribute value. */
const attr = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/**
 * Render one ported protected page as a complete HTML document.
 *
 * WHY THIS IS NOT `BaseLayout.astro`.
 *
 * BaseLayout is the right answer for every PUBLIC page and cannot be the answer
 * here. It resolves its fragments with `import.meta.glob('../html/*.html')` and
 * is a `.astro` component — both of which require Vite, and Vite only runs
 * inside `astro build`, which writes its output to `web/dist`. The one thing
 * this page must never be is a file in `web/dist`. Astro has no per-route
 * "render but do not emit", so a build-then-delete dance would be the only way
 * to use it, and that leaves the confidential HTML on disk in the publishable
 * directory for the length of the build — precisely the state the pattern
 * exists to prevent, and one that a half-finished build would leave behind.
 *
 * So this reproduces BaseLayout's document shape in plain Node, and the drift
 * risk that creates is covered by a real check rather than by care:
 * `npm run verify:private` diffs the rendered page against the live Webflow
 * original on text and tag count, exactly as `npm run verify` does for the
 * public pages. The live page is the specification either way, so a difference
 * between this and BaseLayout only matters if it makes the page WRONG, and that
 * is what gets measured.
 *
 * THE SHARED SHELL COMES FROM `web/src/html/`, the same bytes every public page
 * uses. `extract-private-page.mjs` asserts the protected page's own nav and
 * footer are byte-identical to those files, so this substitution is a known-good
 * join rather than a hopeful one.
 */
async function renderPortedPage(slug) {
  const manifest = readManifest();
  const page = manifest.pages[slug];
  if (!page) {
    throw new Error(
      `private-pages.config.mjs: no private/pages.json entry for "${slug}". ` +
        `Known: ${Object.keys(manifest.pages).join(', ') || '(none)'}. ` +
        'Run `npm run extract:private`.',
    );
  }

  const main = read(join(PRIVATE_DIR, 'html'), `main.${slug}.html`);
  if (!main) {
    throw new Error(
      `private-pages.config.mjs: private/html/main.${slug}.html is missing or empty. ` +
        'Run `npm run extract:private`.',
    );
  }

  const nav = read(SHARED_DIR, 'nav.html');
  const footer = read(SHARED_DIR, 'footer.html');

  /**
   * Drop Webflow's `preconnect` to its own CDN — the same removal BaseLayout
   * does, for the same reason. §5 localised every asset, so the hint opens a
   * TCP+TLS connection to the host we are leaving, on every page load, for
   * nothing.
   */
  const headCustom = read(SHARED_DIR, 'head-custom.html').replace(
    /\s*<link[^>]*href="https:\/\/cdn\.prod\.website-files\.com"[^>]*>/g,
    '',
  );

  const headExtra = page.headExtra ? read(join(PRIVATE_DIR, 'html'), `head-extra.${slug}.html`) : '';

  /**
   * Substitute the shell markers, THROWING when the substitution cannot happen.
   *
   * Same contract as BaseLayout and for the same reason: a silent fallback
   * leaves the comment marker in the output and the page renders without a nav,
   * which looks like a CSS problem rather than a build problem. Here it would
   * also be served from behind a password, where far fewer people will see it.
   */
  let body = main;
  if (page.shell === 'full' || page.shell === 'nav') {
    if (!body.includes('<!--wf:nav-->')) {
      throw new Error(`private page "${slug}" is shell:${page.shell} but its fragment has no <!--wf:nav--> marker.`);
    }
    if (!nav) throw new Error(`private page "${slug}" needs the shared nav, but web/src/html/nav.html is empty.`);
    body = body.replace('<!--wf:nav-->', nav);
  }
  if (page.shell === 'full') {
    if (!body.includes('<!--wf:footer-->')) {
      throw new Error(`private page "${slug}" is shell:full but its fragment has no <!--wf:footer--> marker.`);
    }
    if (!footer) throw new Error(`private page "${slug}" needs the shared footer, but web/src/html/footer.html is empty.`);
    body = body.replace('<!--wf:footer-->', footer);
  }

  /** `data-wf-domain` is the canonical host, which is the production host. */
  const wfDomain = new URL(manifest.extractedFrom).hostname;

  const head = [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    /**
     * A protected page must never be indexed, whatever it is linked from. The
     * Worker also sends `X-Robots-Tag: noindex, nofollow` — belt and braces,
     * because a crawler that somehow holds a valid session cookie sees the
     * markup and not the header's absence.
     */
    '<meta name="robots" content="noindex, nofollow">',
    `<title>${text(page.title ?? '')}</title>`,
    page.description && `<meta name="description" content="${attr(page.description)}">`,
    page.ogTitle && `<meta property="og:title" content="${attr(page.ogTitle)}">`,
    page.ogDescription && `<meta property="og:description" content="${attr(page.ogDescription)}">`,
    page.ogTitle && `<meta name="twitter:title" content="${attr(page.ogTitle)}">`,
    page.ogDescription && `<meta name="twitter:description" content="${attr(page.ogDescription)}">`,
    '<meta property="og:type" content="website">',
    '<meta name="twitter:card" content="summary_large_image">',
    headCustom,
    headExtra,
  ].filter(Boolean).join('\n');

  return `<!DOCTYPE html><html data-wf-domain="${attr(wfDomain)}" data-wf-page="${attr(page.wfPage ?? '')}" data-wf-site="${WF_SITE}" lang="${attr(page.lang ?? 'en')}">
<head>
${head}
</head>
<body>
${body}
</body>
</html>
`;
}

/**
 * Where each protected page is ported FROM.
 *
 * `webflowPath` is the path on `webflow.staging`, not on `webflow.source` —
 * after cut-over the production host is this site, and a protected page is only
 * readable through Webflow's own password gate. See
 * `migration-scripts/extract-private-page.mjs`.
 */
export const PRIVATE_SOURCES = [
  {
    slug: 'poac',
    route: '/poac',
    webflowPath: '/poac',
  },
];

/**
 * The protected pages, as the build step wants them.
 *
 * `canary` is a sentence of the page's own copy. `prepare-private.mjs` asserts
 * it appears in the rendered page AND in no file in `web/dist` — sitemap, search
 * index and JSON payloads included. That is what makes "the gated HTML never
 * ships publicly" a tested property rather than a convention, so do not shorten
 * it to something that could occur on a public page by coincidence, and do not
 * remove it to unblock a build.
 *
 * PICK A SENTENCE WITH NO TYPOGRAPHY IN IT. The obvious first choice here was
 * the page's opening line, "This page is specifically for POAC bookings." —
 * which fails, because Webflow's editor put a NON-BREAKING SPACE before
 * "bookings". The assertion then reports that the page does not contain its own
 * canary, and the two strings are identical on screen. A canary must also not
 * span an inline tag (`<em>`, `<strong>`), for the same reason: what reads as
 * one sentence is two text nodes with markup between them.
 */
export const PRIVATE_PAGES = [
  {
    route: '/poac',
    canary: 'this page to ensure the booking system resets properly.',
    render: () => renderPortedPage('poac'),
  },
];
