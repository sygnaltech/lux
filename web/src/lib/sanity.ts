/**
 * The site's Sanity read client.
 *
 * Read-only and unauthenticated by design: the site is fully prerendered, so
 * every query runs at build time against published content. No token reaches
 * this file, and none should — `SANITY_AUTH_TOKEN` exists only for
 * `npm run sanity:import` and lives in studio/.env.
 */
import {createClient} from '@sanity/client';

// The NAMED export. The default export is deprecated in @sanity/image-url 2.x.
import {createImageUrlBuilder, type SanityImageSource} from '@sanity/image-url';

import {SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_VERSION} from './project.mjs';

export const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,

  /**
   * The whole site prerenders, so a stale CDN read would bake stale content
   * into the build output and survive until the next deploy. Go direct.
   */
  useCdn: false,
  perspective: 'published',
});

const builder = createImageUrlBuilder(client);

/**
 * Image URL builder for Sanity assets.
 *
 * WHEN BINDING THESE INTO PORTED WEBFLOW MARKUP: strip `srcset` and `sizes`
 * from the `<img>` you are rebinding. Webflow generates a responsive set of
 * its own CDN derivatives, those URLs do not exist for a Sanity asset, and a
 * stale `srcset` beats the `src` sitting next to it — so the image silently
 * keeps loading from Webflow, which is the §5 dependency this migration
 * exists to end.
 */
export const urlFor = (source: SanityImageSource) => builder.image(source);
