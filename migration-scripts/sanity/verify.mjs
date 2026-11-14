/**
 * PER-SITE. Copy to `migration-scripts/sanity/verify.mjs` and write the assertions for
 * this site's content model.
 *
 * Check what is actually in the Sanity dataset against the Webflow source.
 *
 *   node migration-scripts/sanity/verify.mjs
 *
 * WHAT TO ASSERT, in rough order of what it would catch:
 *
 *   counts        one document per live Webflow item, per type
 *   references    every parent/child/leaf edge resolves
 *   ordering      children come back in the order the parent listed them
 *   assets        every image became a real Sanity asset with a URL
 *   bodies        the text of every converted rich-text field still matches the
 *                 source HTML, character for character once whitespace is
 *                 normalised — the one that catches a converter regression
 *                 after a schema change
 *   slugs         every route the site will generate has a document, and every
 *                 redirect target exists while its source is gone
 *
 * The machinery is in ./verify-lib.mjs. Everything below is the part that is
 * about THIS site.
 */
import { query, raw, check, compareBody, done } from './verify-lib.mjs';
import { EXPECTED } from '../webflow/collections.mjs';
import { REDIRECTS } from '../redirects.config.mjs';

// ---------------------------------------------------------------------------
// Counts
// ---------------------------------------------------------------------------

const [parents, children] = await Promise.all([
  raw('<parentCollection>'),
  raw('<childCollection>'),
]);

const counts = await query(`{
  "<parentType>": count(*[_type == "<parentType>"]),
  "<childType>":  count(*[_type == "<childType>"]),
  "siteSettings": count(*[_type == "siteSettings"]),
  "<excludedType>": count(*[_type == "<excludedType>"])
}`);

for (const [type, expected] of Object.entries(EXPECTED)) {
  if (type === '<excludedCollection>') continue;
  check(`count ${type} = ${expected}`, counts[type] === expected, `got ${counts[type]}`);
}
check('siteSettings singleton = 1', counts.siteSettings === 1, `got ${counts.siteSettings}`);

// A collection excluded wholesale must have produced NOTHING. Assert it rather
// than assume it — this is the check that catches an exclusion rule that
// stopped matching after a converter edit.
check(
  'no <excludedType> documents',
  counts['<excludedType>'] === 0,
  `got ${counts['<excludedType>']}`,
);

// ---------------------------------------------------------------------------
// References and ordering
// ---------------------------------------------------------------------------

const tree = await query(`*[_type == "<parentType>"] | order(coalesce(order, 999) asc) {
  "slug": slug.current, order,
  "children": *[_type == "<childType>" && parent._ref == ^._id]
    | order(coalesce(order, 999) asc) { "slug": slug.current, order }
}`);

check(
  'every child belongs to a parent',
  tree.flatMap((p) => p.children).length === EXPECTED['<childType>'],
  `${tree.flatMap((p) => p.children).length} reachable, expected ${EXPECTED['<childType>']}`,
);

/**
 * Ordering. Where Webflow has NO order field on the child collection, the
 * parent's reference array was the only record of it and the converter turned
 * that into numbers. This re-derives the expected order from the raw dump and
 * compares — the only way to prove the order survived.
 */
const expectedOrder = new Map();
for (const parent of parents) {
  const hit = REDIRECTS.find((r) => r.from === `/<base-path>/${parent.fieldData.slug}`);
  const slug = hit ? hit.to.split('/').pop() : parent.fieldData.slug;
  expectedOrder.set(
    slug,
    (parent.fieldData['<reference-array-field>'] ?? [])
      .map((id) => children.find((c) => c.id === id)?.fieldData.slug)
      .filter(Boolean),
  );
}

const orderProblems = [];
for (const parent of tree) {
  const want = expectedOrder.get(parent.slug) ?? [];
  const got = parent.children.map((c) => c.slug);
  if (want.join('|') !== got.join('|')) {
    orderProblems.push(
      `${parent.slug}\n        want ${want.join(', ')}\n        got  ${got.join(', ')}`,
    );
  }
}
check(
  'child order matches the parent reference arrays',
  orderProblems.length === 0,
  orderProblems.join('\n      '),
);

// ---------------------------------------------------------------------------
// Assets
// ---------------------------------------------------------------------------
// Assert a COUNT, not merely "no broken references". An image that silently
// failed to convert leaves a document with no image at all, which no
// reference check sees. Where an item legitimately has no image in Webflow,
// say so in the check name so the number is not a mystery later.

const assets = await query(`{
  "childHeroes":  count(*[_type == "<childType>" && defined(heroImage.asset)]),
  "parentHeroes": count(*[_type == "<parentType>" && defined(heroImage.asset)]),
  "broken":       count(*[defined(heroImage) && !defined(heroImage.asset._ref)])
}`);

check(
  `all ${EXPECTED['<childType>']} <childType> have a hero image`,
  assets.childHeroes === EXPECTED['<childType>'],
  `got ${assets.childHeroes}`,
);
check('no unresolved image references', assets.broken === 0, `got ${assets.broken}`);

// ---------------------------------------------------------------------------
// Bodies — the text must survive conversion
// ---------------------------------------------------------------------------

const bodies = await query(`{
  "children": *[_type == "<childType>"]{ "slug": slug.current, body }
}`);

const bodyProblems = [];
for (const doc of bodies.children) {
  const src = children.find((c) => c.fieldData.slug === doc.slug);
  if (src) {
    compareBody(bodyProblems, `<childType>/${doc.slug}`, src.fieldData['<rich-text-field>'], doc.body);
  }
}

check(
  `rich text preserved across ${bodies.children.length} field(s)`,
  bodyProblems.length === 0,
  bodyProblems.slice(0, 5).join('\n      '),
);

// ---------------------------------------------------------------------------
// Slugs and redirects
// ---------------------------------------------------------------------------

const slugs = await query(`{
  "parents":  *[_type == "<parentType>"].slug.current,
  "children": *[_type == "<childType>"].slug.current
}`);

for (const r of REDIRECTS) {
  const target = r.to.split('/').pop();
  const pool = r.to.startsWith('/<base-path>/') ? slugs.parents : slugs.children;
  check(
    `redirect target exists: ${r.to}`,
    pool.includes(target),
    `no document with slug "${target}" — the 301 would land on a 404`,
  );
  const stale = r.from.split('/').pop();
  check(
    `old slug is gone: ${r.from}`,
    !pool.includes(stale),
    `"${stale}" still exists, so both URLs resolve and the canonical is ambiguous`,
  );
}

check(
  'no slug collides within a collection',
  Object.values(slugs).every((list) => new Set(list).size === list.length),
  'duplicate slug',
);

done('verified against migration/raw/');
