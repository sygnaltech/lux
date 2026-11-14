/**
 * PER-SITE — Lux Radiology.
 *
 * migration/raw/*.json  ->  migration/sanity/content.ndjson
 *
 *   node migration-scripts/sanity/convert.mjs            # convert
 *   node migration-scripts/sanity/convert.mjs --report   # convert and say what happened
 *
 * Pure function of the raw dump: no network, no writes to Sanity. Run it as
 * often as you like and diff the output. The import is a separate step
 * (`npm run sanity:import`) so a conversion can be inspected before anything
 * touches the dataset.
 *
 * THE ONE ASSERTION THAT MATTERS: no visible character of the client's
 * published wording is lost. Everything else is secondary.
 *
 * Every exclusion below is justified with a count in
 * migration-scripts/webflow/collections.mjs. This file is the loops; that file
 * is the decisions.
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
import {EXCLUDED, EXPECTED, FIELD_MAP, TEAM_ORDER, isPublished} from '../webflow/collections.mjs';
import {REDIRECTS} from '../redirects.config.mjs';

const report = process.argv.includes('--report');

// ---------------------------------------------------------------------------
// Load
// ---------------------------------------------------------------------------
// Eleven of the twelve collections. `loc` is NOT loaded: both its items are
// unpublished drafts, so Webflow renders its list empty and none of its
// content is on the live site. Declared in EXCLUDED.collections so the
// omission is on the record rather than looking like an oversight here.

const [
  rawPosts,
  rawServices,
  rawTeam,
  rawCategories,
  rawReviews,
  rawNeeds,
  rawMaternityScans,
  rawBabyWeeks,
  rawModals,
  rawServiceItems,
  rawPoacs,
] = await Promise.all([
  load('post'),
  load('service'),
  load('team'),
  load('category'),
  load('review'),
  load('need'),
  load('maternityScan'),
  load('babyWeek'),
  load('modal'),
  load('serviceItem'),
  load('poac'),
]);

// ---------------------------------------------------------------------------
// Exclusions
// ---------------------------------------------------------------------------
// Applied HERE, not at pull time. The raw dump keeps everything; this is the
// one place that decides what the site gets, and --report says so out loud.
//
// The rule is `isPublished` from collections.mjs, NOT `isArchived || isDraft`.
// One service — ultrasound-guided-injections — is a draft that Webflow is
// still serving because it was published before, and it is in the live
// sitemap. The naive rule drops it and loses a real URL.

const keep = (items, rule, label) =>
  items.filter((item) => {
    if (!rule(item)) return true;
    const why = item.isArchived ? 'archived' : 'draft, never published';
    drop(`${label}/${item.fieldData.slug} (${why})`);
    return false;
  });

const posts = keep(rawPosts, EXCLUDED.postRule, 'post');
const services = keep(rawServices, EXCLUDED.serviceRule, 'service');
const teamMembers = keep(rawTeam, EXCLUDED.teamRule, 'team');
const categories = keep(rawCategories, EXCLUDED.categoryRule, 'category');
const reviews = keep(rawReviews, EXCLUDED.reviewRule, 'review');
const needs = keep(rawNeeds, EXCLUDED.needRule, 'need');
const maternityScans = keep(rawMaternityScans, EXCLUDED.maternityScanRule, 'maternityScan');
const babyWeeks = keep(rawBabyWeeks, EXCLUDED.babyWeekRule, 'babyWeek');
const modals = keep(rawModals, EXCLUDED.modalRule, 'modal');
const serviceItems = keep(rawServiceItems, EXCLUDED.serviceItemRule, 'serviceItem');
const poacs = keep(rawPoacs, EXCLUDED.poacRule, 'poac');

// ---------------------------------------------------------------------------
// Ordering
// ---------------------------------------------------------------------------
// Four collections carry a usable Seq. TEAM DOES NOT: `seq` is null on every
// published member and Webflow's manual collection sort is not exposed by the
// API at all, so the order was captured from the rendered /about page and
// lives in TEAM_ORDER. After the import, Sanity's `order` field is the only
// source of truth and that list stops mattering.

const teamOrder = new Map(TEAM_ORDER.map((slug, i) => [slug, i + 1]));
for (const m of teamMembers) {
  if (!teamOrder.has(m.fieldData.slug)) {
    warn('team', `${m.fieldData.slug} is not in TEAM_ORDER — it will sort last`);
  }
}
for (const slug of teamOrder.keys()) {
  if (!teamMembers.some((m) => m.fieldData.slug === slug)) {
    warn('team', `TEAM_ORDER lists "${slug}", which is not a published member`);
  }
}

/**
 * Webflow Option fields come back as opaque ids, not labels.
 *
 * `maternityScan.scan-type` and `serviceItem.booking-type` are both Options.
 * The ids are carried VERBATIM rather than mapped to invented labels: the
 * grouping the scan calculator relies on is preserved exactly, and nobody has
 * to trust a guess about which id meant what. Give them readable values when
 * the calculator is rewired to read Sanity, not before.
 */
