/**
 * PER-SITE. Copy to `migration-scripts/webflow/collections.mjs` and author it from §4.
 *
 * The Webflow → Sanity field map, read from the LIVE CMS on <date>.
 *
 * Read this alongside the Sanity schema: this file says where every Sanity
 * field comes from; the schema says what it means. A field that appears in one
 * and not the other is a bug in whichever was edited last.
 *
 * WRITE THIS FILE AFTER READING THE CMS, NOT BEFORE. A content model inferred
 * from rendered pages is substantially wrong, every time. Reading the
 * collections directly is where the quality of the migration is decided — see
 * the §4 warning in the skill for what one small site actually contained.
 *
 * WHY THIS FILE IS LONG
 *
 * Because most of the work of a migration is deciding what NOT to carry. A
 * Webflow CMS that has been live for years usually holds several generations of
 * content in the same collections — a purchased template's demo data, a
 * previous brand's copy, and the current copy — and all of it is "populated".
 * Only the current generation is live on the site.
 *
 * A migration that moved every populated field would publish the wrong
 * practice's boilerplate on the wrong page, resurrect an old trading name, and
 * add a section written in Latin. Say what is excluded and why, here, where it
 * is testable.
 */

/**
 * The Webflow site, and the CDN bucket its assets live in.
 *
 * `SITE_ID` is the `data-wf-site` attribute in the live page source; the pull
 * records it in migration/raw/_meta.json so a later reader can tell which
 * Webflow site a dump came from without trusting the folder it sits in.
 * `ASSETS_ID` is the bucket, which tells the site's own assets from
 * third-party ones when auditing what is left on Webflow.
 */
export const SITE_ID = '<webflow-site-id>';
export const ASSETS_ID = '<webflow-assets-id>';

/**
 * Collection name -> Webflow collection id.
 *
 * The name is what `wf:pull` writes to migration/raw/<name>.json and what the
 * converter loads, so keep it the camelCase singular of the document type.
 */
export const COLLECTIONS = {
  '<collectionName>': '<webflow-collection-id>',
};

/**
 * What does NOT come across, and why.
 *
 * Rules are functions of a raw Webflow item so they are testable and so
 * `sanity:convert --report` can say exactly which items each one dropped.
 * Prefer a rule over a hand-listed set of ids: a list goes stale the moment
 * somebody adds an item in Webflow, and goes stale silently.
 */
export const EXCLUDED = {
  /**
   * Collections excluded WHOLESALE — never loaded by the converter at all.
   *
   * Name them here even though nothing reads this array, so the omission is a
   * decision on the record rather than something a later reader has to notice
   * is missing. Assert the resulting count is zero in verify.mjs.
   */
  collections: ['<collectionName>'],

  /**
   * One rule per partially-excluded collection, named `<collection>Rule`.
   *
   *   itemRule: (i) => i.isArchived || i.isDraft,
   *
   * `isArchived` and `isDraft` are Webflow's own flags and are the honest test
   * for "not live". Resist matching on a slug or a title — a rule that encodes
   * today's content breaks when the content changes, and a converter that
   * silently stops excluding is worse than one that never excluded.
   */
  '<collection>Rule': (item) => item.isArchived || item.isDraft,
};

/**
 * Fields that are POPULATED in Webflow and deliberately not published.
 *
 * Documentation, not code — but write it down. These are the fields that a
 * field-by-field importer would have shipped, and the next person to touch the
 * converter needs to know they were considered rather than missed.
 *
 *   '<collection>.<field>': 'why it is not carried',
 *
 * Common cases: a second rich-text field where the site renders the first; a
 * Webflow system timestamp bound into a template by whoever built it; a switch
 * wired to nothing; boilerplate describing a different subject entirely.
 */
export const DEAD_FIELDS = {
  '<collection>.<field>': '<why>',
};

/**
 * Webflow field key -> Sanity field, per collection.
 *
 * Documentation for the loops in convert.mjs, kept beside the exclusions so one
 * file answers "where did this field come from". Webflow's keys are slugified
 * and frequently NOT what the field is called in the editor — `number-3`,
 * `new-description`, `rich-text`. Read them off the raw dump, never guess.
 */
export const FIELD_MAP = {
  '<collectionName>': {
    name: 'title',
    slug: 'slug.current',
    '<webflow-field-key>': '<sanityField>',
  },
};

/**
 * Expected LIVE document count per type, after exclusions.
 *
 * Both the converter and the dataset verifier assert against this, so it is the
 * number that makes a silent half-import impossible. Derive it from the raw
 * dump once the exclusion rules are written — `wf:pull` prints total and live
 * counts per collection — and reconcile it to the §1 URL arithmetic.
 */
export const EXPECTED = {
  '<documentType>': 0,
};

/**
 * Rich-text fields, as `<collection>.<field>`.
 *
 * The verifier compares each of these character for character against the
 * source HTML. Listing them means adding a rich-text field cannot quietly
 * escape that comparison.
 */
export const RICH_TEXT_FIELDS = [
  '<collection>.<field>',
];
