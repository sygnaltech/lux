/**
 * PER-SITE — Lux Radiology.
 *
 * Check what is actually in the Sanity dataset against the Webflow source.
 *
 *   node migration-scripts/sanity/verify.mjs
 *
 * Reads migration/raw/, so it needs a `npm run wf:pull` first (that directory
 * is gitignored — it holds named individuals' review text and is re-pullable).
 *
 * Expected numbers are DERIVED from the raw dump wherever possible rather than
 * written down here. A hardcoded "3 of 7 services have a page image" goes stale
 * the moment an editor adds one, and goes stale silently.
 */
import {query, raw, check, compareBody, done} from './verify-lib.mjs';
import {EXPECTED, RICH_TEXT_FIELDS, TEAM_ORDER, isPublished} from '../webflow/collections.mjs';
import {REDIRECTS} from '../redirects.config.mjs';

// ---------------------------------------------------------------------------
// Load every raw collection the dataset should reflect
// ---------------------------------------------------------------------------

const COLLECTION_NAMES = [
  'post',
  'service',
  'team',
  'category',
  'review',
  'need',
  'maternityScan',
  'babyWeek',
  'modal',
  'serviceItem',
  'poac',
];

const rawByName = Object.fromEntries(
  await Promise.all(
    COLLECTION_NAMES.map(async (name) => [name, (await raw(name)).filter(isPublished)]),
  ),
);

/** Published items of a collection, by slug. */
const bySlug = (name) =>
  new Map(rawByName[name].map((i) => [i.fieldData.slug, i]));

/** How many published items populate a given Webflow field. */
const populated = (name, field) =>
  rawByName[name].filter((i) => {
    const v = i.fieldData[field];
    if (v == null || v === '') return false;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'object') return Boolean(v.url ?? true);
    return true;
  }).length;

// ---------------------------------------------------------------------------
// Counts
// ---------------------------------------------------------------------------

const counts = await query(`{
  "post":          count(*[_type == "post"]),
  "service":       count(*[_type == "service"]),
  "team":          count(*[_type == "team"]),
  "category":      count(*[_type == "category"]),
  "review":        count(*[_type == "review"]),
  "need":          count(*[_type == "need"]),
  "maternityScan": count(*[_type == "maternityScan"]),
  "babyWeek":      count(*[_type == "babyWeek"]),
  "modal":         count(*[_type == "modal"]),
  "serviceItem":   count(*[_type == "serviceItem"]),
  "poac":          count(*[_type == "poac"]),
  "location":      count(*[_type == "location"]),
  "total":         count(*[!(_id in path("drafts.**")) && !(_type match "sanity.*")])
}`);

for (const [type, expected] of Object.entries(EXPECTED)) {
  check(`count ${type} = ${expected}`, counts[type] === expected, `got ${counts[type]}`);
}

/**
 * A collection excluded WHOLESALE must have produced nothing.
 *
 * `loc` (Locations) holds two never-published drafts carrying a second address,
 * parking copy and a red "important message". Asserted rather than assumed:
 * this is the check that catches an exclusion rule which stopped matching
 * after a converter edit, and the failure mode is publishing content the
 * client took down.
 */
check('no location documents', counts.location === 0, `got ${counts.location}`);

// Every document the dataset holds is accounted for by EXPECTED.
const expectedTotal = Object.values(EXPECTED).reduce((a, b) => a + b, 0);
check(
  `dataset holds exactly ${expectedTotal} documents`,
  counts.total === expectedTotal,
  `got ${counts.total} — an unaccounted document type is in the dataset`,
);

// Reconcile to §1: the five public types are the item pages in the sitemap.
const itemPages =
  counts.post + counts.service + counts.team + counts.category + counts.review;
check(
  '184 CMS item pages (+ 18 static = 202, the live sitemap)',
  itemPages === 184,
  `got ${itemPages}`,
);

// ---------------------------------------------------------------------------
// References
// ---------------------------------------------------------------------------

const refs = await query(`{
  "serviceWithCategory":  count(*[_type == "service" && defined(category->_id)]),
  "serviceNeedRefs":      count(*[_type == "service"].needs[]->_id),
  "itemsWithService":     count(*[_type == "serviceItem" && defined(service->_id)]),
  "poacWithItem":         count(*[_type == "poac" && defined(serviceItem->_id)]),
  "danglingService":      count(*[_type == "serviceItem" && defined(service) && !defined(service->_id)]),
  "danglingPoac":         count(*[_type == "poac" && defined(serviceItem) && !defined(serviceItem->_id)]),
  "danglingCategory":     count(*[_type == "service" && defined(category) && !defined(category->_id)])
}`);

check(
  `all ${EXPECTED.service} services resolve a category`,
  refs.serviceWithCategory === populated('service', 'category'),
  `got ${refs.serviceWithCategory}, raw has ${populated('service', 'category')}`,
);
check(
  `all ${EXPECTED.serviceItem} service items resolve their service`,
  refs.itemsWithService === EXPECTED.serviceItem,
  `got ${refs.itemsWithService}`,
);
check(
  `all ${EXPECTED.poac} POAC items resolve their service item`,
  refs.poacWithItem === populated('poac', 'service-item'),
  `got ${refs.poacWithItem}`,
);

