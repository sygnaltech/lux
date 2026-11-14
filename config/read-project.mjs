/**
 * project.jsonc, read from the filesystem by Node. ESM.
 *
 * FOR BUILD-TIME AND SCRIPT USE ONLY — never import this into anything that
 * ends up in a bundle. Its consumers are `web/astro.config.mjs` (which runs in
 * Node while Vite is being configured) and any plain-Node tooling that wants
 * the config without going through migration-scripts.
 *
 * WHY THE SITE CANNOT JUST IMPORT THIS
 *
 * Under @astrojs/cloudflare, prerendering happens inside a workerd sandbox
 * whose working directory is `/bundle`. There is no repository filesystem
 * there — not a relocated one, none at all — so ANY fs-based read fails at
 * prerender with an ENOENT that points at a path which never existed. The
 * values have to be inlined into the bundle by Vite instead; see the
 * `define` block in web/astro.config.mjs.
 *
 * The three readers and their one job each:
 *   config/parse-project.mjs   pure text -> config   (browser Studio, shared)
 *   config/read-project.cjs    fs, CommonJS          (Sanity CLI only)
 *   config/read-project.mjs    fs, ESM               (this file: build config)
 */
import {readFileSync, existsSync} from 'node:fs';
import {dirname, join, resolve, parse as parsePath} from 'node:path';
import {fileURLToPath} from 'node:url';

import parseProject from './parse-project.mjs';

const FILENAME = 'project.jsonc';

/** Walk up from this module to the repository root. Safe: never bundled. */
function findProjectFile() {
  let dir = resolve(dirname(fileURLToPath(import.meta.url)));
  const {root} = parsePath(dir);
  while (true) {
    const candidate = join(dir, FILENAME);
    if (existsSync(candidate)) return candidate;
    if (dir === root) {
      throw new Error(
        `Could not locate ${FILENAME} above ${dirname(fileURLToPath(import.meta.url))}. ` +
          'It belongs at the repository root.',
      );
    }
    dir = dirname(dir);
  }
}

export const PROJECT_FILE = findProjectFile();

const project = parseProject(readFileSync(PROJECT_FILE, 'utf8'));

/** Live Webflow host, trailing slash stripped. Also the post-cut-over canonical. */
export const WEBFLOW_SOURCE = String(project.webflow.source).replace(/\/+$/, '');

export const SANITY_PROJECT_ID = project.sanity.projectId;

/**
 * `||` and NOT `??`. An unfilled key in an env file loads as an EMPTY STRING,
 * which `??` passes through untouched — and an empty dataset fails deep inside
 * the Sanity client with "`dataset` must be provided" rather than here.
 */
export const SANITY_DATASET = process.env.SANITY_DATASET || project.sanity.dataset;

/** Leading `v` tolerated and stripped; the client adds its own. */
export const SANITY_API_VERSION = String(project.sanity.apiVersion || 'X').replace(/^v/, '');

export default project;
