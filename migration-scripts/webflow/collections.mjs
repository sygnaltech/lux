/**
 * PER-SITE — Lux Radiology. The Webflow → Sanity field map, read from the LIVE
 * CMS on 2026-11-14.
 *
 * Read this alongside the Sanity schema: this file says where every Sanity
 * field comes from; the schema says what it means. A field that appears in one
 * and not the other is a bug in whichever was edited last.
 *
 * THE SHAPE OF THIS CMS
 *
 * Twelve collections, and only FIVE have public item pages. The other seven are
 * data sources bound into lists and dropdowns on static pages — which is why
 * the §1 URL inventory (202) does not account for them, and why their content
 * still has to come across even though no URL points at it.
 *
 *   public item pages   post, service, team, category, review
 *   data only           need, maternityScan, babyWeek, modal, serviceItem, poac
 *   dead                loc  (see EXCLUDED.collections)
 */

/**
 * The Webflow site, and the CDN bucket its assets live in.
 *
 * Both are the same value here: Webflow serves assets from
 * `cdn.prod.website-files.com/<site-id>/…`. `SITE_ID` is the `data-wf-site`
 * attribute in the live page source.
 */
export const SITE_ID = '60f0b32c84789d2d1b5ddbb8';
export const ASSETS_ID = '60f0b32c84789d2d1b5ddbb8';

/**
 * Collection name -> Webflow collection id.
 *
 * The name is what `wf:pull` writes to migration/raw/<name>.json and what the
 * converter loads, so it is the camelCase singular of the document type — NOT
 * Webflow's own slug, which is inconsistent here (`post` singular, `reviews`
 * plural, `loc` abbreviated, `baby` for Maternity Developments).
 *
 * EVERY collection is pulled, including `loc`, which publishes nothing. The raw
 * dump is the record of what the CMS actually held; exclusion is the
 * converter's job, where it is written down and reportable.
 */
export const COLLECTIONS = {
  // Public item pages.
  post: '60f0b32c84789d54c95ddbc8',
  service: '60f0b32c84789d91e95ddbc9',
  team: '60f0b32c84789d57e65ddbca',
  category: '6115a1e0a6aed245edd3b675',
  review: '62f380322a9d956e9f578ef7',

  // Data only — bound into lists on static pages, no item route.
  need: '6371b20860a89ca3f9c061c7',
  maternityScan: '662c65d7f43e83e0b79f6df3',
  babyWeek: '666e6d35b49442553dbe03cd',
  modal: '666e96aebf6183cc1eb476f5',
  serviceItem: '670e2688d3a6bef4d5e9b4d0',
  poac: '6715b0ba78a3dccbef401907',

  // Pulled for the record, published by nothing. See EXCLUDED.collections.
  loc: '62e305924cb40fd6eda7a4cb',
};

/**
 * THE PUBLISHED TEST — and the single most important line in this file.
 *
 * `isArchived || isDraft` is the obvious rule and it is WRONG on this site.
 *
 * `service/ultrasound-guided-injections` has `isDraft: true` AND
 * `lastPublished: "2026-05-29"`. Webflow carries on serving an item that was
 * published and later set back to draft: the page is live, it is in the live
 * sitemap, and it renders. The naive rule drops it — losing a real URL from a
 * migration whose entire acceptance test is URL parity.
 *
 * `lastPublished` is the discriminator. The three OTHER drafts
 * (`immigration-x-rays`, `3d4d`, `ultrasound`) all have `lastPublished: null`
 * — never published, correctly dropped.
 *
 * Verified: this rule reproduces the live sitemap EXACTLY for all five public
 * collections (post 3, service 7, team 3, category 2, review 169), where the
 * naive rule gets service wrong by one.
 */
export const isPublished = (item) =>
  !item.isArchived && (!item.isDraft || item.lastPublished != null);

/**
 * What does NOT come across, and why.
 *
 * Authored after reading the RAW DUMP, not the schema. Every claim below is a
 * count over published items, not an impression.
 */
