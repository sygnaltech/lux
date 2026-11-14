/**
 * Every local asset path, named in ONE place.
 *
 * WHY THIS MODULE EXISTS AT ALL
 *
 * §5 of the migration process ends the Webflow hosting dependency. The step
 * that is always missed is not the images in the ported HTML — the localiser
 * rewrites `src/html` automatically. It is URLs that were transcribed BY HAND
 * into `.astro` component source while building CMS templates, which the
 * localiser never sees. On the first site that was 105 arrow icons in the card
 * components, still served by the account being cancelled, on a port where
 * every other check was green.
 *
 * So: no `.astro` file anywhere in this project may contain an asset URL.
 * They are named here, and `npm run assets:check` has somewhere to point at.
 *
 * THE OTHER HIDING PLACE IS THE CSS, AND NO HTML SCAN WILL EVER FIND IT.
 * `@font-face` WOFF2 files and background SVGs are referenced only from inside
 * the ported stylesheet. They render perfectly until the Webflow account
 * lapses, and then the site loses its typeface. Find them by grepping the
 * ported CSS for `url(`, which is the only thing that works.
 *
 * ── Populated during §5. Empty is correct until then. ──────────────────────
 */

/**
 * Local directory the localiser writes fetched Webflow assets into. Asserted
 * to resolve on disk by `npm run assets:check`.
 */
export const WF = '/wf/assets';

/**
 * Named assets referenced from component source rather than ported HTML.
 * Add an entry here instead of pasting a URL into an `.astro` file.
 */
export const assets = {
  // Populated in §5, e.g.:
  //   cardArrow: `${WF}/<the localised filename>`,
} as const satisfies Record<string, string>;

export type AssetName = keyof typeof assets;
