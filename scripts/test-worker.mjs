#!/usr/bin/env node
/**
 * ENGINE — from `webflow-sanity:secured-pages`, verbatim. Add this site's own
 * cases BELOW the thirteen rather than changing any of them.
 *
 * The behavioural spec of the gate. Imports the Worker and calls its `fetch`
 * directly with a fixture `env` — no network, no build, no real secrets, no real
 * content. Assertions 1–9 are the ones that catch every mistake the
 * implementation can make; 10–13 cover the guards around them.
 *
 *   "test": "node scripts/test-worker.mjs"
 *
 * Nothing here needs editing per site: PREFIX and LOGIN are read from the
 * Worker, and the protected manifest is injected through the `PRIVATE_PAGES`
 * test seam, so these run against any configuration of the pattern.
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {loadGate, MANIFEST_PATH} from './lib/gate.mjs';

const {worker, PREFIX, LOGIN} = await loadGate();

/**
 * The generated manifest, for the per-site cases at the bottom of this file.
 *
 * `loadGate` guarantees the file exists — it writes `{}` when it does not — so
 * this read is safe on a clean checkout, and an empty object is the signal that
 * nothing has been built yet.
 */
const privatePages = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));

const ORIGIN = 'https://host.test';
const PASSWORD = 'fixture-password';
const SIGNING_SECRET = 'fixture-signing-secret-at-least-32-chars';

const ROUTE = `${PREFIX}/fixture-route`;
const BODY = '<!DOCTYPE html><html><body>fixture protected body</body></html>';
const GATE = '<!DOCTYPE html><html><body><form method="POST"><input type="password" name="pass"></form></body></html>';

const env = (overrides = {}) => ({
	PRIVATE_PAGE_PASSWORD: PASSWORD,
	PRIVATE_SESSION_SECRET: SIGNING_SECRET,
	PRIVATE_PAGES: {[ROUTE]: BODY},
	ASSETS: {
		fetch: request => new URL(request.url).pathname === '/401'
			? new Response(GATE, {headers: {'Content-Type': 'text/html; charset=utf-8'}})
			: new Response('asset', {status: 200}),
	},
	...overrides,
});

const fetchRoute = (route, {cookie, overrides} = {}) => worker.fetch(
	new Request(`${ORIGIN}${route}`, {headers: cookie ? {Cookie: cookie} : {}}),
	env(overrides),
);

const postLogin = (fields, {origin = ORIGIN, overrides} = {}) => worker.fetch(
	new Request(`${ORIGIN}${LOGIN}`, {
		method: 'POST',
		headers: {Origin: origin, 'Content-Type': 'application/x-www-form-urlencoded'},
		body: new URLSearchParams(fields).toString(),
	}),
	env(overrides),
);

/** The cookie pair from a Set-Cookie header, ready to send back as `Cookie`. */
const sessionCookie = response => response.headers.get('Set-Cookie').split(';')[0];

const checks = [];
const check = (name, fn) => checks.push([name, fn]);

// ── 1. unauthenticated protected route ⇒ 401 ───────────────────────────────
check('an unauthenticated protected route answers 401, at its own URL', async () => {
	const response = await fetchRoute(ROUTE);
	assert.equal(response.status, 401);
	assert.equal(response.headers.get('Cache-Control'), 'private, no-store');
	assert.match(response.headers.get('X-Robots-Tag'), /noindex/);
	assert.doesNotMatch(await response.text(), /fixture protected body/,
		'the gate response must not contain the protected content');
});

// ── 2. the gate carries returnTo for the requested route ───────────────────
check('the gate form posts to the login endpoint and carries returnTo', async () => {
	const html = await (await fetchRoute(ROUTE)).text();
	assert.match(html, new RegExp(`action="${LOGIN}"`), 'the form action was not wired up');
	assert.match(html, new RegExp(`name="returnTo"\\s+value="${ROUTE}"`),
		'returnTo was not set to the requested route');
});

// ── 3. wrong password ⇒ 303 …?e=1 and no cookie ────────────────────────────
check('a wrong password redirects back with ?e=1 and sets no cookie', async () => {
	const response = await postLogin({pass: 'not-the-password', returnTo: ROUTE});
	assert.equal(response.status, 303);
	assert.equal(response.headers.get('Location'), `${ROUTE}?e=1`);
	assert.equal(response.headers.get('Set-Cookie'), null, 'a failed login issued a session');
});

// ── 4. foreign Origin ⇒ 403, even with the right password ──────────────────
check('a correct password from a foreign Origin is refused', async () => {
	const response = await postLogin({pass: PASSWORD, returnTo: ROUTE}, {origin: 'https://other.test'});
	assert.equal(response.status, 403);
	assert.equal(response.headers.get('Set-Cookie'), null);
});

