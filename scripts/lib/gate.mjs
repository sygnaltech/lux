/**
 * ENGINE — from `webflow-sanity:secured-pages`, verbatim.
 *
 * Loads the gate Worker so the build step and the tests can read PREFIX and
 * LOGIN from the one place that defines them.
 *
 * The Worker statically imports `worker/private-pages.generated.json`, which is
 * a gitignored build artifact — so on a clean checkout the import fails before
 * anything has had a chance to generate it. This writes an empty manifest in
 * that case and says so. An empty manifest is a gate over nothing: it 404s every
 * protected route, which is the correct failure direction.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));

/** Absolute path of the generated manifest, derived from this file's location. */
export const MANIFEST_PATH = path.join(here, '..', '..', 'worker', 'private-pages.generated.json');

export async function loadGate() {
	if (!fs.existsSync(MANIFEST_PATH)) {
		fs.mkdirSync(path.dirname(MANIFEST_PATH), {recursive: true});
		fs.writeFileSync(MANIFEST_PATH, '{}\n');
		console.log(`note: wrote an empty ${path.relative(process.cwd(), MANIFEST_PATH)} so the Worker could be imported.`);
	}
	const module = await import(new URL('../../worker/index.mjs', import.meta.url));
	return {
		worker: module.default,
		PREFIX: module.PREFIX,
		LOGIN: module.LOGIN,
		isProtected: module.isProtected,
	};
}
