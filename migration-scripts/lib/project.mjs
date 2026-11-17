/**
 * The per-site configuration file, read by everything.
 *
 * The VALUES live in `project.jsonc` at the repo root. This module is the ESM
 * accessor for the migration scripts; the Studio and the site read the same
 * file.
 *
 * KEEP THIS FILE SMALL. It holds the handful of values the ENGINE cannot work
 * without — where to port from, which Sanity project, which Cloudflare worker.
 * Anything that is content rather than configuration (an address, a phone
 * number, SEO copy) belongs in the Sanity dataset, not here.
 *
 * WHY JSONC AND NOT A .mjs MODULE
 *
 * It was a `.mjs` first, with these comments in it, and the Sanity CLI could
 * not read it: the CLI transpiles `sanity.cli.ts` to CommonJS and `require`s
 * its imports, so an ESM-only module fails with "require is not defined" and
 * then — more confusingly — "sanity.cli.ts does not contain a project
 * identifier". Keep the values in JSONC, with runtime-appropriate readers for the CLI,
 * browser Studio and plain Node. See references/scaffold.md.
 *
 * JSONC rather than strict JSON so the file can explain itself. `readProject()` uses jsonc-parser and checks parse errors; app and CLI
 * readers must also explicitly parse JSONC.
 *
 *   project.jsonc                      the values
 *   migration-scripts/lib/project.mjs  this accessor, for plain-node scripts
 *   studio/sanity.config.ts            the Studio
 *   studio/sanity.cli.ts               the CLI (dataset import/export, deploy)
 *   src/lib/sanity.ts                  the site's read client
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {parse} from 'jsonc-parser';

import { ROOT } from './env.mjs';

/**
 * Strip `//` and block comments from JSONC without touching string contents.
 *
 * A naive regex eats the `//` in every `https://` URL in the file and turns
 * the rest of that line into nothing, which parses as valid JSON with a
 * truncated origin. So this walks the text and tracks whether it is inside a
 * string, which is the only way to get it right.
 */
export function stripJsonComments(text) {
  let out = '';
  let inString = false;
  let inLine = false;
  let inBlock = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];

    if (inLine) {
      if (ch === '\n') {
        inLine = false;
        out += ch;
      }
      continue;
    }
    if (inBlock) {
      if (ch === '*' && next === '/') {
        inBlock = false;
        i += 1;
      }
      continue;
    }
    if (inString) {
      out += ch;
      if (ch === '\\') {
        out += next ?? '';
        i += 1;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }
    if (ch === '"') {
      inString = true;
      out += ch;
      continue;
    }
    if (ch === '/' && next === '/') {
      inLine = true;
      i += 1;
      continue;
    }
    if (ch === '/' && next === '*') {
      inBlock = true;
      i += 1;
      continue;
    }
    out += ch;
  }

  // Trailing commas are legal in JSONC and not in JSON. Allowed here because a
  // hand-edited config grows and shrinks, and a trailing comma is not a typo
  // worth failing a build over.
  return out.replace(/,(\s*[}\]])/g, '$1');
}

function fail(message) {
  console.error(`\n${message}\n`);
  process.exit(1);
}

export function readProject() {
  const file = join(ROOT, 'project.jsonc');
  let text;
  try {
    text = readFileSync(file, 'utf8');
  } catch {
    fail(
      'project.jsonc is missing from the repo root.\n' +
        "  Copy it from the migration skill's templates/ and fill it in before running anything.",
    );
  }
  try {
    const errors = [];
    const config = parse(text, errors, {allowTrailingComma: true});
    if (errors.length) throw new Error('parse errors at offsets ' + errors.map(e => e.offset).join(', '));
    return config;
  } catch (e) {
    fail(`project.jsonc is not valid JSONC: ${e.message}`);
  }
}

const project = readProject();

/**
 * Read a required value by dotted path, refusing the template placeholders.
 *
 * The placeholders are the real hazard. `SITENAME` left in `cloudflare.routes`
 * deploys a working site to the wrong hostname; `PROJECTID` left in `sanity`
 * fails at build time with Sanity's own unhelpful message rather than naming
 * the field. Both are cheap to catch here and expensive to catch later.
 */
