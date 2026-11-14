import {defineField, defineType} from 'sanity';

/**
 * Provenance from the Webflow migration.
 *
 * Carried on every migrated document so a value can always be traced back to
 * the row it came from, and so a re-import can be reconciled against
 * migration/raw/ without a lookup table. Read-only in the Studio: an editor
 * changing it would break that trace.
 *
 * It is NOT the document id. Ids are derived separately and deterministically
 * (`<type>-<webflowId>`) so a re-import updates rather than duplicates.
 */
export const legacyRef = defineType({
  name: 'legacyRef',
  title: 'Migration provenance',
  type: 'object',
  readOnly: true,
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({name: 'webflowId', title: 'Webflow item id', type: 'string'}),
    defineField({name: 'webflowSlug', title: 'Webflow slug', type: 'string'}),
    defineField({name: 'createdOn', title: 'Created in Webflow', type: 'datetime'}),
    defineField({
      name: 'wasDraft',
      title: 'Was an unpublished draft in Webflow',
      type: 'boolean',
      description:
        'True for an item Webflow reported as a draft but was still serving because it had been published before. Kept because it explains why the item exists at all.',
    }),
  ],
});

/**
 * Portable Text, as converted from Webflow rich text.
 *
 * Deliberately NARROW. Webflow's rich text produces headings, paragraphs,
 * lists, links, bold and italic, and nothing else on this site — so offering
 * an editor more than that invites content the ported stylesheet has no rules
 * for. Widen it when a real need appears, not pre-emptively.
 */
export const portableText = defineType({
  name: 'portableText',
  title: 'Rich text',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
        {title: 'H4', value: 'h4'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [
        {title: 'Bulleted', value: 'bullet'},
        {title: 'Numbered', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Bold', value: 'strong'},
          {title: 'Italic', value: 'em'},
          {title: 'Underline', value: 'underline'},
        ],
        annotations: [
          {
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                validation: (Rule) =>
                  Rule.uri({scheme: ['http', 'https', 'mailto', 'tel'], allowRelative: true}),
              }),
            ],
          },
        ],
      },
    },
  ],
});
