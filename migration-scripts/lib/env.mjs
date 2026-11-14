/**
 * Minimal .env loader for the migration scripts.
 *
 *   import { loadEnv, requireEnv } from './lib/env.mjs';
 *   loadEnv();                                  // repo root .env
 *   loadEnv('studio');                          // studio/.env
 *   const token = requireEnv('SANITY_AUTH_TOKEN');
 *
 * WHY NOT A DEPENDENCY
 *
 * `dotenv` would be fine, but these files hold API tokens and the one property
 * worth guaranteeing is that a value never reaches a log, a tool result or an
 * error message. Forty lines that are read end to end is a better basis for
 * that promise than a transitive dependency tree.
 *
 * THE RULES THIS ENFORCES
 *
 *   - Values are pushed to process.env and never returned, printed or stringified.
 *   - requireEnv reports only the NAME of a missing variable and the file it
 *     should be in. It never reports what was found instead.
 *   - A pre-existing process.env value WINS over the file, matching every other
 *     tool, so a one-off `SANITY_AUTH_TOKEN=... node script` still works.
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

const loaded = new Set();

/**
 * Load `<dir>/.env` into process.env. Missing file is not an error — the
 * variables may be set in the shell, and `requireEnv` is what decides whether
 * anything is actually absent.
 */
export function loadEnv(dir = '.') {
  const file = join(ROOT, dir, '.env');
  if (loaded.has(file)) return;
  loaded.add(file);
  if (!existsSync(file)) return;

  for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    if (!key || process.env[key]) continue; // shell wins
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (value) process.env[key] = value;
  }
}

/**
 * Fetch a required variable, or exit with a message naming it and where it goes.
 * The value itself is returned to the caller and never logged here.
 */
export function requireEnv(name, { file = '.env', why = '' } = {}) {
  const value = process.env[name];
  if (value) return value;

  console.error(`\nMissing ${name}.`);
  console.error(`  Put it in ${file} (gitignored), or set it in the shell for one run.`);
  if (why) console.error(`  Needed for: ${why}`);
  console.error('');
  process.exit(1);
}

/** True if set, without revealing anything. For optional capabilities. */
export const hasEnv = (name) => Boolean(process.env[name]);

export { ROOT };