const option = (v) => (typeof v === 'string' && v ? v : undefined);

/** Provenance, including WHY a draft item is in the dataset at all. */
const legacy = (item) =>
  clean({
    _type: 'legacyRef',
    webflowId: item.id,
    webflowSlug: item.fieldData.slug,
    createdOn: item.createdOn,
    wasDraft: item.isDraft ? true : undefined,
  });

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------
// `f` is Webflow's fieldData. Its keys are the collection's slugified field
// names and are frequently NOT what the field is called in the editor — note
// `service-descirption`, which is Webflow's own misspelling and the real key.
// Read off the raw dump, never guessed. FIELD_MAP in collections.mjs is the
// same mapping as documentation.

const docs = [];

// ── post (3) ───────────────────────────────────────────────────────────────
for (const item of posts) {
  const f = item.fieldData;
  docs.push(
    clean({
      _id: idFor('post', item.id),
      _type: 'post',
      title: f.name?.trim(),
      slug: {_type: 'slug', current: slugFor(REDIRECTS, '/post', f.slug, {report})},
      date: f.date,
      summary: f['post-summary']?.trim(),
      mainImage: image(f['main-image']),
      body: rich(f['post-body'], `post/${f.slug}`),
      // `featured` is NOT carried: false on all three published posts, so it
      // discriminates nothing and reads it nowhere.
      legacy: legacy(item),
    }),
  );
}

// ── service (7) ────────────────────────────────────────────────────────────
for (const item of services) {
  const f = item.fieldData;
  docs.push(
    clean({
      _id: idFor('service', item.id),
      _type: 'service',
      title: f.name?.trim(),
      slug: {_type: 'slug', current: slugFor(REDIRECTS, '/services', f.slug, {report})},
      shortName: f['short-name']?.trim(),
      order: f.seq ?? undefined,
      category: ref('category', f.category),
      needs: (f.needs ?? []).map((id) => ({...ref('need', id), _key: id})),
      shortDescription: f['short-description']?.trim(),
      description: rich(f['service-descirption'], `service/${f.slug}`),
      notice: rich(f.notice, `service/${f.slug} notice`),
      // `icon-image` and NOT `icon`. Both are populated 7/7; only
      // `icon-image` filenames appear in the rendered HTML. `icon` is the
      // superseded 2021 set and one of its values is simply the wrong icon.
      icon: image(f['icon-image']),
      pageImage: image(f['service-page-image']),
      currentlyUnavailable: f['currently-unavailable'] === true ? true : undefined,
      // NOT carried: photo-credit, sbm-predefined, short-service-description
      // (all 0/7 populated), icon (unrendered), featured (true on all 7).
      legacy: legacy(item),
    }),
  );
}

