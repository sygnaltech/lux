/**
 * Download every Webflow-hosted asset and rewrite the references to local ones.
 *
 *   node migration-scripts/localise-webflow-assets.mjs            # do it
 *   node migration-scripts/localise-webflow-assets.mjs --dry-run  # report only
 *
 * THIS IS THE STEP THAT ACTUALLY ENDS THE WEBFLOW DEPENDENCY.
 *
 * `fetch-webflow-assets.mjs` takes the CSS and JS bundles. It does NOT take
 * what those files and the ported HTML then REFERENCE, and that is the larger
 * half: images, favicons, and — most dangerous — the WOFF2 files for the site's
 * typeface, which are referenced from inside the ported stylesheet where no
 * HTML scan would ever find them.
 *
 * Leave this undone and the site keeps rendering right up until the Webflow
 * account lapses, at which point it loses its fonts, its logo, every arrow icon
 * and every photo, all at once, with no build failure to warn anybody.
 *
 * WHAT IT SCANS
 *
 *   src/html/*.html      the ported page fragments (incl. src, srcset, href)
 *   public/wf/css/*.css  url(...) references — fonts and background graphics
 *
 * WHAT IT WRITES
 *
 *   public/wf/assets/<hash>_<name>.<ext>   the downloaded files
 *   …and rewrites every reference to /wf/assets/<file>
 *
 * WHAT IT DOES NOT SCAN, AND WHY THAT BITES
 *
 * Your own `.astro` component source. Icon URLs transcribed from the live
 * markup while building card components live there, not in src/html, so they
 * survive this script untouched and `assets:check` is what catches them. Name
 * local asset paths in one module (the convention is src/lib/assets.ts) so
 * there is somewhere for that check to point at.
 *
 * NOT TOUCHED, deliberately:
 *   - CMS images. They are already in Sanity's CDN; the ingest uploaded them.
 *   - A Google Fonts loader (googleapis.com). Not Webflow, not shutting down
 *     with it. Still an external dependency — see §10 of the skill.
 *   - A third-party form endpoint. The live forms post there and always did.
 *   - Video already self-hosted off Webflow.
 *
 * IDEMPOTENT. Re-running after a re-extract re-localises only what came back
 * pointing at Webflow, and skips files already on disk.
 *
 * LAYOUT: `WEB` assumes the Astro app sits in `web/`. In a single-package repo,
 * point it at ROOT instead.
 */