const PLACEHOLDERS = new Set([
  'SITENAME',
  'PROJECTID',
  'https://www.host.extension',
]);

export function required(path) {
  const value = path.split('.').reduce((node, key) => (node == null ? node : node[key]), project);
  if (value === undefined || value === null || value === '') {
    fail(`project.jsonc is missing \`${path}\`.`);
  }
  for (const entry of Array.isArray(value) ? value : [value]) {
    if (typeof entry === 'string' && PLACEHOLDERS.has(entry)) {
      fail(
        `project.jsonc still has the template placeholder "${entry}" in \`${path}\`.\n` +
          '  Fill it in for this site.',
      );
    }
  }
  return value;
}

/** Optional value, no placeholder check, no exit. */
export const optional = (path, fallback = null) =>
  path.split('.').reduce((node, key) => (node == null ? node : node[key]), project) ?? fallback;

// ── The live Webflow site being ported ──────────────────────────────────────

export const WEBFLOW_SOURCE = String(required('webflow.source')).replace(/\/+$/, '');

/**
 * Every host that counts as INTERNAL when rewriting links out of Webflow rich
 * text, DERIVED from webflow.source rather than configured.
 *
 * Both forms are needed and neither implies the other: Webflow writes internal
 * links as `http://apex-no-www/...` even when the site is served from www. So
 * take the configured host, strip any `www.`, and keep both.
 */
const SOURCE_HOST = new URL(WEBFLOW_SOURCE).hostname.toLowerCase();
const APEX = SOURCE_HOST.replace(/^www\./, '');
export const WEBFLOW_DOMAINS = [APEX, `www.${APEX}`];

/**
 * Webflow's `*.webflow.io` staging host, for the ONE job `WEBFLOW_SOURCE`
 * cannot do: reading a PASSWORD-PROTECTED page.
 *
 * Optional, and absent is a normal state — a site with no protected pages
 * never needs it. `extract-private-page.mjs` is the only reader and it fails by
 * name if it is missing.
 *
 * Deliberately NOT folded into WEBFLOW_DOMAINS. That list decides which links
 * count as internal when rewriting rich text, and the staging host must not be
 * on it: a `lux-radiology.webflow.io/...` URL in Webflow content is a mistake
 * worth seeing, not a link to silently relativise.
 */
export const WEBFLOW_STAGING = optional('webflow.staging')
  ? String(optional('webflow.staging')).replace(/\/+$/, '')
  : null;

/** Matches an absolute URL on any of the site's own hosts, capturing the path. */
export const INTERNAL_LINK = new RegExp(
  `^https?://(?:${WEBFLOW_DOMAINS.map((d) => d.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(/.*)?$`,
  'i',
);

// ── Sanity ──────────────────────────────────────────────────────────────────

export const SANITY_PROJECT_ID = required('sanity.projectId');
export const SANITY_DATASET = optional('sanity.dataset', 'production');
export const STUDIO_HOST = required('sanity.studioHost');

/**
 * The API version, as it appears in the URL path after `v`.
 *
 * Defaults to `X`, which is Sanity's own token for "always the newest API".
 * Sanity versions by URL segment rather than by header, so the slot cannot be
 * left empty — but it does not have to be a date, and a date is a thing that
 * then has to be remembered and kept in step across the scripts, the Studio
 * and the site's read client.
 *
 * The trade: on `X`, a Sanity release can change query behaviour without
 * notice. Pin a date in project.jsonc for any site where that is unacceptable.
 *
 * A leading `v` is tolerated and stripped, since the URL adds its own.
 */
export const SANITY_API_VERSION = String(optional('sanity.apiVersion', 'X')).replace(/^v/, '');

// ── Cloudflare ──────────────────────────────────────────────────────────────

export const CLOUDFLARE = {
  accountId: optional('cloudflare.accountId', ''),
  zone: optional('cloudflare.zone', ''),
  routes: optional('cloudflare.routes', []),
  workerName: optional('cloudflare.worker.name', ''),
};

export default project;
