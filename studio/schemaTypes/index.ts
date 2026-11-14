import type {SchemaTypeDefinition} from 'sanity';

/**
 * The content model. DELIBERATELY EMPTY until §4.
 *
 * It is authored AFTER reading the Webflow CMS directly — not from the
 * rendered pages, and never carried over from another site. The skill is
 * blunt about why: on the first migration, reading the collections found a
 * purchased template's demo data still live in every collection, two
 * rich-text fields where only the second renders (the first still carrying a
 * pre-rebrand company name), boilerplate describing an entirely different
 * subject, a collection whose order existed only in its parent's reference
 * array, a switch wired to nothing, and three dates for one item of which two
 * were Webflow system timestamps. A field-by-field importer would have
 * published all of it.
 *
 * For Lux specifically, §1 already shows where that work will land: 169
 * `/reviews/*` items, including several obvious duplicates and at least one
 * junk submission. Deciding what does NOT come across is the substance of §4,
 * and it gets written down in migration-scripts/webflow/collections.mjs and
 * migration-scripts/sanity/convert.mjs — with a `--report` that says what was
 * dropped — not improvised here.
 *
 * Known collections to model, from the live URL inventory:
 *   /services/*    7 items
 *   /reviews/*   169 items   <- audit hard before carrying
 *   /team/*        3 items
 *   /post/*        3 items
 *   /category/*    2 items
 */
export const schemaTypes: SchemaTypeDefinition[] = [];