// A dangling reference imports without complaint and surfaces as a blank card
// weeks later, so each edge is asserted to have NO unresolvable end.
check('no dangling service references', refs.danglingService === 0, `got ${refs.danglingService}`);
check('no dangling POAC references', refs.danglingPoac === 0, `got ${refs.danglingPoac}`);
check('no dangling category references', refs.danglingCategory === 0, `got ${refs.danglingCategory}`);

// `needs` is a multi-reference; compare the total edge count to the source.
const rawNeedEdges = rawByName.service.reduce(
  (n, i) => n + (i.fieldData.needs ?? []).length,
  0,
);
check(
  `all ${rawNeedEdges} service->need edges survived`,
  refs.serviceNeedRefs === rawNeedEdges,
  `got ${refs.serviceNeedRefs}`,
);

// ---------------------------------------------------------------------------
// Ordering
// ---------------------------------------------------------------------------

const ordered = await query(`{
  "services": *[_type == "service"] | order(coalesce(order, 9999) asc) { "slug": slug.current, order },
  "team":     *[_type == "team"]    | order(coalesce(order, 9999) asc) { "slug": slug.current, order },
  "items":    *[_type == "serviceItem"] | order(coalesce(order, 9999) asc) { "slug": slug.current, order }
}`);

/** Service order comes from Webflow's own Seq field, so re-derive it. */
const wantServices = rawByName.service
  .slice()
  .sort((a, b) => (a.fieldData.seq ?? 9999) - (b.fieldData.seq ?? 9999))
  .map((i) => i.fieldData.slug);
check(
  'service order matches Webflow Seq',
  ordered.services.map((s) => s.slug).join('|') === wantServices.join('|'),
  `want ${wantServices.join(', ')}\n        got  ${ordered.services.map((s) => s.slug).join(', ')}`,
);

/**
 * TEAM ORDER IS THE ONE THAT CANNOT BE RE-DERIVED.
 *
 * `team.seq` is null on every published member and Webflow's manual collection
 * sort is not exposed by its API, so the order was read off the rendered
 * /about page and lives in TEAM_ORDER. Asserting against that constant is the
 * only check available — but it is still worth having, because it catches the
 * converter silently dropping the injected `order` field.
 */
check(
  'team order matches the order captured from the rendered site',
  ordered.team.map((t) => t.slug).join('|') === TEAM_ORDER.join('|'),
  `want ${TEAM_ORDER.join(', ')}\n        got  ${ordered.team.map((t) => t.slug).join(', ')}`,
);
check(
  'every team member has an order',
  ordered.team.every((t) => typeof t.order === 'number'),
  'a member with no order sorts last and the About page silently reshuffles',
);

const wantItems = rawByName.serviceItem
  .slice()
  .sort((a, b) => (a.fieldData.seq ?? 9999) - (b.fieldData.seq ?? 9999))
  .map((i) => i.fieldData.slug);
check(
  'service item order matches Webflow Seq',
  ordered.items.map((s) => s.slug).join('|') === wantItems.join('|'),
  'service item ordering diverged',
);

// ---------------------------------------------------------------------------
// Assets
// ---------------------------------------------------------------------------
// COUNTS, not merely "no broken references". An image that silently failed to
// convert leaves a document with no image at all, which no reference check
// sees. Each expected number is derived from how many published Webflow items
// populate that field.

const assets = await query(`{
  "postMain":      count(*[_type == "post" && defined(mainImage.asset)]),
  "serviceIcon":   count(*[_type == "service" && defined(icon.asset)]),
  "servicePage":   count(*[_type == "service" && defined(pageImage.asset)]),
  "teamPicture":   count(*[_type == "team" && defined(profilePicture.asset)]),
  "teamSquare":    count(*[_type == "team" && defined(profileSquare.asset)]),
  "categoryImage": count(*[_type == "category" && defined(image.asset)]),
  "categoryIcon":  count(*[_type == "category" && defined(icon.asset)]),
  "modalImage":    count(*[_type == "modal" && defined(image.asset)]),
  "broken":        count(*[defined(mainImage) && !defined(mainImage.asset._ref)])
                 + count(*[defined(icon) && !defined(icon.asset._ref)])
                 + count(*[defined(image) && !defined(image.asset._ref)]),
  "uploaded":      count(*[_type == "sanity.imageAsset"])
}`);

const assetChecks = [
  ['post.mainImage', assets.postMain, populated('post', 'main-image')],
  ['service.icon (from Webflow icon-image)', assets.serviceIcon, populated('service', 'icon-image')],
  ['service.pageImage', assets.servicePage, populated('service', 'service-page-image')],
  ['team.profilePicture', assets.teamPicture, populated('team', 'profile-picture')],
  ['team.profileSquare', assets.teamSquare, populated('team', 'profile-square')],
  ['category.image', assets.categoryImage, populated('category', 'image')],
  ['category.icon', assets.categoryIcon, populated('category', 'icon')],
  ['modal.image', assets.modalImage, populated('modal', 'image')],
];

