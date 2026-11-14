/**
 * The ONE parser for project.jsonc, shared by every runtime that reads it.
 *
 * PURE CODE ON PURPOSE — no `node:fs`, no `__dirname`, no imports beyond the
 * parser itself. It takes TEXT and returns the config. That is what lets the
 * browser Studio bundle use it (via a Vite `?raw` import of project.jsonc)
 * while plain Node and the Sanity CLI feed it `readFileSync` output. Put a
 * filesystem call in here and the Studio build breaks with a polyfill error
 * that does not mention this file.
 *
 * WHY jsonc-parser AND NOT A REGEX
 *
 * A naive comment-stripping regex eats the `//` in every `https://` URL in the
 * file and truncates the rest of that line. The result still parses as valid
 * JSON — with a mangled origin — so there is no error, just a wrong value.
 * project.jsonc contains exactly such a URL in `webflow.source`.
 *
 * Trailing commas are allowed: a hand-edited config grows and shrinks, and a
 * trailing comma is not a typo worth failing a build over.
 */
import {parse} from 'jsonc-parser';

export default function parseProject(source) {
  const errors = [];
  const config = parse(source, errors, {allowTrailingComma: true});

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
