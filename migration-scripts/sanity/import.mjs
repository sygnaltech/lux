/**
 * Import migration/sanity/content.ndjson into the Sanity dataset.
 *
 *   node migration-scripts/sanity/import.mjs                # production
 *   node migration-scripts/sanity/import.mjs staging        # somewhere else
 *
 * A wrapper around `sanity dataset import` rather than a call to it directly,
 * for one reason: the CLI needs SANITY_AUTH_TOKEN in its environment, and that
 * token lives in studio/.env. This script loads that file and hands the value
 * to the child process, so the token travels file -> env -> child and is never
 * typed on a command line, echoed into a shell history, or printed.
 *
 * `--replace` makes the import idempotent. Document ids are derived from
 * Webflow item ids (see convert.mjs), so re-running after a converter fix
 * UPDATES the existing documents instead of creating a second copy of the site.
 * That is the whole reason the ids are deterministic.
 *
 * Assets: the NDJSON carries `_sanityAsset: "image@https://..."` directives
 * rather than uploaded references, so this step is also what fetches every
 * image from Webflow's CDN and puts it in Sanity's. It is therefore the only
 * step in the pipeline that needs the network, and the slowest.
 */
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { loadEnv, requireEnv, ROOT } from '../lib/env.mjs';
import { SANITY_DATASET } from '../lib/project.mjs';

const dataset = process.argv[2] ?? SANITY_DATASET;
const ndjson = join(ROOT, 'migration/sanity/content.ndjson');

if (!existsSync(ndjson)) {
  console.error('\nNo migration/sanity/content.ndjson — run `npm run sanity:convert` first.\n');
  process.exit(1);
}

loadEnv('studio');
const token = requireEnv('SANITY_AUTH_TOKEN', {
  file: 'studio/.env',
  why: 'writing to the Sanity dataset (needs the Editor role)',
});

console.log(`\nimporting into dataset "${dataset}" (replace)\n`);

/**
 * Run the CLI's Node entry point with this process's own `node`, rather than
 * going through `npx`.
 *
 * Not a style preference: on Windows, Node 22 refuses to `spawn` a `.cmd`
 * shim without `shell: true` (EINVAL), and turning the shell on would put the
 * token-bearing command through a shell parser. `sanity/bin/sanity` is a plain
 * Node script, so invoking it directly is both portable and keeps the child
 * process shell-free.
 */
const cli = join(ROOT, 'studio/node_modules/sanity/bin/sanity');
if (!existsSync(cli)) {
  console.error('\nSanity CLI not found — run `npm install` in studio/.\n');
  process.exit(1);
}

// The studio directory is the cwd so the CLI picks up sanity.cli.ts and knows
// the project id without it being repeated here.
const child = spawn(
  process.execPath,
  [cli, 'dataset', 'import', ndjson, dataset, '--replace'],
  {
    cwd: join(ROOT, 'studio'),
    stdio: 'inherit',
    env: { ...process.env, SANITY_AUTH_TOKEN: token },
  },
);

child.on('exit', (code) => {
  if (code === 0) {
    console.log(`\nok    imported. Next: npm run sanity:verify\n`);
  }
  process.exit(code ?? 1);
});