for (const [label, got, want] of assetChecks) {
  check(`${label}: ${want} image(s)`, got === want, `got ${got}, raw has ${want}`);
}
check('no unresolved image references', assets.broken === 0, `got ${assets.broken}`);

/**
 * THE IMAGES MUST BE IN SANITY, NOT STILL ON WEBFLOW.
 *
 * `_sanityAsset: "image@https://cdn.prod.website-files.com/…"` is a fetch
 * directive, not a reference. If the import could not reach a URL, the
 * directive is dropped and the document simply has no image — which every
 * reference check passes. So assert that real assets exist.
 */
check(
  'image assets were actually uploaded to Sanity',
  assets.uploaded > 0,
  'no sanity.imageAsset documents — nothing was fetched from Webflow',
);

// ---------------------------------------------------------------------------
// Bodies — the text must survive conversion
// ---------------------------------------------------------------------------
// Every field in RICH_TEXT_FIELDS, compared character for character against
// the source HTML once whitespace is normalised. This is the check that
// catches a converter regression after a schema change.

const SANITY_FIELD = {
  'post.post-body': ['post', 'body'],
  'service.service-descirption': ['service', 'description'],
  'service.notice': ['service', 'notice'],
  'team.bio': ['team', 'bio'],
  'category.brief': ['category', 'brief'],
  'category.notes': ['category', 'notes'],
  'category.booking-note': ['category', 'bookingNote'],
  'review.text': ['review', 'text'],
  'maternityScan.description': ['maternityScan', 'description'],
  'babyWeek.description': ['babyWeek', 'description'],
  'babyWeek.bullet-points': ['babyWeek', 'bulletPoints'],
  'modal.content': ['modal', 'content'],
};

const bodyProblems = [];
let compared = 0;

for (const spec of RICH_TEXT_FIELDS) {
  const mapping = SANITY_FIELD[spec];
  check(`rich-text field is mapped: ${spec}`, Boolean(mapping), 'add it to SANITY_FIELD');
  if (!mapping) continue;

  const [collection, sanityField] = mapping;
  const webflowField = spec.slice(spec.indexOf('.') + 1);
  const docs = await query(
    `*[_type == "${collection}"]{ "slug": slug.current, "value": ${sanityField} }`,
  );
  const source = bySlug(collection);

  for (const doc of docs) {
    const item = source.get(doc.slug);
    if (!item) {
      bodyProblems.push(`${collection}/${doc.slug} has no published Webflow source`);
      continue;
    }
    const html = item.fieldData[webflowField];
    if (!html && !doc.value) continue;
    compared += 1;
    compareBody(bodyProblems, `${collection}.${sanityField}/${doc.slug}`, html, doc.value);
  }
}

check(
  `rich text preserved across ${compared} field(s)`,
  bodyProblems.length === 0,
  bodyProblems.slice(0, 8).join('\n      '),
);

// ---------------------------------------------------------------------------
// Slugs and redirects
// ---------------------------------------------------------------------------

const slugs = await query(`{
  "post":     *[_type == "post"].slug.current,
  "service":  *[_type == "service"].slug.current,
  "team":     *[_type == "team"].slug.current,
  "category": *[_type == "category"].slug.current,
  "review":   *[_type == "review"].slug.current
}`);

const BASE = {
  '/post': 'post',
  '/services': 'service',
  '/team': 'team',
  '/category': 'category',
  '/reviews': 'review',
};

for (const r of REDIRECTS) {
  const base = Object.keys(BASE).find((b) => r.to.startsWith(`${b}/`));
  if (!base) continue;
  const pool = slugs[BASE[base]];
  const target = r.to.slice(base.length + 1);
  check(
    `redirect target exists: ${r.to}`,
    pool.includes(target),
    `no document with slug "${target}" — the 301 would land on a 404`,
  );
  const stale = r.from.slice(base.length + 1);
  check(
    `old slug is gone: ${r.from}`,
    !pool.includes(stale),
    `"${stale}" still exists, so both URLs resolve and the canonical is ambiguous`,
  );
}

for (const [type, list] of Object.entries(slugs)) {
  check(
    `no slug collides within ${type}`,
    new Set(list).size === list.length,
    `duplicate slug in ${type}`,
  );
}

/**
 * Every published Webflow slug has a document, and vice versa.
 *
 * The count checks above would pass if the converter emitted the right NUMBER
 * of documents with the wrong slugs — which is exactly what a redirect rule
 * applied to the wrong collection would do, and every one of those is a dead
 * URL.
 */
for (const [base, type] of Object.entries(BASE)) {
  const want = [...bySlug(type).keys()].sort();
  const got = [...slugs[type]].sort();
  const missing = want.filter((s) => !got.includes(s));
  const extra = got.filter((s) => !want.includes(s));
  check(
    `${base}/* slugs match the published Webflow items`,
    missing.length === 0 && extra.length === 0,
    `missing: ${missing.slice(0, 5).join(', ') || 'none'} | unexpected: ${extra.slice(0, 5).join(', ') || 'none'}`,
  );
}

done('verified against migration/raw/');
