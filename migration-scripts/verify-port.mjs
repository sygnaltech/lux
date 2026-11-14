/**
 * Structurally diff every built page against the live Webflow page.
 *
 *   node migration-scripts/verify-port.mjs                # every page in the manifest
 *   node migration-scripts/verify-port.mjs about privacy  # just these slugs
 *
 * Run after `npm run build`. Reads ./dist, fetches the live equivalents, and
 * compares two things that are invariant under the port:
 *
 *   TEXT     every visible line of text on the live page must appear on ours
 *   TAGS     the number of element open-tags in <body> must match exactly
 *
 * WHY NOT A BYTE DIFF
 *
 * Because the port deliberately changes bytes: asset URLs are rewritten to
 * /wf/*, `integrity` and `crossorigin` are dropped with them, and the head is
 * re-emitted in BaseLayout's order rather than Webflow's. A byte diff would be
 * red on every page forever and would therefore be ignored, which is worse than
 * no check at all.
 *
 * Text-and-tag-count is the strongest comparison that is still clean when the
 * port is correct. It catches the failures that actually happen: a dropped
 * section, a nav that did not substitute, a list that came back empty, a
 * double-escaped entity (it caught exactly that on the first run — three page
 * titles rendering a literal "&amp;").
 *
 * WHAT IT CANNOT CATCH: CSS, layout, and anything JavaScript builds at runtime.
 * A page can pass this and still look wrong. Open it in a browser too.
 *
 * LAYOUT: `WEB` assumes the Astro app sits in `web/`. In a single-package repo,
 * point it at ROOT instead.
 */
import { readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { CMS_PAGES } from './pages.config.mjs';
import { userAgent } from './lib/ua.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WEB = join(ROOT, 'web');
const DIST = join(WEB, 'dist');

const manifest = JSON.parse(await readFile(join(WEB, 'src/data/pages.json'), 'utf8'));
const ORIGIN = manifest.extractedFrom;

const args = process.argv.slice(2);

/**
 * CMS pages are SKIPPED by default.
 *
 * Their lists now come from Sanity, and the live page lists whatever Webflow
 * had — which is the thing being deliberately replaced. Comparing them does not
 * measure the port's fidelity, it measures how much the content changed, and on
 * any given site a handful of legitimate changes show up: an editorial date
 * rendered instead of a Webflow system timestamp, a corrected `tel:` href, a
 * slug-collision URL replaced with a clean one.
 *
 * Left in by default, those become noise that trains everyone to ignore a red
 * line. `--cms` includes them anyway, for eyeballing a diff on purpose.
 */
const includeCms = args.includes('--cms');
const only = args.filter((a) => !a.startsWith('--'));

/** Visible text lines, with <script>/<style> contents removed first. */
function textLines(html) {
  const stripped = html
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, '\n');
  return stripped
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

/** Element open-tags inside <body>. */
function bodyTags(html) {
  const i = html.indexOf('<body');
  const body = i === -1 ? html : html.slice(i);
  return body.match(/<[a-zA-Z][\w-]*/g) ?? [];
}

/** `/` -> index.html, `/about` -> about.html. Matches build.format: 'file'. */
const distFileFor = (path) => (path === '/' ? 'index.html' : `${path.replace(/^\//, '')}.html`);

const skipped = [];
const targets = Object.entries(manifest.pages).filter(([slug, page]) => {
  if (page.template) return false;
  if (only.length > 0) return only.includes(slug);
  if (CMS_PAGES.has(slug) && !includeCms) {
    skipped.push(slug);
    return false;
  }
  return true;
});

if (targets.length === 0) {
  console.error(`\nNo pages matched: ${only.join(' ')}\n`);
  process.exit(1);
}

let failed = 0;
const rows = [];

for (const [slug, page] of targets) {
  const built = await readFile(join(DIST, distFileFor(page.path)), 'utf8').catch(() => null);
  if (built === null) {
    rows.push({ slug, verdict: 'NOT BUILT', notes: ['run npm run build first'] });
    failed++;
    continue;
  }

  const url = `${ORIGIN}${page.path === '/' ? '' : page.path}`;
  const res = await fetch(url, { headers: { 'user-agent': userAgent('verify') } });
  if (!res.ok) {
    rows.push({ slug, verdict: `HTTP ${res.status}`, notes: [url] });
    failed++;
    continue;
  }
  const live = await res.text();

  const ours = new Set(textLines(built));
  const missing = textLines(live).filter((l) => !ours.has(l));
  const tagsOurs = bodyTags(built).length;
  const tagsLive = bodyTags(live).length;

  const notes = [];
  for (const m of missing.slice(0, 5)) notes.push(`missing text: ${m.slice(0, 90)}`);
  if (missing.length > 5) notes.push(`…and ${missing.length - 5} more missing lines`);
  if (tagsOurs !== tagsLive) notes.push(`body tags ${tagsOurs} vs ${tagsLive} live`);

  const ok = missing.length === 0 && tagsOurs === tagsLive;
  if (!ok) failed++;
  rows.push({ slug, verdict: ok ? 'ok' : 'DIFF', tags: `${tagsOurs}/${tagsLive}`, notes });
}

console.log();
for (const r of rows) {
  console.log(`${r.verdict === 'ok' ? 'ok  ' : 'FAIL'}  ${r.slug.padEnd(24)} ${r.tags ?? ''}`);
  for (const n of r.notes) console.log(`        ${n}`);
}

console.log(
  `\n${targets.length - failed}/${targets.length} page(s) structurally identical to ${ORIGIN}`,
);
if (skipped.length) {
  console.log(
    `      skipped ${skipped.length} CMS page(s): ${skipped.join(', ')} — their lists come from Sanity now (--cms to include)`,
  );
}
console.log();
process.exit(failed === 0 ? 0 : 1);
