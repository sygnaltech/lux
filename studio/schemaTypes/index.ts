import type {SchemaTypeDefinition} from 'sanity';

import {legacyRef, portableText} from './objects';
import {post, service, team, category, review} from './documents';
import {need, maternityScan, babyWeek, modal, serviceItem, poac} from './supporting';

/**
 * The content model, authored in §4 from the LIVE Webflow CMS — not from the
 * rendered pages, and not carried over from another site.
 *
 * Eleven document types from twelve Webflow collections. The twelfth (`loc`)
 * publishes nothing and is excluded wholesale; see
 * migration-scripts/webflow/collections.mjs for that decision and for every
 * populated-but-unpublished field, with counts.
 *
 *   PUBLIC ITEM PAGES — slugs are live URLs, do not change them
 *     review          169    /reviews/<slug>
 *     service           7    /services/<slug>
 *     post              3    /post/<slug>
 *     team              3    /team/<slug>
 *     category          2    /category/<slug>
 *                     ---
 *                     184    + 18 static pages = 202, the live sitemap count
 *
 *   DATA ONLY — no URL, bound into lists on static pages
 *     serviceItem      53
 *     babyWeek         25
 *     poac             14
 *     modal            13
 *     maternityScan     7
 *     need              3
 *
 *   Total: 299 documents.
 */
export const schemaTypes: SchemaTypeDefinition[] = [
  // Objects first — documents reference them by name.
  legacyRef,
  portableText,

  // Public item pages.
  review,
  service,
  post,
  team,
  category,

  // Data only.
  serviceItem,
  babyWeek,
  poac,
  modal,
  maternityScan,
  need,
];
