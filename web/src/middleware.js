/**
 * Dev-only shim so `astro dev` serves the gate through the real Worker.
 *
 * From `webflow-sanity:secured-pages`. `astro dev` serves pages from its own
 * server and never runs the Worker, so without this every protected route 404s
 * in development and the gate can only be tested by deploying it. This routes
 * exactly the protected paths and the login endpoint through
 * `worker/index.mjs`, so what you test in dev is the code that ships.
 *
 * THE WORKER LIVES AT THE REPO ROOT, NOT IN web/. This repo is an orchestrator:
 * `web/` is the Astro app, and both Wrangler configs, the gate and the build
 * step sit above it. Hence `../../worker/index.mjs` rather than the pattern's
 * `../worker/index.mjs`, and `.dev.vars` is read from the repo root — which is
 * also where `wrangler dev` reads it from, so the two agree.
 *
 * `npm run preview` (wrangler dev) exercises the real thing against the built
 * web/dist and needs none of this. CHECK THE GATE THERE BEFORE DEPLOYING, not
 * only here: this shim stands in for the ASSETS binding and cannot prove
 * `run_worker_first` is wired up.
 */
import fs from 'node:fs';
import {parseEnv} from 'node:util';
import {defineMiddleware} from 'astro:middleware';

/**
 * Repo root, from web/src/middleware.js, as a URL.
 *
 * Derived from `import.meta.url`, NOT `import.meta.dirname`. This module is
 * transformed by Vite, which rewrites `import.meta.url` and makes no promise
 * about Node's `dirname`/`filename` additions — so the latter can arrive
 * `undefined`, and the path join then throws on the first request to a
 * protected route, in dev only. `fs` takes a URL directly, so nothing has to be
 * converted.
 */
const ROOT = new URL('../../', import.meta.url);

export const onRequest = defineMiddleware(async (context, next) => {
  if (!import.meta.env.DEV) return next();

  let gate;
  try {
    gate = await import('../../worker/index.mjs');
  } catch (error) {
    // The Worker statically imports the generated manifest. Missing it is the
    // normal state of a clean checkout, and the fix is a build, not a bug hunt.
    console.warn(`[private] Worker could not be loaded, so protected routes are not gated in dev: ${error.message}`);
    console.warn('[private] Run `npm run build` (or `node scripts/prepare-private.mjs`) to generate worker/private-pages.generated.json.');
    return next();
  }

  const {default: worker, LOGIN, isProtected} = gate;
  const route = context.url.pathname.replace(/\/$/, '') || '/';

  // Ask the WORKER's predicate, never a local prefix test — see the note on
  // `isProtected` in worker/index.mjs. A dev shim that matches a different set
  // of paths than the gate is a dev shim that tests the wrong thing.
  if (!isProtected(route) && route !== LOGIN) return next();

  const devVars = new URL('.dev.vars', ROOT);
  const local = fs.existsSync(devVars) ? parseEnv(fs.readFileSync(devVars, 'utf8')) : {};

  return worker.fetch(context.request, {
    PRIVATE_PAGE_PASSWORD: local.PRIVATE_PAGE_PASSWORD || process.env.PRIVATE_PAGE_PASSWORD,
    PRIVATE_SESSION_SECRET: local.PRIVATE_SESSION_SECRET || process.env.PRIVATE_SESSION_SECRET,
    // Stand-in for the ASSETS binding: /401 comes from the dev server itself,
    // and anything else falls through to Astro.
    ASSETS: {
      fetch: (request) => new URL(request.url).pathname === '/401'
        ? fetch(new URL('/401', context.url))
        : next(),
    },
  });
});
