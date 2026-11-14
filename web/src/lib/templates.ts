/**
 * Which Webflow item each collection template was extracted from.
 *
 * MUST MATCH `TEMPLATES` in migration-scripts/pages.config.mjs. The templates
 * are frozen HTML with that item's values baked in, and src/lib/bind.ts finds
 * the bind points by searching for those values — so if a template is
 * re-extracted from a different item and this is not updated in the same
 * change, every binding throws at build with the value it could not find.
 *
 * Throwing is the correct outcome. The alternative is publishing the sample
 * item's content on every page in the collection, which renders perfectly and
 * is invisible to the structural verifier.
 *
 * Not imported from pages.config.mjs because that file lives outside web/ and
 * is part of the one-shot migration tooling rather than the site's build.
 */
export const TEMPLATE_SAMPLE = {
  review: 'waimaria-hauraki-ngapo',
  service: 'pregnancy-scan',
  team: 'alan',
  post: 'ponsonbys-new-radiology-service',
  category: 'ultrasound',
} as const;