// ── 5. correct password ⇒ 303 + a properly flagged cookie ──────────────────
check('a correct password issues a scoped, HttpOnly, Secure, Strict cookie', async () => {
	const response = await postLogin({pass: PASSWORD, returnTo: ROUTE});
	assert.equal(response.status, 303);
	assert.equal(response.headers.get('Location'), ROUTE);
	const cookie = response.headers.get('Set-Cookie');
	assert.ok(cookie, 'no session cookie was issued');
	assert.match(cookie, /HttpOnly/);
	assert.match(cookie, /Secure/);
	assert.match(cookie, /SameSite=Strict/);
	assert.match(cookie, new RegExp(`Path=${PREFIX}(;|$)`),
		'the cookie is not scoped to the protected subtree, so it leaks onto public pages');
});

// ── 6. that cookie ⇒ 200 with the protected body, uncacheable ──────────────
check('the session cookie serves the protected page, uncacheable and unindexable', async () => {
	const cookie = sessionCookie(await postLogin({pass: PASSWORD, returnTo: ROUTE}));
	const response = await fetchRoute(ROUTE, {cookie});
	assert.equal(response.status, 200);
	assert.equal(response.headers.get('Cache-Control'), 'private, no-store');
	assert.match(response.headers.get('X-Robots-Tag'), /noindex/);
	assert.equal(await response.text(), BODY);
});

// ── 7. a tampered cookie ⇒ 401 ─────────────────────────────────────────────
check('a tampered cookie is rejected', async () => {
	const cookie = sessionCookie(await postLogin({pass: PASSWORD, returnTo: ROUTE}));
	for (const tampered of [`${cookie}x`, cookie.replace(/=(\d+)\./, (_, n) => `=${Number(n) + 1}.`)]) {
		assert.equal((await fetchRoute(ROUTE, {cookie: tampered})).status, 401,
			`accepted a tampered cookie: ${tampered}`);
	}
});

// ── 8. password secret blank ⇒ 401, and login 503 ──────────────────────────
check('an unset password secret closes the gate rather than opening it', async () => {
	const overrides = {PRIVATE_PAGE_PASSWORD: ''};
	assert.equal((await fetchRoute(ROUTE, {overrides})).status, 401);
	assert.equal((await postLogin({pass: '', returnTo: ROUTE}, {overrides})).status, 503,
		'an empty password must not be a valid password');
});

// ── 9. rotating the password invalidates live sessions ─────────────────────
check('rotating PRIVATE_PAGE_PASSWORD invalidates an outstanding session', async () => {
	const cookie = sessionCookie(await postLogin({pass: PASSWORD, returnTo: ROUTE}));
	assert.equal((await fetchRoute(ROUTE, {cookie})).status, 200, 'the cookie should start valid');
	const response = await fetchRoute(ROUTE, {cookie, overrides: {PRIVATE_PAGE_PASSWORD: 'rotated-password'}});
	assert.equal(response.status, 401);
});

// ── 10. the manifest is the allowlist ──────────────────────────────────────
check('an unknown path under the prefix 404s rather than showing the gate', async () => {
	const response = await fetchRoute(`${PREFIX}/no-such-route`);
	assert.equal(response.status, 404);
});

// ── 11. returnTo cannot be turned into an open redirect ────────────────────
check('a returnTo outside the manifest falls back to the default route', async () => {
	for (const returnTo of ['https://other.test/', '//other.test/', '/', `${PREFIX}/no-such-route`]) {
		const response = await postLogin({pass: PASSWORD, returnTo});
		const location = response.headers.get('Location');
		assert.ok(location.startsWith(PREFIX),
			`login redirected to ${location} for returnTo=${returnTo}`);
	}
});

// ── 12. the login endpoint accepts nothing but POST ────────────────────────
check('the login endpoint rejects a GET', async () => {
	const response = await fetchRoute(LOGIN);
	assert.equal(response.status, 405);
	assert.equal(response.headers.get('Allow'), 'POST');
});

// ── 13. a weak signing secret is a misconfiguration, not a session ─────────
check('a signing secret under 32 characters refuses to issue a session', async () => {
	const response = await postLogin({pass: PASSWORD, returnTo: ROUTE},
		{overrides: {PRIVATE_SESSION_SECRET: 'too-short'}});
	assert.equal(response.status, 503);
	assert.equal(response.headers.get('Set-Cookie'), null);
});

// ───────────────────────────────────────────────────────────────────────────
// PER-SITE — Lux Radiology. Below the thirteen, as the pattern asks.
//
// The thirteen run against FIXTURES: a two-line gate page and a one-line
// protected body. That is deliberate — they must pass on a clean checkout with
// no build and no content — and it leaves two things they cannot see:
//
//   1. Whether the gate wiring survives contact with the REAL /401 markup.
//      Webflow's password-page form carries six attributes and no `action`, so
//      the no-HTMLRewriter branch has to ADD one rather than replace one, and
//      it must add exactly one. The fixture form is simple enough to pass
//      either way.
//   2. Whether the REAL protected page is whole — nav and footer substituted,
//      no `<!--wf:…-->` marker left behind, nothing still pointing at Webflow.
//      A page can be served perfectly by a correct gate and still be broken.
//
// Both need a build, which `npm test` does not guarantee, so they SKIP with a
// note rather than failing on a clean checkout. `npm run build` then
// `npm test` runs them.
// ───────────────────────────────────────────────────────────────────────────

