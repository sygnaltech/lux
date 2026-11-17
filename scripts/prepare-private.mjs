#!/usr/bin/env node
/**
 * ENGINE — from `webflow-sanity:secured-pages`. Two per-repo adaptations, both
 * marked ADAPTED below; nothing else is changed.
 *
 * Renders every protected page and writes `worker/private-pages.generated.json`,
 * the `{ route: "<full HTML document>" }` manifest the gate Worker imports.
 *
 * Runs AFTER `astro build`, because it also asserts that nothing confidential
 * reached the built output. That check is the whole point: it turns "the
 * protected HTML never ships publicly" from a convention into a tested
 * property.
 *
 *   "build": "npm --prefix web run build && node scripts/prepare-private.mjs"
 *
 * The renderer is per-site and lives in `scripts/private-pages.config.mjs`. This
 * script owns only the contract: route in, one complete HTML document out.
 */
import fs from 'node:fs';
import path from 'node:path';
import {loadGate, MANIFEST_PATH} from './lib/gate.mjs';
import {PRIVATE_PAGES} from './private-pages.config.mjs';

const ROOT = path.join(path.dirname(MANIFEST_PATH), '..');

/**
 * ADAPTED (1/2): the built output is at `web/dist`, not `dist`.
 *
 * This repo is an orchestrator — the Astro app sits in `web/`, matching the
 * `LAYOUT:` note every migration-scripts engine file carries. Left as the
 * pattern's `ROOT/dist` the leak check finds no directory and fails the build
 * with "run this after astro build", which reads as a build-order bug rather
 * than a path bug and is a genuinely confusing half-hour.
 */
const DIST = path.join(ROOT, 'web', 'dist');

const TEXTUAL = new Set(['.html', '.htm', '.js', '.mjs', '.cjs', '.css', '.json', '.txt', '.xml', '.svg', '.map']);

const fail = message => { throw new Error(`prepare-private: ${message}`); };

const {PREFIX, isProtected} = await loadGate();

if (!Array.isArray(PRIVATE_PAGES) || PRIVATE_PAGES.length === 0) {
	fail('PRIVATE_PAGES is empty. Remove this build step rather than shipping a gate over nothing.');
}

// ── render ──────────────────────────────────────────────────────────────────

const manifest = {};

for (const page of PRIVATE_PAGES) {
	const {route, render, canary} = page;

	/**
	 * ADAPTED (2/2): ask the Worker's own predicate, rather than testing
	 * `route.startsWith(PREFIX + '/')` here.
	 *
	 * The pattern assumes the protected pages sit BENEATH a parent prefix. On
	 * this site the protected page IS the prefix (/poac), so the original check
	 * rejects the only page there is. `isProtected` is exported from the Worker
	 * precisely so this file cannot answer the question differently from the code
	 * that serves the request — see the long note on it in worker/index.mjs.
	 */
	if (typeof route !== 'string' || !isProtected(route)) {
		fail(`route ${JSON.stringify(route)} is not matched by the Worker's PREFIX (${PREFIX}). The gate would never see it.`);
	}
	if (route !== route.replace(/\/$/, '') || route.endsWith('.html')) {
		fail(`route ${route} must be extensionless with no trailing slash — the Worker normalises to that form before looking it up.`);
	}
	if (Object.hasOwn(manifest, route)) fail(`route ${route} is defined twice.`);
	if (typeof render !== 'function') fail(`route ${route} has no render() function.`);

	const html = await render();

	// Fail loudly rather than emitting an empty page: a blank protected page looks
	// exactly like a gate that is working.
	if (typeof html !== 'string' || html.trim() === '') {
		fail(`route ${route} rendered no content. Its source fragment is probably missing.`);
	}
	if (!/^\s*<(!doctype|html)\b/i.test(html)) {
		fail(`route ${route} did not render a complete HTML document — the Worker serves this string verbatim, so a fragment ships as a broken page.`);
	}
	if (canary !== undefined && (typeof canary !== 'string' || canary.length < 12)) {
		fail(`route ${route} has a canary that is too short to be distinctive. Use a full sentence of the confidential copy, or omit it.`);
	}
	if (typeof canary === 'string' && !html.includes(canary)) {
		fail(`route ${route} does not contain its own canary. Either the content changed or the canary is stale — the dist/ leak check is useless until they agree.`);
	}

	manifest[route] = html;
	console.log(`  rendered ${route}  (${html.length.toLocaleString()} bytes)`);
}

// ── assert nothing confidential reached the built output ────────────────────

if (!fs.existsSync(DIST)) {
	fail(`no ${path.relative(ROOT, DIST)} directory. Run this after astro build, not before — the leak check has nothing to read.`);
}

const files = [];
for (const entry of fs.readdirSync(DIST, {recursive: true, withFileTypes: true})) {
	if (entry.isFile()) files.push(path.join(entry.parentPath ?? entry.path, entry.name));
}

const leaks = [];

// A protected route must not exist as a static asset in any of the forms the
// asset layer would answer. That is the failure the whole pattern exists to
// avoid, and it is easy to reintroduce by adding the page to the route
// generator.
for (const route of Object.keys(manifest)) {
	for (const candidate of [`${route}.html`, `${route}/index.html`, route]) {
		const asset = path.join(DIST, candidate);
		if (fs.existsSync(asset) && fs.statSync(asset).isFile()) {
			leaks.push(`${path.relative(ROOT, asset)} — ${route} was emitted as a static asset; exclude it from the route generator`);
		}
	}
}

// And no distinctive line of the confidential copy may appear in any public
// file — including the sitemap, a search index, or a JSON payload.
const canaries = PRIVATE_PAGES.filter(page => typeof page.canary === 'string');
if (canaries.length === 0) {
	console.log('  WARNING: no page declares a canary, so the dist/ content leak check did not run.');
}
for (const file of files) {
	if (!TEXTUAL.has(path.extname(file).toLowerCase())) continue;
	const text = fs.readFileSync(file, 'utf8');
	for (const {route, canary} of canaries) {
		if (text.includes(canary)) {
			leaks.push(`${path.relative(ROOT, file)} — contains confidential copy from ${route}`);
		}
	}
}

if (leaks.length > 0) {
	console.error('\nprepare-private: CONFIDENTIAL CONTENT IS IN THE PUBLIC BUILD\n');
	for (const leak of leaks) console.error(`  ${leak}`);
	console.error('\nNothing was written. Fix the leak; do not deploy.\n');
	process.exit(1);
}

// ── write ───────────────────────────────────────────────────────────────────

fs.mkdirSync(path.dirname(MANIFEST_PATH), {recursive: true});
fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest)}\n`);

console.log(`\nprepare-private: ${Object.keys(manifest).length} protected page(s) → ${path.relative(ROOT, MANIFEST_PATH)}`);
console.log(`  scanned ${files.length} built file(s); no confidential content in the build.`);
