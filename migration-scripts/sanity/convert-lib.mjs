/**
 * The site-agnostic half of the converter.
 *
 * `migration-scripts/sanity/convert.mjs` is a PER-SITE file: its document loops are the
 * Webflow → Sanity field map, and which items it drops is the central content
 * decision of the whole migration. Everything that is the same on every site
 * lives here, so that file stays short enough to read in one sitting.
 *
 *   import { idFor, ref, image, rich, clean, slugFor, siteSettings, finish }
 *     from './convert-lib.mjs';
 *
 * Nothing here touches the network or Sanity. The converter is a pure function
 * of migration/raw/, which is what makes it safe to re-run and diff.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ROOT } from '../lib/env.mjs';
import { toPortableText } from './html-to-portable-text.mjs';

const RAW = join(ROOT, 'migration/raw');
const OUT = join(ROOT, 'migration/sanity');

/** Collected converter warnings, reported by `finish`. */
const warnings = [];
/** Items deliberately not carried, reported by `finish`. */
const dropped = [];

export const warn = (where, msg) => warnings.push(`${where}: ${msg}`);
export const drop = (what) => dropped.push(what);

/** Load one raw collection dump. */
export const load = async (name) =>
  JSON.parse(await readFile(join(RAW, `${name}.json`), 'utf8')).items;

/**
 * Stable Sanity id from a Webflow item id.
 *
 * Deterministic on purpose: a re-import UPDATES documents rather than creating
 * duplicates, references resolve without a lookup table, and re-running after a
 * converter fix produces a diff containing only what actually changed. This one
 * decision is what makes the pipeline safe to iterate on.
 */
export const idFor = (type, webflowId) => `${type}-${webflowId}`;

/** A reference, or undefined when the source field was empty. */
export const ref = (type, webflowId) =>
  webflowId ? { _type: 'reference', _ref: idFor(type, webflowId) } : undefined;

/**
 * A Webflow image field -> an import directive.
 *
 * NOT an upload. `sanity dataset import` resolves `_sanityAsset` by fetching
 * the URL and creating the asset, which keeps this step offline and makes the
 * import the only stage needing the network or a token.
 *
 * Webflow's `alt` is usually null. The field is still carried when present, and
 * Sanity becomes the only place it can be fixed from here on.
 */
export function image(field) {
  if (!field?.url) return undefined;
  return {
    _type: 'image',
    _sanityAsset: `image@${field.url}`,
    ...(field.alt ? { alt: field.alt } : {}),
  };
}

/** Rich text -> Portable Text, collecting warnings against a named field. */
export function rich(html, where) {
  if (!html) return undefined;
  const blocks = toPortableText(html, { onWarn: (m) => warn(where, m) });
  return blocks.length ? blocks : undefined;
}

/** Drop empty values, so documents carry no meaningless keys. */
export const clean = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined && v !== null && v !== ''),
  );

/**
 * The slug the SITE should publish, honouring the redirect decisions.
 *
 * The rule is read from redirects.config.mjs rather than restated, so the 301
 * and the document cannot disagree — a redirect pointing at a slug no document
 * has is a 404 with extra steps.
 */
export function slugFor(redirects, basePath, webflowSlug, { report = false } = {}) {
  const from = `${basePath}/${webflowSlug}`;
  const hit = redirects.find((r) => r.from === from);
  if (!hit) return webflowSlug;
  const to = hit.to.slice(basePath.length + 1);
  if (report) console.log(`slug  ${from}  ->  ${basePath}/${to}`);
  return to;
}

/**
 * Write the NDJSON, run the two checks that matter, and report.
 *
 * `expected` is the count per document type, from collections.mjs. A count
 * check is the cheapest possible guard against a converter edit silently
 * dropping half a collection.
 */
export async function finish(docs, { expected = {}, report = false, ignoreTypes = [] } = {}) {
  const counts = docs.reduce((acc, d) => ({ ...acc, [d._type]: (acc[d._type] ?? 0) + 1 }), {});

  const mismatches = Object.entries(expected)
    .filter(([type]) => !ignoreTypes.includes(type))
    .filter(([type, n]) => (counts[type] ?? 0) !== n)
    .map(([type, n]) => `${type}: ${counts[type] ?? 0}, expected ${n}`);

  // Every reference must resolve inside this file. A dangling reference imports
  // without complaint and surfaces as a blank card weeks later.
  const ids = new Set(docs.map((d) => d._id));
  const dangling = [];
  const walk = (v, path) => {
    if (Array.isArray(v)) return v.forEach((x, i) => walk(x, `${path}[${i}]`));
    if (v && typeof v === 'object') {
      if (v._type === 'reference' && !ids.has(v._ref)) dangling.push(`${path} -> ${v._ref}`);
      for (const [k, x] of Object.entries(v)) walk(x, `${path}.${k}`);
    }
  };
  for (const d of docs) walk(d, `${d._type}/${d._id}`);

  await mkdir(OUT, { recursive: true });
  await writeFile(
    join(OUT, 'content.ndjson'),
    `${docs.map((d) => JSON.stringify(d)).join('\n')}\n`,
    'utf8',
  );

  if (report) {
    console.log('\ncounts');
    for (const [type, n] of Object.entries(counts).sort()) console.log(`  ${type.padEnd(16)} ${n}`);

    console.log(`\ndropped (${dropped.length})`);
    for (const d of dropped) console.log(`  ${d}`);

    const unique = [...new Set(warnings)];
    console.log(`\nconverter warnings (${warnings.length}, ${unique.length} distinct)`);
    for (const w of unique.slice(0, 20)) console.log(`  ${w}`);
    if (unique.length > 20) console.log(`  …and ${unique.length - 20} more`);
  }

  const assetCount = JSON.stringify(docs).match(/_sanityAsset/g)?.length ?? 0;
  console.log(
    `\nok    ${docs.length} documents, ${assetCount} images -> migration/sanity/content.ndjson`,
  );

  if (dangling.length) {
    console.error(`\nDANGLING REFERENCES (${dangling.length}):`);
    for (const d of dangling.slice(0, 10)) console.error(`  ${d}`);
    process.exitCode = 1;
  }
  if (mismatches.length) {
    console.error(`\nCOUNT MISMATCH:`);
    for (const m of mismatches) console.error(`  ${m}`);
    process.exitCode = 1;
  }
  if (!dangling.length && !mismatches.length) {
    console.log(`      counts match EXPECTED, every reference resolves\n`);
  }
}
