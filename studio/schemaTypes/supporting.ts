import {defineField, defineType} from 'sanity';

/**
 * The six types with NO public item page.
 *
 * Nothing in the §1 URL inventory points at these — they are bound into lists,
 * dropdowns, calculators and modals on the static pages. They still have to
 * come across in full: the pages that render them are live, and a missing row
 * here is a blank region on a page that currently works.
 *
 * `loc` (Locations) is the seventh data-only Webflow collection and is NOT
 * here. Both its items are unpublished drafts, so Webflow renders its list
 * empty and none of its content — a second address, parking notes, a red
 * "important message" — is on the live site. See EXCLUDED.collections.
 */

const legacyField = defineField({
  name: 'legacy',
  title: 'Migration provenance',
  type: 'legacyRef',
});

const slugField = defineField({
  name: 'slug',
  title: 'Slug',
  type: 'slug',
  description: 'No public URL. Kept as the stable key the ported markup and scripts match on.',
  options: {source: 'title', maxLength: 96},
  validation: (Rule) => Rule.required(),
});

// ───────────────────────────────────────────────────────────── need (3) ──────

export const need = defineType({
  name: 'need',
  title: 'Need',
  type: 'document',
  description: 'A patient-facing tag that services are matched against.',
  fields: [
    defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
    slugField,
    legacyField,
  ],
  preview: {select: {title: 'title'}},
});

// ────────────────────────────────────────────────── maternityScan (7) ────────

export const maternityScan = defineType({
  name: 'maternityScan',
  title: 'Maternity scan',
  type: 'document',
  description: 'Drives the pregnancy scan calculator on /scan.',
  fields: [
    defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
    slugField,
    defineField({
      name: 'scanType',
      title: 'Scan type',
      type: 'string',
      description:
        'Webflow stored this as an Option field, whose values are opaque ids. Carried verbatim so the grouping the calculator relies on is preserved exactly; it can be given readable values once the calculator reads Sanity.',
    }),
    defineField({name: 'description', title: 'Description', type: 'portableText'}),
    defineField({
      name: 'earliestWeek',
      title: 'Earliest week',
      type: 'number',
      description: 'Fractional weeks are real here (one scan is 12.5–13.5). Empty where the scan has no lower bound.',
    }),
    defineField({name: 'latestWeek', title: 'Latest week', type: 'number'}),
    defineField({name: 'required', title: 'Required', type: 'boolean', initialValue: false}),
    defineField({
      name: 'anytime',
      title: 'Anytime',
      type: 'boolean',
      description: 'Scan is not restricted to a week range.',
      initialValue: false,
    }),
    legacyField,
  ],
  orderings: [
    {title: 'Earliest week', name: 'week', by: [{field: 'earliestWeek', direction: 'asc'}]},
  ],
  preview: {select: {title: 'title', subtitle: 'scanType'}},
});

// ───────────────────────────────────────────────────────── babyWeek (25) ─────

export const babyWeek = defineType({
  name: 'babyWeek',
  title: 'Maternity development',
  type: 'document',
  description: 'Week-by-week development copy, shown alongside the scan calculator.',
  fields: [
    defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
    slugField,
    defineField({name: 'weekStart', title: 'Week start', type: 'number', validation: (Rule) => Rule.required()}),
    defineField({name: 'weekEnd', title: 'Week end', type: 'number', validation: (Rule) => Rule.required()}),
    defineField({name: 'description', title: 'Description', type: 'portableText'}),
    defineField({name: 'bulletPoints', title: 'Bullet points', type: 'portableText'}),
    legacyField,
  ],
  orderings: [{title: 'Week', name: 'week', by: [{field: 'weekStart', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'weekStart'}},
});

// ───────────────────────────────────────────────────────────── modal (13) ────

export const modal = defineType({
  name: 'modal',
  title: 'Modal',
  type: 'document',
  description:
    'Site-wide promotional modals, shown between their start and end dates when enabled. 13 migrated, 3 enabled.',
  fields: [
    defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
    slugField,
    defineField({name: 'enabled', title: 'Enabled', type: 'boolean', initialValue: false}),
    defineField({name: 'startDate', title: 'Start date', type: 'datetime', validation: (Rule) => Rule.required()}),
    defineField({name: 'endDate', title: 'End date', type: 'datetime', validation: (Rule) => Rule.required()}),
    defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'content', title: 'Content', type: 'portableText'}),
    defineField({name: 'buttonText', title: 'Button 1 text', type: 'string'}),
    defineField({name: 'buttonUrl', title: 'Button 1 link', type: 'url'}),
    defineField({name: 'buttonText2', title: 'Button 2 text', type: 'string'}),
    defineField({name: 'buttonUrl2', title: 'Button 2 link', type: 'url'}),
    legacyField,
  ],
  orderings: [{title: 'Start date, newest', name: 'start', by: [{field: 'startDate', direction: 'desc'}]}],
  preview: {select: {title: 'title', subtitle: 'startDate', media: 'image'}},
});

// ─────────────────────────────────────────────────────── serviceItem (53) ────

export const serviceItem = defineType({
  name: 'serviceItem',
  title: 'Service item',
  type: 'document',
  description:
    'A bookable item under a service — the booking links, duration and price. This is what the booking pages are built from.',
  fields: [
    defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
    slugField,
    defineField({
      name: 'service',
      title: 'Service',
      type: 'reference',
      to: [{type: 'service'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'order', title: 'Order', type: 'number'}),
    defineField({
      name: 'sbmServiceId',
      title: 'SimplyBook service id',
      type: 'string',
      description: 'Populated on every item; consumed by the booking widget.',
    }),
    defineField({
      name: 'bookingType',
      title: 'Booking type',
      type: 'string',
      description: 'Webflow Option field; opaque ids carried verbatim. Set on 12 of 53 items.',
    }),
    defineField({name: 'weekdayBookingUrl', title: 'Weekday booking link', type: 'url'}),
    defineField({name: 'weekendBookingUrl', title: 'Weekend booking link', type: 'url'}),
    defineField({name: 'poacWeekendBookingUrl', title: 'POAC weekend booking link', type: 'url'}),
    defineField({name: 'phoneBookingOnly', title: 'Phone booking only', type: 'boolean', initialValue: false}),
    defineField({name: 'duration', title: 'Duration', type: 'string'}),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      description: 'Set on 17 of 53 items. Webflow also had a Price Note field, empty on every item, not migrated.',
    }),
    legacyField,
  ],
  orderings: [{title: 'Site order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'duration'}},
});

// ──────────────────────────────────────────────────────────── poac (14) ──────

export const poac = defineType({
  name: 'poac',
  title: 'POAC item',
  type: 'document',
  description: 'Primary Options Acute Care — the subset of service items available under POAC funding.',
  fields: [
    defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
    slugField,
    defineField({
      name: 'serviceItem',
      title: 'Service item',
      type: 'reference',
      to: [{type: 'serviceItem'}],
    }),
    defineField({name: 'order', title: 'Order', type: 'number'}),
    legacyField,
  ],
  orderings: [{title: 'Site order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title'}},
});