const DIST_GATE = new URL('../web/dist/401.html', import.meta.url);
const built = fs.existsSync(DIST_GATE) && Object.keys(privatePages).length > 0;

/** The real built gate page and the real generated manifest. */
const realEnv = () => ({
	PRIVATE_PAGE_PASSWORD: PASSWORD,
	PRIVATE_SESSION_SECRET: SIGNING_SECRET,
	// No PRIVATE_PAGES override: this is the bundled build artifact.
	ASSETS: {
		fetch: request => new URL(request.url).pathname === '/401'
			? new Response(fs.readFileSync(DIST_GATE, 'utf8'),
				{headers: {'Content-Type': 'text/html; charset=utf-8'}})
			: new Response('asset', {status: 200}),
	},
});

const realFetch = (route, cookie) => worker.fetch(
	new Request(`${ORIGIN}${route}`, {headers: cookie ? {Cookie: cookie} : {}}),
	realEnv(),
);

const realLogin = () => worker.fetch(new Request(`${ORIGIN}${LOGIN}`, {
	method: 'POST',
	headers: {Origin: ORIGIN, 'Content-Type': 'application/x-www-form-urlencoded'},
	body: new URLSearchParams({pass: PASSWORD, returnTo: PREFIX}).toString(),
}), realEnv());

check('[lux] the real /401 markup is wired up, exactly once, and leaks nothing', async () => {
	if (!built) return;
	const html = await (await realFetch(PREFIX)).text();
	assert.match(html, new RegExp(`action="${LOGIN}"`), 'the real gate page did not get an action');
	assert.equal((html.match(/\baction=/g) ?? []).length, 1, 'the gate page has more than one action attribute');
	assert.equal((html.match(/name="returnTo"/g) ?? []).length, 1, 'the gate page has more than one returnTo input');
	assert.match(html, /utility-page-wrap/, 'the gate lost the site markup');
	assert.match(html, /lux-radiology\.shared\./, 'the gate lost the site stylesheet');
	assert.doesNotMatch(html, /booking system resets properly/, 'the gate leaked protected copy');
});

check('[lux] the real protected page is whole behind a valid session', async () => {
	if (!built) return;
	const cookie = sessionCookie(await realLogin());
	const response = await realFetch(PREFIX, cookie);
	assert.equal(response.status, 200);
	const body = await response.text();
	assert.match(body, /booking system resets properly/, 'the protected copy is missing');
	assert.match(body, /mobile-navigation/, 'the shared nav did not substitute');
	assert.match(body, /class="footer"/, 'the shared footer did not substitute');
	assert.doesNotMatch(body, /<!--wf:(nav|footer)-->/, 'a shell marker survived into the output');
	assert.doesNotMatch(body, /cdn\.prod\.website-files\.com/, 'the page still references Webflow');
	assert.match(body, /<title>/, 'the page has no title');
});

check('[lux] a public path that merely starts with the prefix is NOT claimed', async () => {
	// `/poacher` is the case a bare `startsWith(PREFIX)` gets wrong: the manifest
	// is the allowlist, so the gate would 404 it instead of letting the asset
	// layer answer. Nothing is at that path today; this is here so adding a
	// public page whose slug begins with the prefix cannot silently vanish.
	const response = await realFetch(`${PREFIX}her`);
	assert.equal(response.status, 200, `${PREFIX}her was claimed by the gate instead of passing through`);
});

check('[lux] a trailing slash and a .html suffix both reach the protected route', async () => {
	if (!built) return;
	const cookie = sessionCookie(await realLogin());
	for (const variant of [`${PREFIX}/`, `${PREFIX}.html`]) {
		assert.equal((await realFetch(variant, cookie)).status, 200,
			`${variant} did not normalise to ${PREFIX}`);
	}
});

// ── run ────────────────────────────────────────────────────────────────────

if (!built) {
	console.log('  note: the [lux] build-dependent cases are SKIPPED — run `npm run build` first.');
}

let failed = 0;
for (const [name, fn] of checks) {
	try {
		await fn();
		console.log(`  ok    ${name}`);
	} catch (error) {
		failed += 1;
		console.error(`  FAIL  ${name}\n        ${error.message.split('\n')[0]}`);
	}
}

console.log(`\n${checks.length - failed}/${checks.length} gate assertions passed.`);
if (failed > 0) {
	console.error('The gate is not safe to deploy while any of these fail.');
	process.exit(1);
}
