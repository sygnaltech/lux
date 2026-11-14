/**
 * Assert that every CMS template's IMAGES are bound PER ITEM.
 *
 *   node migration-scripts/check-cms-images.mjs
 *
 * Run after `npm run build`.
 *
 * WHY THIS EXISTS AS A COMMAND
 *
 * This is the §6 mistake most likely to ship, and the skill's checklist asks
 * for it by hand ("list the rendered pages and diff one image per page").
 * Doing it by hand is exactly why it gets skipped.
 *
 * The failure is that a template's text is bound per document and its images
 * are not, so every page in the collection renders the SAMPLE item's picture.
 * On the first migration that was six team pages with one photograph and
 * thirteen subarea pages with one hero. The text is correct on every page, so
 * nothing looks wrong, and the structural verifier cannot see it — the frozen
 * markup is byte-identical to the live page's either way.
 *
 * WHAT IT CHECKS, per collection directory under dist:
 *
 *   1. Every page references at least one Sanity-hosted image. A page with
 *      none means the binding silently produced nothing.
 *   2. No two pages share an identical image set. Two pages with the same
 *      images are either the sample leaking through, or a genuine duplicate
 *      worth knowing about.
 *
 * It deliberately does NOT check that an image is *correct* — only that pages
 * differ. Correctness needs eyes; sameness is what a machine can prove.
 */
import {readdir, readFile} from 'node:fs/promises';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'web/dist');

/**
 * Collection directories to check, and how many pages each should hold.
 *
 * Counts are asserted so that a route which silently stopped generating is a
 * failure here rather than a quiet gap in the sitemap.
 */
const COLLECTIONS = [
  {dir: 'reviews', expected: 169, imagesExpected: false},
  {dir: 'services', expected: 7, imagesExpected: true},
  {dir: 'team', expected: 3, imagesExpected: true},
  {dir: 'post', expected: 3, imagesExpected: true},
  {dir: 'category', expected: 2, imagesExpected: true},
];

/**
 * Pages that LEGITIMATELY share an image set, with the reason.
 *
 * Sharing is the signal this check is built on, so an allowance has to be
 * deliberate and explained — a bare allowlist would defeat the whole thing.
 * Each entry is `['<dir>', [pages…], '<why>']` and the pages must match the
 * sharing group exactly, so adding a THIRD page to a declared pair still
 * fails.
 *
 * What the check is really hunting is the sample leaking through, and that has
 * a distinctive shape: EVERY page in the collection shares one set. A declared
 * pair cannot hide that, because the group would no longer match.
 */
const ALLOWED_DUPLICATES = [
  [
    'post',
    ['first-choice-provider-for-nib.html', 'southern-cross-affiliated-provider.html'],
    'Both posts genuinely use the same Webflow main image (65615a61…_og_main2.webp) — verified in the raw dump, not a binding leak.',
  ],
];

/** Sanity asset ids referenced by a page, in document order. */
const sanityAssets = (html) => [
  ...new Set(
    [...html.matchAll(/cdn\.sanity\.io\/images\/[^/]+\/[^/]+\/([a-f0-9]{40}-\d+x\d+\.\w+)/g)].map(
      (m) => m[1],
    ),
  ),
];

let failures = 0;
const fail = (name, detail) => {
  console.error(`FAIL  ${name}`);
  if (detail) console.error(`      ${detail}`);
  failures += 1;
};
const pass = (name, note = '') => console.log(`ok    ${name}${note ? `  ${note}` : ''}`);

for (const {dir, expected, imagesExpected} of COLLECTIONS) {
  let files;
  try {
    files = (await readdir(join(DIST, dir))).filter((f) => f.endsWith('.html')).sort();
  } catch {
    fail(`${dir}/ exists in dist`, 'the collection route produced no pages at all');
    continue;
  }

  if (files.length !== expected) {
    fail(`${dir}: ${expected} page(s)`, `got ${files.length}`);
  } else {
    pass(`${dir}: ${expected} page(s)`);
  }

  if (!imagesExpected) {
    pass(`${dir}: no per-item images expected`, '(rating widget and text only)');
    continue;
  }

  const bySignature = new Map();
  const empty = [];

  for (const file of files) {
    const html = await readFile(join(DIST, dir, file), 'utf8');
    const assets = sanityAssets(html);
    if (assets.length === 0) {
      empty.push(file);
      continue;
    }
    const sig = assets.join('|');
    if (!bySignature.has(sig)) bySignature.set(sig, []);
    bySignature.get(sig).push(file);
  }

  if (empty.length) {
    fail(
      `${dir}: every page references a Sanity image`,
      `${empty.length} page(s) reference none: ${empty.slice(0, 5).join(', ')}`,
    );
  } else {
    pass(`${dir}: every page references a Sanity image`);
  }

  const declared = ALLOWED_DUPLICATES.filter(([d]) => d === dir);
  const isDeclared = (pages) =>
    declared.find(([, allowed]) => {
      if (allowed.length !== pages.length) return false;
      const a = [...allowed].sort().join('|');
      const b = [...pages].sort().join('|');
      return a === b;
    });

  const shared = [...bySignature.entries()]
    .filter(([, pages]) => pages.length > 1)
    .filter(([, pages]) => {
      const hit = isDeclared(pages);
      if (hit) console.log(`      allowed: ${pages.length} pages share a set — ${hit[2]}`);
      return !hit;
    });

  if (shared.length) {
    fail(
      `${dir}: no two pages share the same image set`,
      shared
        .map(([, pages]) => `${pages.length} pages identical: ${pages.slice(0, 4).join(', ')}`)
        .join('\n      '),
    );
  } else {
    pass(
      `${dir}: all ${files.length} page(s) have distinct image sets`,
      `${bySignature.size} distinct`,
    );
  }
}

console.log();
if (failures) {
  console.error(`${failures} check(s) failed\n`);
  process.exit(1);
}
console.log('cms images ok — bound per item, not per template\n');
