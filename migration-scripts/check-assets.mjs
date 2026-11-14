/**
 * Prove the built site does not depend on Webflow, and that every local asset
 * reference resolves.
 *
 *   node migration-scripts/check-assets.mjs
 *
 * Run after `npm run build`. This is the gate that should have existed from
 * the first day of the port: the site rendered perfectly for days while the
 * typeface, the logo, every icon and every photo were still being served by
 * the Webflow account we were leaving. Nothing failed, because nothing checked.
 *
 * THREE CHECKS
 *
 * 1. NO WEBFLOW HOSTS in any built HTML or CSS. The one that matters.
 * 2. EVERY `/wf/...` REFERENCE EXISTS on disk. Catches a localisation that
 *    rewrote a URL without downloading the file.
 * 3. THE FONTS ARE LOCAL. Called out separately because they are referenced
 *    only from inside the stylesheet, so an HTML-only audit — including a
 *    careful manual one — misses them entirely.
 *
 * Other external hosts are REPORTED, not failed: a Google Fonts loader, a form
 * endpoint and a self-hosted video domain are all deliberate and none of them
 * disappear with Webflow. The report exists so the list stays honest.
 *
 * LAYOUT: `WEB` assumes the Astro app sits in `web/`. In a single-package repo,
 * point it at ROOT instead.
 */
import { readFile, readdir, access, stat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
// The site is its own package under web/. migration-scripts/ stays at the repo root
// because the Studio and the migration tooling share it, so anything reaching
// into the site goes through WEB rather than ROOT.
const WEB = join(ROOT, 'web');
const DIST = join(WEB, 'dist');

const exists = (p) => access(p).then(() => true, () => false);

let failures = 0;
const check = (name, ok, detail = '') => {
  if (ok) console.log(`ok    ${name}`);
  else {
    console.error(`FAIL  ${name}`);
    if (detail) console.error(detail);
    failures++;
  }
};

/** Every .html and .css under dist, recursively. */
async function walk(dir) {
  const out = [];
  for (const name of await readdir(dir)) {
    const full = join(dir, name);
    const s = await stat(full);
    if (s.isDirectory()) {
      // _worker.js holds the bundled server code; its asset strings are the
      // same ones already checked in the HTML, and it contains minified
      // third-party JS that produces noise.
      if (name === '_worker.js') continue;
      out.push(...(await walk(full)));
    } else if (/\.(html|css)$/.test(name)) {
      out.push(full);
    }
  }
  return out;
}

if (!(await exists(DIST))) {
  console.error('\nNo ./dist — run `npm run build` first.\n');
  process.exit(1);
}

const files = await walk(DIST);
const rel = (f) => f.slice(DIST.length + 1).replace(/\\/g, '/');

// --- 1. no Webflow hosts ---------------------------------------------------

const WEBFLOW_HOSTS = /https?:\/\/[^"'\s)]*(?:website-files\.com|webflow\.io|assets\.website-files)/g;

const offenders = [];
for (const file of files) {
  const text = await readFile(file, 'utf8');
  const hits = [...new Set(text.match(WEBFLOW_HOSTS) ?? [])];
  for (const hit of hits) offenders.push(`      ${rel(file)}\n        ${hit.slice(0, 110)}`);
}
check(
  `no Webflow-hosted assets in ${files.length} built file(s)`,
  offenders.length === 0,
  offenders.slice(0, 12).join('\n'),
);

// --- 2. every local asset reference resolves -------------------------------

const LOCAL_REF = /(?:src|href)="(\/wf\/[^"]+)"|url\(["']?(\/wf\/[^"')]+)/g;

/**
 * Local references that are KNOWN to be missing, with the reason.
 *
 * Mirrors UNFETCHABLE in migration-scripts/localise-webflow-assets.mjs — keep the two in
 * step. Entries look like:
 *
 *   [/<a distinctive fragment of the filename>/, '<page>: <why it cannot be fetched>']
 *
 * The real case this exists for is an image pasted into Webflow from an
 * external editor, which Webflow then 403s for everyone — broken on the LIVE
 * site too, so the migration inherits a broken image rather than creating one.
 * It is still rewritten to a local path, because a broken local image does not
 * outlive the Webflow account.
 *
 * Reported, not failed. Adding to this list is a deliberate act with a reason
 * attached; a silent allowlist would defeat the whole check. Start empty.
 */
const KNOWN_MISSING = new Map([]);
const knownMissingReason = (ref) => {
  for (const [re, why] of KNOWN_MISSING) if (re.test(ref)) return why;
  return undefined;
};

const missing = new Set();
const knownGaps = new Set();
for (const file of files) {
  const text = await readFile(file, 'utf8');
  for (const m of text.matchAll(LOCAL_REF)) {
    const ref = decodeURIComponent((m[1] ?? m[2]).split('?')[0]);
    if (await exists(join(DIST, ref.replace(/^\//, '')))) continue;
    const why = knownMissingReason(ref);
    if (why) knownGaps.add(`      ${why}`);
    else missing.add(`      ${ref}   (referenced by ${rel(file)})`);
  }
}
check(
  'every /wf/ reference exists in ./dist',
  missing.size === 0,
  [...missing].slice(0, 12).join('\n'),
);
if (knownGaps.size) {
  console.log(`      ${knownGaps.size} known gap(s), inherited from the live site:`);
  for (const g of knownGaps) console.log(`  ${g}`);
}

// --- 3. the fonts are local ------------------------------------------------

const cssFiles = files.filter((f) => f.endsWith('.css'));
const fontRefs = new Set();
for (const file of cssFiles) {
  const text = await readFile(file, 'utf8');
  for (const m of text.matchAll(/url\(["']?([^"')]+\.(?:woff2?|ttf|otf|eot))/g)) {
    fontRefs.add(m[1]);
  }
}
const remoteFonts = [...fontRefs].filter((f) => /^https?:/.test(f));
check(
  `all ${fontRefs.size} font file(s) referenced locally`,
  fontRefs.size > 0 && remoteFonts.length === 0,
  fontRefs.size === 0
    ? '      no @font-face url() found at all — the stylesheet may not have been ported'
    : remoteFonts.map((f) => `      remote: ${f}`).join('\n'),
);

// --- report other external hosts -------------------------------------------

const EXTERNAL = /https?:\/\/([a-z0-9.-]+\.[a-z]{2,})/g;
const hosts = new Map();
for (const file of files) {
  const text = await readFile(file, 'utf8');
  for (const m of text.matchAll(EXTERNAL)) {
    hosts.set(m[1], (hosts.get(m[1]) ?? 0) + 1);
  }
}

console.log('\nexternal hosts still referenced — confirm each one is deliberate:');
for (const [host, n] of [...hosts].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(n).padStart(4)}  ${host}`);
}

const assetDir = join(DIST, 'wf/assets');
const assetCount = (await exists(assetDir)) ? (await readdir(assetDir)).length : 0;
console.log(`\n${assetCount} local asset(s) in dist/wf/assets`);

if (failures) {
  console.error(`\n${failures} check(s) failed\n`);
  process.exit(1);
}
console.log('assets ok — the site does not need the Webflow account\n');
