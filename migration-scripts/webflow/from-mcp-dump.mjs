/**
 * Split a Webflow MCP tool-result dump into migration/raw/<collection>.json.
 *
 *   node migration-scripts/webflow/from-mcp-dump.mjs <path-to-dump.txt>
 *
 * WHY THIS EXISTS
 *
 * `pull.mjs` is the real ingest path: it talks to the Webflow Data API and is
 * repeatable by anyone with a token. This script is the fallback for when there
 * is no token but there IS an authorised Webflow MCP connection — the MCP
 * returns the same `list_collection_items` payloads, and when a result is too
 * large to inline the harness writes it to a file. That file is a perfectly
 * good raw dump; it just needs unwrapping.
 *
 * The alternative is transcribing the client's published content by hand
 * through a conversation, which is exactly the kind of silent-corruption risk
 * this whole pipeline exists to avoid. Never do that.
 *
 * Once WEBFLOW_API_TOKEN is in .env, `npm run wf:pull` supersedes this.
 *
 * DUMP SHAPE
 *
 *   [{ type: "text", text: "<json>" }, ...]
 *
 * one block per action, each `text` being the JSON for that action:
 *
 *   { label, action, result: { items: [...], pagination: { total } } }
 *
 * `label` is the collection name as passed to the MCP call, which this script
 * requires to match a key in COLLECTIONS so a mislabelled dump fails loudly
 * instead of writing a file nobody asked for.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { ROOT } from '../lib/env.mjs';
import { COLLECTIONS, SITE_ID } from './collections.mjs';

const dumpPath = process.argv[2];
if (!dumpPath) {
  console.error('\nUsage: node migration-scripts/webflow/from-mcp-dump.mjs <path-to-dump.txt>\n');
  process.exit(1);
}

const RAW = join(ROOT, 'migration/raw');
await mkdir(RAW, { recursive: true });

const blocks = JSON.parse(await readFile(dumpPath, 'utf8'));
if (!Array.isArray(blocks)) {
  console.error('\nDump is not a JSON array of content blocks.\n');
  process.exit(1);
}

const summary = [];
let problems = 0;

for (const block of blocks) {
  const text = typeof block === 'string' ? block : block?.text;
  if (!text) continue;

  let payload;
  try {
    payload = JSON.parse(text);
  } catch {
    console.error(`FAIL  a block is not valid JSON (${String(text).slice(0, 60)}…)`);
    problems++;
    continue;
  }

  if (payload.error) {
    console.error(`FAIL  ${payload.label}: ${payload.error.name} — ${payload.error.message}`);
    problems++;
    continue;
  }

  const name = payload.label;
  if (!(name in COLLECTIONS)) {
    console.error(
      `FAIL  label "${name}" is not a known collection. Expected one of: ${Object.keys(COLLECTIONS).join(', ')}`,
    );
    problems++;
    continue;
  }

  const items = payload.result?.items ?? [];
  const total = payload.result?.pagination?.total ?? items.length;

  // A dump that paged out is worse than no dump: the converter would run on a
  // partial collection and the count check downstream would be the only hint.
  if (items.length !== total) {
    console.error(`FAIL  ${name}: dump holds ${items.length} of ${total} items — re-pull with a higher limit`);
    problems++;
    continue;
  }

  await writeFile(
    join(RAW, `${name}.json`),
    // `collection: null` marks provenance: a dump carries items but not the
    // field schema, unlike pull.mjs. The converter does not need the schema —
    // migration-scripts/webflow/collections.mjs is the mapping — but a later reader
    // should not be puzzled by its absence.
    `${JSON.stringify({ collection: null, source: 'mcp-dump', items }, null, 2)}\n`,
    'utf8',
  );

  const live = items.filter((i) => !i.isArchived && !i.isDraft).length;
  summary.push({ name, total: items.length, live });
  console.log(`get   ${name.padEnd(14)} ${String(items.length).padStart(3)} items (${live} live)`);
}

if (problems) {
  console.error(`\n${problems} problem(s) — nothing further written.\n`);
  process.exit(1);
}

await writeFile(
  join(RAW, '_meta.json'),
  `${JSON.stringify(
    { siteId: SITE_ID, pulledAt: new Date().toISOString(), source: 'mcp-dump', summary },
    null,
    2,
  )}\n`,
  'utf8',
);

console.log(`\nok    ${summary.length} collections -> migration/raw/`);