export const EXCLUDED = {
  /**
   * Collections excluded WHOLESALE — never loaded by the converter.
   *
   * `loc` (Locations) holds two items, `582-k-road` and `195-ponsonby-rd`, and
   * BOTH are drafts that have never been published (`lastPublished: null`). So
   * Webflow renders its collection list empty and none of this content is on
   * the live site. It carries address, parking and an "Important Message (Red)"
   * — exactly the sort of thing that looks essential and would have been
   * imported by a field-by-field converter, publishing a red alert banner and
   * a second address that the client took down.
   *
   * Nothing reads this array; it is here so the omission is a decision on the
   * record. verify.mjs asserts the resulting document count is zero.
   */
  collections: ['loc'],

  /**
   * One rule per partially-excluded collection, named `<collection>Rule`.
   * All twelve share the same published test — see `isPublished` above for why
   * it is not simply `isArchived || isDraft`.
   */
  postRule: (i) => !isPublished(i),
  serviceRule: (i) => !isPublished(i),
  teamRule: (i) => !isPublished(i),
  categoryRule: (i) => !isPublished(i),
  reviewRule: (i) => !isPublished(i),
  needRule: (i) => !isPublished(i),
  maternityScanRule: (i) => !isPublished(i),
  babyWeekRule: (i) => !isPublished(i),
  modalRule: (i) => !isPublished(i),
  serviceItemRule: (i) => !isPublished(i),
  poacRule: (i) => !isPublished(i),
};

/**
 * Fields POPULATED in Webflow and deliberately not published.
 *
 * Documentation, not code — but this is precisely the list a field-by-field
 * importer would have shipped. Counts are over PUBLISHED items only.
 */
export const DEAD_FIELDS = {
  // ── Two icon fields, and the site renders the first ──────────────────────
  // Both are populated 7/7, so population alone cannot tell them apart. The
  // live HTML can: every `icon-image` filename appears in the rendered pages
  // and NOT ONE `icon` filename does, on the home page or a service page.
  //
  // `icon` is the superseded 2021 icon set (`6129ed…`), `icon-image` the 2022
  // replacement (`6322ea…`). The giveaway is that guided-injections' `icon` is
  // `musculoskeletal.svg` — a copy-paste nobody noticed, because nothing
  // renders it.
  'service.icon': 'Superseded 2021 icon set. Populated 7/7 but renders nowhere; one value is simply wrong.',

  // ── Never populated on any published item ────────────────────────────────
  'service.photo-credit': 'RichText, 0/7 populated.',
  'service.sbm-predefined': 'PlainText, 0/7 populated. SimplyBook integration leftover.',
  'service.short-service-description':
    'RichText, 0/7 populated. The SECOND of two rich-text description fields — the site renders `service-descirption` (Webflow\'s own typo). This is the classic trap: an unrendered rich-text twin that a converter would publish.',
  'team.twitter-link': 'Link, 0/3 populated.',
  'team.facebook-link': 'Link, 0/3 populated.',
  'team.google-plus-link': 'Link, 0/3 populated. Google Plus has not existed since 2019.',
  'review.staff': 'Reference to team, 0/169 populated. A reference wired to nothing.',
  'maternityScan.sbm-service-id': 'PlainText, 0/7 populated. SimplyBook leftover.',
  'modal.artwork': 'MultiImage, 0/13 populated.',
  'serviceItem.price-note': 'PlainText, 0/53 populated.',

  // ── Switches wired to nothing ────────────────────────────────────────────
  // Populated on every item, with the SAME value on every item, so they
  // cannot be driving anything. Carrying them across would invite someone to
  // "fix" a flag the design never consulted.
  'post.featured': 'Switch, false on all 3 published posts. No discrimination, so nothing reads it.',
  'service.featured': 'Switch, true on all 7 published services. Same: a constant is not a flag.',

  // ── Ordering that is not in the API ──────────────────────────────────────
  'team.seq': 'Number, null on all 3 published members — see TEAM_ORDER below.',
};

/**
 * TEAM ORDER, CAPTURED FROM THE RENDERED SITE.
 *
 * `team.seq` is null on every published member, so the collection has NO order
 * field — and Webflow's manual collection sort is not exposed by the API at
 * all. The order therefore cannot be derived from the dump by any means.
 *
 * Read off the live /about page, which renders: andrew, alan, nethanel.
 * It is neither alphabetical (alan, andrew, nethanel) nor creation order
 * (andrew 2022, nethanel 2023, alan 2024), which is how we know it is a manual
 * sort rather than something recoverable.
 *
 * This is a HAND-LISTED SET, which this file otherwise argues against — but
 * the alternative is losing the ordering entirely. It is three items and they
 * become an explicit `order` field in Sanity, after which the editor owns it
 * and this list stops mattering.
 */
export const TEAM_ORDER = ['andrew', 'alan', 'nethanel'];

/**
 * Webflow field key -> Sanity field, per collection.
 *
 * Documentation for the loops in convert.mjs, kept beside the exclusions so one
 * file answers "where did this field come from". Webflow's keys are slugified
 * and frequently NOT what the field is called in the editor — note
 * `service-descirption`, which is Webflow's own misspelling and the real key.
 *
 * `name` -> `title` and `slug` -> `slug.current` everywhere; listed per
 * collection anyway so each block is readable on its own.
 */