// ── team (3) ───────────────────────────────────────────────────────────────
for (const item of teamMembers) {
  const f = item.fieldData;
  docs.push(
    clean({
      _id: idFor('team', item.id),
      _type: 'team',
      title: f.name?.trim(),
      slug: {_type: 'slug', current: slugFor(REDIRECTS, '/team', f.slug, {report})},
      jobTitle: f['job-title']?.trim(),
      order: teamOrder.get(f.slug),
      profilePicture: image(f['profile-picture']),
      profileSquare: image(f['profile-square']),
      bio: rich(f.bio, `team/${f.slug}`),
      linkedinUrl: f['linkedin-link'] || undefined,
      // NOT carried: twitter-link, facebook-link, google-plus-link (all 0/3),
      // seq (null on all 3 — see TEAM_ORDER).
      legacy: legacy(item),
    }),
  );
}

// ── category (2) ───────────────────────────────────────────────────────────
for (const item of categories) {
  const f = item.fieldData;
  docs.push(
    clean({
      _id: idFor('category', item.id),
      _type: 'category',
      title: f.name?.trim(),
      slug: {_type: 'slug', current: slugFor(REDIRECTS, '/category', f.slug, {report})},
      shortDescription: f['short-description']?.trim(),
      brief: rich(f.brief, `category/${f.slug} brief`),
      notes: rich(f.notes, `category/${f.slug} notes`),
      bookingNote: rich(f['booking-note'], `category/${f.slug} bookingNote`),
      bookingButtonText: f['booking-button-text']?.trim(),
      image: image(f.image),
      icon: image(f.icon),
      legacy: legacy(item),
    }),
  );
}

// ── review (169) ───────────────────────────────────────────────────────────
// Every published review becomes a document, INCLUDING the 17 rated below 4.
// Their pages are live and in the sitemap; it is the LISTING that filters
// them out, which is a route concern, not a content one. Dropping them here
// would delete 17 live URLs.
for (const item of reviews) {
  const f = item.fieldData;
  docs.push(
    clean({
      _id: idFor('review', item.id),
      _type: 'review',
      title: f.name?.trim(),
      slug: {_type: 'slug', current: slugFor(REDIRECTS, '/reviews', f.slug, {report})},
      from: f.from?.trim(),
      where: f.where?.trim(),
      rating: f.rating ?? undefined,
      brief: f.brief?.trim(),
      text: rich(f.text, `review/${f.slug}`),
      link: f.link || undefined,
      date: f.date,
      // `staff` is NOT carried: a reference to team, 0/169 populated.
      legacy: legacy(item),
    }),
  );
}

// ── need (3) ───────────────────────────────────────────────────────────────
for (const item of needs) {
  const f = item.fieldData;
  docs.push(
    clean({
      _id: idFor('need', item.id),
      _type: 'need',
      title: f.name?.trim(),
      slug: {_type: 'slug', current: f.slug},
      legacy: legacy(item),
    }),
  );
}

// ── maternityScan (7) ──────────────────────────────────────────────────────
for (const item of maternityScans) {
  const f = item.fieldData;
  docs.push(
    clean({
      _id: idFor('maternityScan', item.id),
      _type: 'maternityScan',
      title: f.name?.trim(),
      slug: {_type: 'slug', current: f.slug},
      scanType: option(f['scan-type']),
      description: rich(f.description, `maternityScan/${f.slug}`),
      // Fractional weeks are real: one scan is 12.5-13.5. `?? undefined`
      // rather than `||` so a legitimate 0 would survive.
      earliestWeek: f['earliest-week'] ?? undefined,
      latestWeek: f['latest-week'] ?? undefined,
      required: f.required === true ? true : undefined,
      anytime: f.anytime === true ? true : undefined,
      // NOT carried: sbm-service-id (0/7 populated).
      legacy: legacy(item),
    }),
  );
}

// ── babyWeek (25) ──────────────────────────────────────────────────────────
for (const item of babyWeeks) {
  const f = item.fieldData;
  docs.push(
    clean({
      _id: idFor('babyWeek', item.id),
      _type: 'babyWeek',
      title: f.name?.trim(),
      slug: {_type: 'slug', current: f.slug},
      weekStart: f['week-start'] ?? undefined,
      weekEnd: f['week-end'] ?? undefined,
      description: rich(f.description, `babyWeek/${f.slug}`),
      bulletPoints: rich(f['bullet-points'], `babyWeek/${f.slug} bullets`),
      legacy: legacy(item),
    }),
  );
}

