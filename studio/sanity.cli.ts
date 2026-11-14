import {defineCliConfig} from 'sanity/cli';

/**
 * project.jsonc, read by the SANITY CLI.
 *
 * The CLI transpiles this file to CommonJS and `require`s its imports, so the
 * reader has to be CJS. An ESM import here fails with "require is not
 * defined", and then — much less helpfully — with "sanity.cli.ts does not
 * contain a project identifier", which sends you hunting in the wrong file.
 *
 * `createRequire` rather than a bare `require` so this stays valid TypeScript
 * under an ESM-typed package while still loading the CJS reader.
 */
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const {readProject} = require('../config/read-project.cjs');

const project = readProject();

export default defineCliConfig({
  api: {
    projectId: project.sanity.projectId,
    dataset: project.sanity.dataset,
  },

  /**
   * The *.sanity.studio hostname. Globally unique across all of Sanity, so a
   * deploy can fail here on a name collision rather than on anything wrong
   * with this repo — change `sanity.studioHost` in project.jsonc if so.
   */
  studioHost: project.sanity.studioHost,

  /**
   * Pin the Studio to the version in this repo's lockfile rather than letting
   * Sanity auto-upgrade the deployed bundle. The content model is the client's
   * editing surface; it should change when we deploy it and not otherwise.
   *
   * (`autoUpdates` at the top level is the older spelling — the CLI now warns
   * and wants it nested under `deployment`.)
   */
  deployment: {autoUpdates: false},
});
