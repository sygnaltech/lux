import {defineConfig} from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

/**
 * project.jsonc is read HERE, in Node, while Vite is being configured — and
 * the values are then INLINED into the bundle by `define` below.
 *
 * This is not a stylistic choice. Under @astrojs/cloudflare, prerendering runs
 * inside a workerd sandbox whose cwd is `/bundle` and which has no repository
 * filesystem. An fs read from page or component code fails at prerender with
 * an ENOENT naming a path that never existed. astro.config.mjs is the last
 * place in the pipeline where Node's fs is still available, so the config
 * crosses into the bundle as literals from here.
 */
import {
  WEBFLOW_SOURCE,
  SANITY_PROJECT_ID,
  SANITY_DATASET,
  SANITY_API_VERSION,
} from '../config/read-project.mjs';

export default defineConfig({
  /**
   * The ported site is entirely prerendered. Nothing renders on demand, which
   * is what lets wrangler.prod.jsonc set `not_found_handling: "404-page"` —
   * see §8. If a route ever needs `prerender = false`, that setting must come
   * back OUT of the Wrangler config in the same change: the asset layer
   * answers "404-page" before the Worker runs, and would intercept exactly
   * the routes the Worker exists to render.
   */
  output: 'static',

  adapter: cloudflare({
    /**
     * PRERENDER IN NODE, NOT WORKERD. The adapter defaults to `'workerd'`,
     * which runs prerendering inside a sandbox with cwd `/bundle` and NO
     * repository filesystem.
     *
     * This matters far beyond this file. The whole migration engine is written
     * for Node prerender semantics — `extract` writes the ported pages to
     * web/src/html/ and web/src/data/pages.json and the §3 routes render from
     * them, `verify-port` and `check-assets` read dist from disk. Under workerd
     * every one of those reads fails at build with an ENOENT naming a path
     * that never existed, which reads like a path bug and is a sandbox
     * boundary. Leaving the default in place would ambush §3 and §6.
     *
     * The config values below are ALSO inlined via `define`, so they work
     * under either runtime. That is deliberate belt-and-braces, not
     * redundancy: it means a future change back to workerd breaks loudly in
     * §3 rather than silently here.
     */
    prerenderEnvironment: 'node',

    /**
     * No Astro image service. The ported pages carry Webflow's own `<img>`
     * markup verbatim and CMS images come from Sanity's CDN with its own
     * transforms — nothing asks Astro to process an image. The default
     * (`cloudflare-binding`) otherwise provisions an `IMAGES` binding this
     * site never calls, which then has to exist for a deploy to validate.
     */
    imageService: 'passthrough',
  }),

  /**
   * Canonical URL for the sitemap and SEO, from project.jsonc. It is the LIVE
   * host, deliberately: ported URLs are byte-identical across the cut-over, so
   * the canonical host does not change when hosting does.
   *
   * This is NOT the staging route, and setting it activates nothing.
   */
  site: WEBFLOW_SOURCE,

  /**
   * `file` keeps URLs extensionless and directory-free — /about, not /about/ —
   * matching how Webflow serves them. Changing this silently changes every URL
   * on the site and breaks the §7 sitemap diff against live.
   */
  build: {
    /**
     * `file` keeps URLs extensionless and directory-free — /about, not /about/ —
     * matching how Webflow serves them. Changing this silently changes every URL
     * on the site and breaks the §7 sitemap diff against live.
     */
    format: 'file',

    /**
     * FLATTEN THE OUTPUT TO dist/, NOT dist/client/.
     *
     * With an adapter present Astro defaults `build.client` to './client/',
     * so pages land in web/dist/client/about.html. The whole migration engine
     * assumes a flat web/dist — `verify-port`, `check-assets` and
     * `check-sitemap` all compute `join(WEB, 'dist')` and look for
     * `<page>.html` directly inside it. Three engine files would need forking
     * to teach them otherwise, against one line here.
     *
     * Both paths are relative to `outDir`. The server directory is renamed
     * too, so it cannot collide with a real page route: `output: 'static'`
     * with no on-demand route leaves it empty, but it must still be ignored
     * by the asset layer — see web/public/.assetsignore.
     */
    client: './',
    server: './_server/',
  },

  vite: {
    /**
     * Read .env from the REPOSITORY ROOT, not web/.
     *
     * One env location for the site build, and it is what makes
     * `guard-production-deploy.mjs` correct with no `--env-dir` flag: the
     * guard scans the root .env files and so does Vite. The skill is explicit
     * that guard scanning and Vite envDir must stay aligned — move this back
     * to web/ and the guard needs `--env-dir web` in the SAME change, or it
     * passes while the build reads a non-production dataset.
     */
    envDir: '..',

    /**
     * The config, inlined. `JSON.stringify` on each value because `define`
     * performs raw text substitution — an unquoted string would be emitted as
     * a bare identifier and fail to parse.
     */
    define: {
      __PROJECT_WEBFLOW_SOURCE__: JSON.stringify(WEBFLOW_SOURCE),
      __PROJECT_SANITY_PROJECT_ID__: JSON.stringify(SANITY_PROJECT_ID),
      __PROJECT_SANITY_DATASET__: JSON.stringify(SANITY_DATASET),
      __PROJECT_SANITY_API_VERSION__: JSON.stringify(SANITY_API_VERSION),
    },
  },
});
