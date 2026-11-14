/**
 * CommonJS reader for project.jsonc — for the Sanity CLI only.
 *
 * WHY THIS FILE EXISTS
 *
 * The Sanity CLI transpiles `sanity.cli.ts` to CommonJS and `require`s its
 * imports. An ESM-only module therefore fails with "require is not defined",
 * and then — far more confusingly — with "sanity.cli.ts does not contain a
 * project identifier", which sends you looking in the wrong file entirely.
 *
 * So the CLI gets a CJS entry point. It locates project.jsonc from
 * `__dirname` (NOT from cwd — the CLI may be invoked from studio/) and hands
 * the text to the same single parser everything else uses.
 *
 * jsonc-parser is required directly rather than bridging to parse-project.mjs:
 * a `require()` of an ESM module is only available on newer Node and the
 * failure mode is opaque. Duplicating four lines of validation is cheaper than
 * a CJS/ESM bridge that breaks on a Node upgrade.
 */
const {readFileSync} = require('node:fs');
const {join} = require('node:path');
const {parse} = require('jsonc-parser');

const FILE = join(__dirname, '..', 'project.jsonc');

function readProject() {
  const errors = [];
  const config = parse(readFileSync(FILE, 'utf8'), errors, {allowTrailingComma: true});

  if (errors.length) {
    throw new Error(
      `project.jsonc is not valid JSONC — parse errors at offset(s) ` +
        errors.map((e) => e.offset).join(', '),
    );
  }
  if (!config?.sanity?.projectId || !config?.sanity?.dataset) {
    throw new Error(
      'Invalid project.jsonc sanity configuration: both sanity.projectId and ' +
        'sanity.dataset are required.',
    );
  }
  return config;
}

module.exports = {readProject, PROJECT_FILE: FILE};
