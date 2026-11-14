/**
 * Pull every Webflow collection to migration/raw/<collection>.json.
 *
 *   node migration-scripts/webflow/pull.mjs
 *
 * One job: get the data onto disk, exactly as the API returns it, and stop.
 * No filtering, no field mapping, no conversion — those are later stages with
 * their own scripts, and keeping them separate is what makes the pipeline
 * re-runnable from any point without going back to the network.
 *
 * In particular the EXCLUDED items (template demo data, archived items,
 * unpublished items) are pulled too. The decision to drop them belongs to the
 * converter, where it is written down and testable, not here where it would be
 * invisible.
 *
 * Needs WEBFLOW_API_TOKEN in .env — a Site API token with CMS read scope, from
 * the site's Integrations tab. The token is read from the environment and never
 * printed.
 *
 * migration/raw/ is gitignored: it is large, re-pullable, and the committed
 * artifact is the converted NDJSON rather than the input.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

import { loadEnv, requireEnv, ROOT } from '../lib/env.mjs';
import { COLLECTIONS, SITE_ID } from './collections.mjs';

loadEnv();
const TOKEN = requireEnv('WEBFLOW_API_TOKEN', {
  why: 'reading the Webflow CMS (one-off, not needed by the build)',
});

const RAW = join(ROOT, 'migration/raw');
const API = 'https://api.webflow.com/v2';

const headers = {
  authorization: `Bearer ${TOKEN}`,
  'accept-version': '2.0.0',
};

async function api(path) {
  const res = await fetch(`${API}${path}`, { headers });
  if (!res.ok) {
    // Deliberately does not echo the response body: a 401 from Webflow can
    // include the token prefix.
    throw new Error(`Webflow API ${res.status} ${res.statusText} for ${path}`);
  }
  return res.json();
}

/** Every item in a collection, paging at Webflow's 100-item limit. */
async function allItems(collectionId) {
  const items = [];
  let offset = 0;
  for (;;) {
    const page = await api(`/collections/${collectionId}/items?limit=100&offset=${offset}`);
    items.push(...(page.items ?? []));
    const total = page.pagination?.total ?? items.length;
    if (items.length >= total || (page.items ?? []).length === 0) break;
    offset = items.length;
  }
  return items;
}

await mkdir(RAW, { recursive: true });

const summary = [];

for (const [name, id] of Object.entries(COLLECTIONS)) {
  const [schema, items] = await Promise.all([api(`/collections/${id}`), allItems(id)]);

  await writeFile(
    join(RAW, `${name}.json`),
    `${JSON.stringify({ collection: schema, items }, null, 2)}\n`,
    'utf8',
  );

  const live = items.filter((i) => !i.isArchived && !i.isDraft).length;
  summary.push({ name, total: items.length, live });
  console.log(`get   ${name.padEnd(14)} ${String(items.length).padStart(3)} items (${live} live)`);
}

// The site id is recorded so a later reader can tell which Webflow site a raw
// dump came from without trusting the folder it is sitting in.
await writeFile(
  join(RAW, '_meta.json'),
  `${JSON.stringify({ siteId: SITE_ID, pulledAt: new Date().toISOString(), summary }, null, 2)}\n`,
  'utf8',
);

console.log(`\nok    ${summary.length} collections -> migration/raw/`);