export const FIELD_MAP = {
  post: {
    name: 'title',
    slug: 'slug.current',
    'post-body': 'body',
    'post-summary': 'summary',
    'main-image': 'mainImage',
    date: 'date',
  },

  service: {
    name: 'title',
    slug: 'slug.current',
    'short-name': 'shortName',
    'short-description': 'shortDescription',
    'service-descirption': 'description',
    notice: 'notice',
    'icon-image': 'icon',
    'service-page-image': 'pageImage',
    seq: 'order',
    category: 'category',
    needs: 'needs',
    'currently-unavailable': 'currentlyUnavailable',
  },

  team: {
    name: 'title',
    slug: 'slug.current',
    'job-title': 'jobTitle',
    bio: 'bio',
    'profile-picture': 'profilePicture',
    'profile-square': 'profileSquare',
    'linkedin-link': 'linkedinUrl',
    // `order` is injected from TEAM_ORDER, not mapped from a Webflow field.
  },

  category: {
    name: 'title',
    slug: 'slug.current',
    'short-description': 'shortDescription',
    brief: 'brief',
    notes: 'notes',
    'booking-note': 'bookingNote',
    'booking-button-text': 'bookingButtonText',
    image: 'image',
    icon: 'icon',
  },

  review: {
    name: 'title',
    slug: 'slug.current',
    from: 'from',
    where: 'where',
    rating: 'rating',
    brief: 'brief',
    text: 'text',
    link: 'link',
    date: 'date',
  },

  need: {
    name: 'title',
    slug: 'slug.current',
  },

  maternityScan: {
    name: 'title',
    slug: 'slug.current',
    description: 'description',
    'scan-type': 'scanType',
    required: 'required',
    anytime: 'anytime',
    'earliest-week': 'earliestWeek',
    'latest-week': 'latestWeek',
  },

  babyWeek: {
    name: 'title',
    slug: 'slug.current',
    'week-start': 'weekStart',
    'week-end': 'weekEnd',
    description: 'description',
    'bullet-points': 'bulletPoints',
  },

  modal: {
    name: 'title',
    slug: 'slug.current',
    enabled: 'enabled',
    'start-date': 'startDate',
    'end-date': 'endDate',
    image: 'image',
    content: 'content',
    button: 'buttonText',
    link: 'buttonUrl',
    'button-2': 'buttonText2',
    'link-2': 'buttonUrl2',
  },

  serviceItem: {
    name: 'title',
    slug: 'slug.current',
    service: 'service',
    seq: 'order',
    'sbm-serviceid': 'sbmServiceId',
    'booking-type': 'bookingType',
    'weekday-booking-link': 'weekdayBookingUrl',
    'weekend-booking-link': 'weekendBookingUrl',
    'poac-weekend-booking-link': 'poacWeekendBookingUrl',
    'phone-booking-only': 'phoneBookingOnly',
    duration: 'duration',
    price: 'price',
  },

  poac: {
    name: 'title',
    slug: 'slug.current',
    seq: 'order',
    'service-item': 'serviceItem',
  },
};

/**
 * Expected LIVE document count per type, after exclusions.
 *
 * Both the converter and the dataset verifier assert against this, so a silent
 * half-import is impossible. Derived from the raw dump under `isPublished`.
 *
 * RECONCILES TO §1: the five public types sum to 184 item pages
 * (3 + 7 + 3 + 2 + 169), and 184 + 18 static pages = 202, the live sitemap's
 * URL count. The remaining six types have no URLs of their own by design.
 */
export const EXPECTED = {
  post: 3,
  service: 7,
  team: 3,
  category: 2,
  review: 169,

  need: 3,
  maternityScan: 7,
  babyWeek: 25,
  modal: 13,
  serviceItem: 53,
  poac: 14,

  // Excluded wholesale — asserted to be zero, not absent.
  location: 0,
};

/**
 * Rich-text fields, as `<collection>.<field>`.
 *
 * The verifier compares each of these character for character against the
 * source HTML. Listing them means adding a rich-text field cannot quietly
 * escape that comparison.
 *
 * `service.short-service-description` is NOT here on purpose — it is a dead
 * field (see DEAD_FIELDS) and is never converted, so there is nothing to
 * compare.
 */
export const RICH_TEXT_FIELDS = [
  'post.post-body',
  'service.service-descirption',
  'service.notice',
  'team.bio',
  'category.brief',
  'category.notes',
  'category.booking-note',
  'review.text',
  'maternityScan.description',
  'babyWeek.description',
  'babyWeek.bullet-points',
  'modal.content',
];
