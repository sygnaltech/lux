/**
 * PER-SITE. Copy to `migration-scripts/sanity/convert.mjs` and rewrite the document
 * loops for this site's collections.
 *
 * migration/raw/*.json  ->  migration/sanity/content.ndjson
 *
 *   node migration-scripts/sanity/convert.mjs            # convert
 *   node migration-scripts/sanity/convert.mjs --report   # convert and print what happened
 *
 * Pure function of the raw dump: no network, no writes to Sanity. Run it as
 * often as you like and diff the output. The import is a separate step
 * (`npm run sanity:import`) so a conversion can be inspected before anything
 * touches the dataset.
 *
 * WHY THIS FILE IS NOT PART OF THE ENGINE
 *
 * Because most of the work of a migration is deciding what NOT to carry, and
 * that decision is different on every site. A Webflow CMS that has been live
 * for years typically holds several generations of content in the same
 * collections — a purchased template's demo data, a previous brand's copy, and
 * the current copy — and all of it is "populated". A field-by-field importer
 * would publish all three.
 *
 * So: read the collections before writing this file (§4 of the skill), decide
 * per field, and write the decision down in migration-scripts/webflow/collections.mjs.
 * The shared machinery is in ./convert-lib.mjs and needs no editing.
 *
 * THE ONE ASSERTION THAT MATTERS: no visible character of the client's
 * published wording is lost. Everything else is secondary.
 */
import {
  load,
  idFor,
  ref,
  image,
  rich,
  clean,
  slugFor,
  finish,
  warn,
  drop,
} from './convert-lib.mjs';
import { EXCLUDED, EXPECTED } from '../webflow/collections.mjs';
import { REDIRECTS } from '../redirects.config.mjs';

const report = process.argv.includes('--report');

// ---------------------------------------------------------------------------
// Load
// ---------------------------------------------------------------------------
// One entry per collection in COLLECTIONS. A collection excluded WHOLESALE is
// simply not loaded here — say so in EXCLUDED.collections so the omission is
// deliberate rather than forgotten.

const [parents, children] = await Promise.all([
  load('<parentCollection>'),
  load('<childCollection>'),
]);

// ---------------------------------------------------------------------------
// Exclusions
// ---------------------------------------------------------------------------
// Applied HERE, not at pull time. The raw dump keeps everything; this is the
// one place that decides what the site gets, and --report says so out loud.

const liveChildren = children.filter((i) => {
  if (EXCLUDED.childRule(i)) {
    drop(`<childCollection>/${i.fieldData.slug} (<why>)`);
    return false;
  }
  return true;
});

// ---------------------------------------------------------------------------
// Ordering
// ---------------------------------------------------------------------------
// Check whether the child collection HAS an order field. Webflow collections
// often do not: the order lives only in the parent's reference array, and
// reading it here is the only way to preserve the order the site renders. An
// item referenced by no parent gets no order, sorts last, and is reported —
// which is correct for an orphan and worth knowing about.

const order = new Map();
for (const parent of parents) {
  (parent.fieldData['<reference-array-field>'] ?? []).forEach((childId, i) => {
    if (order.has(childId)) {
      warn('<parentCollection>', `child ${childId} is listed by more than one parent`);
      return;
    }
    order.set(childId, i + 1);
  });
}
for (const child of liveChildren) {
  if (!order.has(child.id)) {
    warn('<childCollection>', `${child.fieldData.slug} is in no parent's list — it will sort last`);
  }
}

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------
// One loop per collection. `f` is Webflow's fieldData; its keys are the
// collection's own slugified field names and are frequently NOT what the field
// is called in the editor — `number-3`, `new-description`, `rich-text`. Read
// them off the raw dump, never guess.
//
// `legacy` parks a field the site does not render but that should not be lost:
// the Webflow id and slug for traceability, and any unrendered rich text whose
// content decision has not been made yet. Parking beats deleting; publishing
// it unread is the mistake.

const docs = [];

for (const item of parents) {
  const f = item.fieldData;
  docs.push(
    clean({
      _id: idFor('<parentType>', item.id),
      _type: '<parentType>',
      title: f.name?.trim(),
      slug: { _type: 'slug', current: slugFor(REDIRECTS, '/<base-path>', f.slug, { report }) },
      heroImage: image(f.thumbnail),
      body: rich(f['<rich-text-field>'], `<parentType>/${f.slug}`),
      legacy: clean({
        _type: 'legacyRef',
        webflowId: item.id,
        webflowSlug: f.slug,
        createdOn: item.createdOn,
      }),
    }),
  );
}

for (const item of liveChildren) {
  const f = item.fieldData;
  const title = f.name?.trim();
  const heading = f['<heading-field>']?.trim();
  docs.push(
    clean({
      _id: idFor('<childType>', item.id),
      _type: '<childType>',
      title,
      // Only stored when it genuinely differs from the title — otherwise it is
      // noise an editor has to keep in step for no benefit.
      heading: heading && heading !== title ? heading : undefined,
      slug: { _type: 'slug', current: slugFor(REDIRECTS, '/<base-path>', f.slug, { report }) },
      parent: ref('<parentType>', f['<parent-reference-field>']),
      heroImage: image(f.thumbnail),
      body: rich(f['<rich-text-field>'], `<childType>/${f.slug}`),
      order: order.get(item.id),
      legacy: clean({
        _type: 'legacyRef',
        webflowId: item.id,
        webflowSlug: f.slug,
        createdOn: item.createdOn,
        originalBody: rich(f['<unrendered-rich-text-field>'], `<childType>/${f.slug} (legacy)`),
      }),
    }),
  );
}

// A child whose parent was excluded has nowhere to render. Guard it even when
// none exist today, so dropping a parent later cannot leave a document
// pointing at one the dataset does not contain.
const liveParentIds = new Set(parents.map((p) => p.id));
for (const item of liveChildren) {
  if (item.fieldData['<parent-reference-field>'] &&
      !liveParentIds.has(item.fieldData['<parent-reference-field>'])) {
    drop(`<childType>/${item.fieldData.slug} (its parent was excluded)`);
  }
}

// ---------------------------------------------------------------------------
// Site settings
// ---------------------------------------------------------------------------
// The one document with no Webflow ancestor. The fixed `_id` is what makes it
// a singleton — see studio/structure.ts.
//
// Seed it from the values currently hard-coded in the ported header and footer
// markup, so the singleton exists and is correct from the first import rather
// than being an empty form somebody has to find and fill. Read them off the
// live site's own markup, not off the brief.
//
// This is CONTENT, which is why it is here and not in project.jsonc: an editor
// changes it in the Studio afterwards, and from that point the dataset is the
// source of truth. Re-running the converter would overwrite it, so once the
// site is live, delete this block rather than leaving a stale copy that wins
// on the next import.

docs.push(
  clean({
    _id: 'siteSettings',
    _type: 'siteSettings',
    orgName: '',
    orgLegalName: '',
    titleTemplate: '%s | <org name>',
    defaultDescription: '',
    email: '',
    phone: '',
    // A reference that can only be resolved now the documents exist.
    defaultContact: ref('<type>', '<webflow-item-id>'),
  }),
);

// ---------------------------------------------------------------------------
// Checks, then write
// ---------------------------------------------------------------------------

await finish(docs, {
  expected: EXPECTED,
  report,
  // Types listed in EXPECTED that this converter deliberately does not emit,
  // e.g. a collection excluded wholesale.
  ignoreTypes: [],
});
