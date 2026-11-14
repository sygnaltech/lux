import {defineField, defineType} from 'sanity';

/**
 * The five types with PUBLIC ITEM PAGES. Their slugs are live URLs and must not
 * change: the migration's acceptance test is URL parity with the Webflow
 * sitemap.
 *
 * Every field here exists because a published Webflow item populates it and the
 * site renders it. The fields that were populated and NOT carried are listed,
 * with counts and reasons, in migration-scripts/webflow/collections.mjs —
 * `DEAD_FIELDS`. Read that before adding a field back.
 */

/** Shared slug field. `source: 'title'` only helps NEW documents; migrated ones carry Webflow's slug. */
const slugField = (description: string) =>
  defineField({
    name: 'slug',
    title: 'Slug',
    type: 'slug',
    description,
    options: {source: 'title', maxLength: 96},
    validation: (Rule) => Rule.required(),
  });

const legacyField = defineField({
  name: 'legacy',
  title: 'Migration provenance',
  type: 'legacyRef',
});

// ───────────────────────────────────────────────────────────── post (3) ──────

export const post = defineType({
  name: 'post',
  title: 'Blog post',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
    slugField('Published at /post/<slug>. Changing this breaks a live URL.'),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      description: 'The editorial date the site displays — not a Webflow system timestamp.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'summary', title: 'Summary', type: 'text', rows: 3}),
    defineField({name: 'mainImage', title: 'Main image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'body', title: 'Body', type: 'portableText'}),
    legacyField,
  ],
  orderings: [
    {title: 'Newest first', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]},
  ],
  preview: {select: {title: 'title', subtitle: 'date', media: 'mainImage'}},
});

// ────────────────────────────────────────────────────────── service (7) ──────

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
    slugField('Published at /services/<slug>. Changing this breaks a live URL.'),
    defineField({
      name: 'shortName',
      title: 'Short name',
      type: 'string',
      description: 'Used in nav and card listings where the full title is too long.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'order', title: 'Order', type: 'number', description: 'Ascending. From Webflow’s Seq field.'}),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'category'}],
    }),
    defineField({
      name: 'needs',
      title: 'Needs',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'need'}]}],
      description: 'Tags used to match a service to what a patient is looking for.',
    }),
    defineField({name: 'shortDescription', title: 'Short description', type: 'text', rows: 2}),
    defineField({name: 'description', title: 'Description', type: 'portableText'}),
    defineField({
      name: 'notice',
      title: 'Notice',
      type: 'portableText',
      description: 'Optional service-specific notice. Populated on one service at migration.',
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'image',
      description:
        'The icon the site renders. Webflow also had an older “Icon 2” field, populated on every service and rendered nowhere — deliberately not migrated.',
    }),
    defineField({name: 'pageImage', title: 'Service page image', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'currentlyUnavailable',
      title: 'Currently unavailable',
      type: 'boolean',
      description: 'Shows the service as not bookable. True for one service at migration.',
      initialValue: false,
    }),
    legacyField,
  ],
  orderings: [{title: 'Site order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'shortName', media: 'icon'}},
});

// ───────────────────────────────────────────────────────────── team (3) ──────

export const team = defineType({
  name: 'team',
  title: 'Team member',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
    slugField('Published at /team/<slug>. Changing this breaks a live URL.'),
    defineField({name: 'jobTitle', title: 'Job title', type: 'string'}),
    defineField({
      name: 'order',
      title: 'Order',
      type: 'number',
      description:
        'Ascending. Webflow had NO usable order field here (Seq was empty on every member) and its manual sort is not exposed by the API — this was captured from the rendered /about page at migration. From now on it is the only source of ordering.',
    }),
    defineField({name: 'profilePicture', title: 'Profile picture', type: 'image', options: {hotspot: true}}),
    defineField({name: 'profileSquare', title: 'Profile picture (square)', type: 'image', options: {hotspot: true}}),
    defineField({name: 'bio', title: 'Bio', type: 'portableText'}),
    defineField({
      name: 'linkedinUrl',
      title: 'LinkedIn',
      type: 'url',
      description:
        'Webflow also had Twitter, Facebook and Google Plus link fields. All three were empty on every member and were not migrated.',
    }),
    legacyField,
  ],
  orderings: [{title: 'Site order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'title', subtitle: 'jobTitle', media: 'profileSquare'}},
});

// ───────────────────────────────────────────────────────── category (2) ──────

export const category = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({name: 'title', type: 'string', validation: (Rule) => Rule.required()}),
    slugField('Published at /category/<slug>. Changing this breaks a live URL.'),
    defineField({name: 'shortDescription', title: 'Short description', type: 'text', rows: 2}),
    defineField({name: 'brief', title: 'Brief', type: 'portableText'}),
    defineField({name: 'notes', title: 'Text', type: 'portableText'}),
    defineField({name: 'bookingNote', title: 'Booking note', type: 'portableText'}),
    defineField({
      name: 'bookingButtonText',
      title: 'Booking button text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'icon', title: 'Icon', type: 'image'}),
    legacyField,
  ],
  preview: {select: {title: 'title', subtitle: 'shortDescription', media: 'icon'}},
});

// ─────────────────────────────────────────────────────────── review (169) ────

export const review = defineType({
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
    slugField('Published at /reviews/<slug>. Changing this breaks a live URL.'),
    defineField({name: 'from', title: 'From', type: 'string', description: 'Reviewer name as published.'}),
    defineField({name: 'where', title: 'Where', type: 'string', description: 'Source of the review.'}),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      description:
        'THE LISTING PAGE SHOWS ONLY RATINGS OF 4 AND ABOVE. Lower-rated reviews keep their own page (and their live URL) but are not listed. That behaviour was read off the live site, not invented.',
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({name: 'brief', title: 'Brief', type: 'text', rows: 3, validation: (Rule) => Rule.required()}),
    defineField({name: 'text', title: 'Text', type: 'portableText'}),
    defineField({name: 'link', title: 'Reviewer avatar / source link', type: 'url'}),
    defineField({name: 'date', title: 'Date', type: 'datetime', validation: (Rule) => Rule.required()}),
    legacyField,
  ],
  orderings: [
    {title: 'Newest first', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]},
    {title: 'Rating, low first', name: 'ratingAsc', by: [{field: 'rating', direction: 'asc'}]},
  ],
  preview: {select: {title: 'title', subtitle: 'brief'}},
});
