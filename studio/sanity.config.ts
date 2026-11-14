import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';
import {visionTool} from '@sanity/vision';

/**
 * project.jsonc, read in the BROWSER.
 *
 * A Vite `?raw` import plus the shared pure parser. This is the only way the
 * Studio bundle can read the file: `config/read-project.cjs` touches
 * `node:fs`, and importing it here fails the build with a polyfill error that
 * never mentions this line. parse-project.mjs is pure for exactly this reason.
 */
import projectSource from '../project.jsonc?raw';
import parseProject from '../config/parse-project.mjs';

import {schemaTypes} from './schemaTypes';

const project = parseProject(projectSource);

/**
 * `||` and NOT `??`. An unfilled key in an env file loads as an EMPTY STRING,
 * which `??` passes straight through — and an empty dataset fails deep inside
 * Sanity with "`dataset` must be provided" rather than here.
 */
const dataset = process.env.SANITY_STUDIO_DATASET || project.sanity.dataset;

export default defineConfig({
  name: 'default',
  title: 'Lux Radiology',

  projectId: project.sanity.projectId,
  dataset,

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
});
