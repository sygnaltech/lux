/**
 * Pull the Webflow CSS and JS bundles into public/wf/ so the ported site has no
 * runtime dependency on Webflow's CDN.
 *
 *   node migration-scripts/fetch-webflow-assets.mjs
 *
 * WHY SELF-HOST
 *
 * Leaving the <link> and <script> tags pointing at cdn.prod.website-files.com
 * renders identically today and breaks the day the Webflow subscription lapses.
 * The whole point of the migration is to stop depending on that account, so the
 * bundles come with us.
 *
 * WHAT IT FETCHES
 *
 *   the shared stylesheet          <site>.webflow.shared.*.css
 *   jQuery                         from Webflow's cloudfront mirror
 *   the shared webpack chunks      webflow.schunk.*.js
 *   each page's ENTRY chunk        webflow.<hash>.<hash>.js — differs per page
 *
 * The entry chunks are discovered by the extractor, which knows which pages
 * exist; this script is driven by the manifest it writes. So the order is:
 * extract first, then fetch. On a cold repo the extractor fetches pages over
 * the network anyway, so there is nothing to bootstrap.
 *
 * NOT FETCHED, DELIBERATELY: images and fonts. Images in the ported HTML still
 * point at Webflow's CDN, and the Google Fonts loader still calls out to
 * Google. Both are visible and intentional gaps at this stage — closing the
 * first is what `localise:assets` is for, and it is NOT optional. A site whose
 * bundles are local and whose fonts are not is still a Webflow dependency.
 *
 * LAYOUT: `WEB` assumes the Astro app sits in `web/`. In a single-package repo,
 * point it at ROOT instead.
 */
import { mkdir, writeFile, readFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WEB = join(ROOT, 'web');
const WF_DIR = join(WEB, 'public/wf');
const MANIFEST = join(WEB, 'src/data/pages.json');

const exists = (p) => access(p).then(() => true, () => false);

/** Everything the site needs, as `url -> path under public/wf/`. */
async function assetList() {
  const manifest = JSON.parse(await readFile(MANIFEST, 'utf8'));
  const assets = new Map();

  for (const [url, local] of Object.entries(manifest.assets ?? {})) {
    assets.set(url, local);
  }
  return assets;
}

const assets = await assetList();

if (assets.size === 0) {
  console.error('\nNothing to fetch — src/data/pages.json lists no assets.');
  console.error('Run `npm run extract` first; it discovers them.\n');
  process.exit(1);
}

let fetched = 0;
let skipped = 0;

for (const [url, local] of assets) {
  const dest = join(WF_DIR, local);
  if (await exists(dest)) {
    skipped++;
    continue;
  }
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`FAIL  ${res.status}  ${url}`);
    process.exitCode = 1;
    continue;
  }
  await mkdir(dirname(dest), { recursive: true });
  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  console.log(`get   wf/${local}`);
  fetched++;
}

console.log(`\nok    ${fetched} fetched, ${skipped} already present`);
