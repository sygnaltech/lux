/**
 * project.jsonc values, as seen by the site's pages and components.
 *
 * NO FILESYSTEM ACCESS HERE, AND THERE CANNOT BE.
 *
 * Under @astrojs/cloudflare, prerendering runs inside a workerd sandbox whose
 * cwd is `/bundle` and which has no repository filesystem at all. An earlier
 * version of this file walked up from `import.meta.url` looking for
 * project.jsonc and failed every build with:
 *
 *     Could not locate project.jsonc by walking up from this module or the
 *     working directory (/bundle).
 *
 * which reads like a path bug and is actually a sandbox boundary. No amount of
 * path cleverness fixes it.
 *
 * So the values are injected as literals by Vite's `define`, configured in
 * web/astro.config.mjs — the last point in the pipeline where Node's fs is
 * still available. This module just gives them names and types.
 *
 * ADDING A VALUE: add it to `define` in astro.config.mjs AND re-export it
 * here. A name that is only declared here substitutes to nothing and fails at
 * build as an undefined identifier.
 */

/* global __PROJECT_WEBFLOW_SOURCE__, __PROJECT_SANITY_PROJECT_ID__,
          __PROJECT_SANITY_DATASET__, __PROJECT_SANITY_API_VERSION__ */

/**
 * The live Webflow host, trailing slash already stripped. Also the site's
 * canonical host after cut-over — the ported URLs are byte-identical across
 * the switch.
 */
export const WEBFLOW_SOURCE = __PROJECT_WEBFLOW_SOURCE__;

export const SANITY_PROJECT_ID = __PROJECT_SANITY_PROJECT_ID__;

/**
 * Already resolved against `process.env.SANITY_DATASET` with `||` (not `??`)
 * in config/read-project.mjs, because an unfilled env key loads as an empty
 * string and `??` would pass it straight through.
 */
export const SANITY_DATASET = __PROJECT_SANITY_DATASET__;

/** Leading `v` already stripped; the Sanity client adds its own. */
export const SANITY_API_VERSION = __PROJECT_SANITY_API_VERSION__;