// ── modal (13) ─────────────────────────────────────────────────────────────
for (const item of modals) {
  const f = item.fieldData;
  docs.push(
    clean({
      _id: idFor('modal', item.id),
      _type: 'modal',
      title: f.name?.trim(),
      slug: {_type: 'slug', current: f.slug},
      enabled: f.enabled === true ? true : undefined,
      startDate: f['start-date'],
      endDate: f['end-date'],
      image: image(f.image),
      content: rich(f.content, `modal/${f.slug}`),
      buttonText: f.button?.trim(),
      buttonUrl: f.link || undefined,
      buttonText2: f['button-2']?.trim(),
      buttonUrl2: f['link-2'] || undefined,
      // NOT carried: artwork (MultiImage, 0/13 populated).
      legacy: legacy(item),
    }),
  );
}

// ── serviceItem (53) ───────────────────────────────────────────────────────
for (const item of serviceItems) {
  const f = item.fieldData;
  docs.push(
    clean({
      _id: idFor('serviceItem', item.id),
      _type: 'serviceItem',
      title: f.name?.trim(),
      slug: {_type: 'slug', current: f.slug},
      service: ref('service', f.service),
      order: f.seq ?? undefined,
      sbmServiceId: f['sbm-serviceid']?.trim(),
      bookingType: option(f['booking-type']),
      weekdayBookingUrl: f['weekday-booking-link'] || undefined,
      weekendBookingUrl: f['weekend-booking-link'] || undefined,
      poacWeekendBookingUrl: f['poac-weekend-booking-link'] || undefined,
      phoneBookingOnly: f['phone-booking-only'] === true ? true : undefined,
      duration: f.duration?.trim(),
      price: f.price ?? undefined,
      // NOT carried: price-note (0/53 populated).
      legacy: legacy(item),
    }),
  );
}

// ── poac (14) ──────────────────────────────────────────────────────────────
for (const item of poacs) {
  const f = item.fieldData;
  docs.push(
    clean({
      _id: idFor('poac', item.id),
      _type: 'poac',
      title: f.name?.trim(),
      slug: {_type: 'slug', current: f.slug},
      serviceItem: ref('serviceItem', f['service-item']),
      order: f.seq ?? undefined,
      legacy: legacy(item),
    }),
  );
}

// ---------------------------------------------------------------------------
// Orphan guard
// ---------------------------------------------------------------------------
// A child whose parent was excluded has nowhere to render. `finish` catches a
// reference to a document that does not exist, but these two are worth
// naming explicitly: a serviceItem under a dropped service, and a poac under
// a dropped serviceItem, are both silent blank regions on a live page.

const publishedServiceIds = new Set(services.map((s) => s.id));
for (const item of serviceItems) {
  const parent = item.fieldData.service;
  if (parent && !publishedServiceIds.has(parent)) {
    warn('serviceItem', `${item.fieldData.slug} references a service that is not published`);
  }
}

const publishedItemIds = new Set(serviceItems.map((s) => s.id));
for (const item of poacs) {
  const parent = item.fieldData['service-item'];
  if (parent && !publishedItemIds.has(parent)) {
    warn('poac', `${item.fieldData.slug} references a serviceItem that is not published`);
  }
}

// Field map is imported purely so an edit here that forgets to update the
// documentation in collections.mjs is at least visible in one file's imports.
void FIELD_MAP;
void isPublished;

// ---------------------------------------------------------------------------
// Checks, then write
// ---------------------------------------------------------------------------

await finish(docs, {
  expected: EXPECTED,
  report,
  // `location` is in EXPECTED as 0 rather than listed here, so the assertion
  // "this converter emits no location documents" is actually checked.
  ignoreTypes: [],
});