import { mkdir, readFile, readdir, writeFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { userAgent } from './lib/ua.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WEB = join(ROOT, 'web');
const HTML_DIR = join(WEB, 'src/html');
const CSS_DIR = join(WEB, 'public/wf/css');
const ASSET_DIR = join(WEB, 'public/wf/assets');

const dryRun = process.argv.includes('--dry-run');

/**
 * Any Webflow-hosted URL.
 *
 * TWO PATTERNS, because the terminator differs by context and getting it wrong
 * is silent. A first version used one broad class that excluded `)` — which
 * truncated filenames containing parentheses mid-name, then reported them as
 * 403s from Webflow rather than as the local bug they were.
 *
 *   HTML  the URL sits inside an attribute: stop at the quote.
 *   CSS   the URL sits inside `url(...)`: stop at `)` or a quote.
 *
 * Webflow filenames routinely contain parentheses and percent-escaped spaces,
 * so the HTML pattern must NOT exclude `)`.
 */
const WF_HOST = String.raw`https:\/\/(?:[a-z0-9.-]*\.)?website-files\.com\/`;
const WF_IN_HTML = new RegExp(`${WF_HOST}[^"'\\s]+`, 'g');
const WF_IN_CSS = new RegExp(`${WF_HOST}[^"')\\s]+`, 'g');

/**
 * Assets that CANNOT be fetched, with the reason.
 *
 * The real case this exists for: Webflow serves images pasted in from an
 * external editor under their own path prefix, and some of those 403 — with or
 * without a referer, from any client. Such an image is **already broken on the
 * live site**, so the migration inherits a broken image rather than creating
 * one.
 *
 * It is still rewritten to a local path. The alternative is keeping one live
 * reference to a host we are leaving, for an asset that does not load either
 * way — so the choice is between a broken local image and a broken remote one,
 * and the local one does not outlive the Webflow account. `npm run
 * assets:check` reports it as a KNOWN gap rather than a failure.
 *
 * Entries are `[/<url fragment>/, '<why it cannot be fetched>']`. Keep in step
 * with KNOWN_MISSING in migration-scripts/check-assets.mjs. Start empty; add only with a
 * reason, because a silent allowlist defeats the check.
 */
const UNFETCHABLE = new Map([]);

const unfetchableReason = (url) => {
  for (const [re, why] of UNFETCHABLE) if (re.test(url)) return why;
  return undefined;
};

const exists = (p) => access(p).then(() => true, () => false);

/**
 * Local filename for a Webflow asset URL.
 *
 * Webflow paths are `<siteId>/<24-hex-id>_<original name>.<ext>`, and that
 * hex id is unique per asset — so keeping the whole last segment is both
 * collision-proof and traceable back to the original. Percent-escapes are
 * decoded (`dark%20arrow.svg` -> `dark arrow.svg`) and spaces become hyphens,
 * because a space in a URL path is an avoidable source of trouble.
 */
function localName(url) {
  const last = decodeURIComponent(url.split('?')[0].split('/').pop() ?? '');
  return last.replace(/\s+/g, '-');
}

// --- collect -----------------------------------------------------------------

const htmlFiles = (await readdir(HTML_DIR)).filter((f) => f.endsWith('.html'));
const cssFiles = (await exists(CSS_DIR))
  ? (await readdir(CSS_DIR)).filter((f) => f.endsWith('.css'))
  : [];

const sources = [
  ...htmlFiles.map((f) => ({ path: join(HTML_DIR, f), label: `src/html/${f}`, re: WF_IN_HTML })),
  ...cssFiles.map((f) => ({ path: join(CSS_DIR, f), label: `public/wf/css/${f}`, re: WF_IN_CSS })),
];

const urls = new Map(); // url -> local filename
const perFile = new Map(); // label -> count

for (const source of sources) {
  const text = await readFile(source.path, 'utf8');
  const found = text.match(source.re) ?? [];
  if (found.length) perFile.set(source.label, found.length);
  for (const url of found) urls.set(url, localName(url));
}

if (urls.size === 0) {
  console.log('\nok    nothing left on Webflow — no references found\n');
  process.exit(0);
}

console.log(`\n${urls.size} distinct Webflow asset(s) referenced from ${perFile.size} file(s):\n`);
for (const [label, n] of [...perFile].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(4)}  ${label}`);
}

// A font referenced only from inside the CSS is the one nobody notices.
const fonts = [...urls.values()].filter((n) => /\.(woff2?|ttf|otf|eot)$/i.test(n));
if (fonts.length) {
  console.log(`\n  ${fonts.length} font file(s): ${fonts.join(', ')}`);
}

if (dryRun) {
  console.log('\n--dry-run: nothing downloaded, nothing rewritten\n');
  process.exit(0);
}

// --- download ----------------------------------------------------------------

await mkdir(ASSET_DIR, { recursive: true });

let fetched = 0;
let skipped = 0;
const failures = [];
const known = []; // declared-unfetchable, rewritten anyway

await Promise.all(
  [...urls].map(async ([url, name]) => {
    const dest = join(ASSET_DIR, name);
    if (await exists(dest)) {
      skipped++;
      return;
    }
    try {
      const res = await fetch(url, { headers: { 'user-agent': userAgent('localise') } });
      if (!res.ok) {
        const why = unfetchableReason(url);
        if (why) known.push(`${res.status}  ${name}\n      ${why}`);
        else failures.push(`${res.status}  ${url}`);
        return;
      }
      await writeFile(dest, Buffer.from(await res.arrayBuffer()));
      fetched++;
    } catch (err) {
      failures.push(`${err.message}  ${url}`);
    }
  }),
);

console.log(`\ndownloaded ${fetched}, already present ${skipped}`);

if (known.length) {
  console.log(`\n${known.length} declared-unfetchable, rewritten locally anyway:`);
  for (const k of known) console.log(`  ${k}`);
}

if (failures.length) {
  // Nothing is rewritten if anything failed. A half-localised site is worse
  // than one that is still fully on Webflow: it looks finished.
  console.error(`\n${failures.length} FAILED — nothing rewritten:\n`);
  for (const f of failures) console.error(`  ${f}`);
  console.error('');
  process.exit(1);
}

// --- rewrite -----------------------------------------------------------------

let rewritten = 0;
for (const source of sources) {
  const text = await readFile(source.path, 'utf8');
  const next = text.replace(source.re, (url) => `/wf/assets/${urls.get(url) ?? localName(url)}`);
  if (next !== text) {
    await writeFile(source.path, next, 'utf8');
    rewritten++;
  }
}

console.log(`rewrote ${rewritten} file(s)`);
console.log(`\nok    nothing in src/html or the ported CSS points at Webflow any more`);
console.log(`      re-run \`npm run build\` and \`npm run assets:check\`\n`);
