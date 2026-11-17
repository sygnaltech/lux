/**
 * The password gate for /poac.
 *
 * From the secured-pages pattern (`webflow-sanity:secured-pages`). PER-SITE
 * CHANGES ARE CONFINED TO THE CONFIG BLOCK plus the one documented departure
 * noted under it. Everything else is the pattern and transfers between sites
 * unchanged — every guard in it exists because of a specific way this gate can
 * fail OPEN. A "simplification" here is how the protected page becomes public.
 *
 * WHY THIS WORKER EXISTS AT ALL, ON A SITE THAT HAD NONE.
 *
 * Webflow's per-page password does not survive an export. /poac was protected
 * on the Webflow site and was missed by the §1 inventory (it is absent from
 * the sitemap, which is where the inventory came from), so after cut-over the
 * live site answered /poac with its own 404. Restoring it needs a Worker,
 * because the defining property of the pattern is that the protected HTML is
 * never published as a static asset: it is compiled into this bundle and only
 * ever emitted from a request that presented a valid session cookie.
 *
 * Requires, in BOTH wrangler configs: `main` pointing here, `nodejs_compat`
 * (timingSafeEqual), `assets.binding: "ASSETS"`, and `assets.run_worker_first`
 * listing the paths below.
 */
import {timingSafeEqual} from 'node:crypto';
import privatePages from './private-pages.generated.json' with {type: 'json'};

// ── CONFIG ──────────────────────────────────────────────────────────────────

/**
 * The protected subtree.
 *
 * On this site the protected PAGE *is* the prefix — /poac is a single top-level
 * page, not a parent of a private section. See `isProtected` below for the one
 * consequence that has.
 *
 * Exported so the build step, the tests and the dev shim read it from here
 * rather than keeping a second copy.
 */
export const PREFIX = '/poac';

/**
 * Where the login form posts. MUST NOT sit under PREFIX — the login endpoint is
 * matched first, but a path that is also inside the protected subtree makes the
 * ordering load-bearing for no reason.
 *
 * It must also be listed in `assets.run_worker_first`, or the asset layer
 * answers it (with a 404) before this Worker is ever invoked.
 */
export const LOGIN = '/api/private/login';

/**
 * Landing route for a login that arrived without a valid `returnTo`.
 *
 * PREFIX itself, because that is the only protected page. On a site with a
 * private section this would be that section's landing page.
 */
const DEFAULT_ROUTE = PREFIX;

/** Cookie name. Project-specific, so two sites on one hostname cannot collide. */
const COOKIE = 'lux_private';

/** Session lifetime, milliseconds. */
const TTL = 8 * 60 * 60 * 1000;

/**
 * THE ONE DEPARTURE FROM THE PATTERN AS WRITTEN, and it is a tightening.
 *
 * The pattern matches protected routes with `route.startsWith(PREFIX)`, which
 * is correct when PREFIX is a parent segment (`/kiwifruit/private`) and wrong
 * here in both directions:
 *
 *   - Too narrow for the build step, which asserts every protected route is
 *     under `PREFIX + '/'`. /poac is not under /poac/, so the page this gate
 *     exists for would be rejected.
 *   - Too wide at request time. A bare prefix test also claims `/poacher` and
 *     any other path that merely begins with those five characters, and claims
 *     it to a 404 — the manifest is the allowlist — so a future public page
 *     whose slug starts with "poac" would silently disappear.
 *
 * So: the prefix itself, or anything beneath it at a segment boundary. Exported
 * because the build step and the dev shim must ask the same question this does;
 * two copies of a route-matching predicate is how a gate ends up guarding a
 * different set of paths than the one it was tested against.
 */
export const isProtected = route => route === PREFIX || route.startsWith(`${PREFIX}/`);

// ── the pattern — do not edit per site ──────────────────────────────────────

const encoder = new TextEncoder();

/**
 * The manifest of protected routes IS the allowlist, and it is consulted twice:
 * an unknown path under PREFIX 404s, and `returnTo` is validated against it.
 *
 * `env.PRIVATE_PAGES` is a test seam — the behavioural tests inject a fixture
 * manifest so they need no build and no real content. No deployed environment
 * defines it, so production always reads the bundled build artifact.
 */
const manifest = env => env.PRIVATE_PAGES ?? privatePages;

/**
 * The password is part of the signing key, so rotating it invalidates every
 * outstanding session. That is also the log-everybody-out switch.
 */
const signingKey = env => crypto.subtle.importKey(
	'raw',
	encoder.encode(`${env.PRIVATE_SESSION_SECRET}\0${env.PRIVATE_PAGE_PASSWORD}`),
	{name: 'HMAC', hash: 'SHA-256'}, false, ['sign', 'verify'],
);

/** Escape a value being interpolated into an HTML attribute. */
const attr = value => String(value)
	.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

const PRIVATE_HEADERS = {
	'Content-Type': 'text/html; charset=utf-8',
	'Cache-Control': 'private, no-store',
	'X-Robots-Tag': 'noindex, nofollow',
};

async function validSession(request, env) {
	if (!env.PRIVATE_PAGE_PASSWORD || !env.PRIVATE_SESSION_SECRET) return false;
	const jar = (request.headers.get('Cookie') || '').split(';').map(v => v.trim());
	const value = jar.find(v => v.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
	if (!value) return false;
	const [expiry, signature] = value.split('.');
	const expires = Number(expiry);
	// Reject expired AND implausibly far-future expiries: the signed payload is
	// the expiry, so bounding it bounds what a signature can ever be good for.
	if (!Number.isSafeInteger(expires) || expires < Date.now()
		|| expires > Date.now() + TTL || !signature) return false;
	try {
		return await crypto.subtle.verify('HMAC', await signingKey(env),
			Buffer.from(signature, 'base64url'), encoder.encode(expiry));
	} catch { return false; }
}

/** Read at most `limit` bytes of the body, cancelling the stream past it. */
async function boundedBody(request, limit = 8192) {
	if (Number(request.headers.get('Content-Length') || 0) > limit) throw new Error('body-limit');
	const reader = request.body?.getReader();
	if (!reader) return '';
	const chunks = [];
	let length = 0;
	try {
		for (;;) {
			const {done, value} = await reader.read();
			if (done) break;
			length += value.byteLength;
			if (length > limit) {
				await reader.cancel();
				throw new Error('body-limit');
			}
			chunks.push(value);
		}
	} finally { reader.releaseLock(); }
	return new TextDecoder().decode(Buffer.concat(chunks));
}

/**
 * Serve the gate page AT the protected URL, as 401, with the form wired up.
 *
 * Fetched through `env.ASSETS` rather than inlined so it carries the site's real
 * layout, CSS and fonts without duplicating them in the Worker bundle. That
 * binding reads the asset store directly and does NOT re-enter this Worker, so
 * there is no recursion to guard against.
 */
async function gate(request, env, url, route) {
	const asset = await env.ASSETS.fetch(new Request(new URL('/401', url), {method: 'GET'}));
	const hidden = `<input type="hidden" name="returnTo" value="${attr(route)}">`;

	// HTMLRewriter is a Workers runtime global. Any Node-side execution path —
	// `astro dev` through the middleware shim, and the behavioural tests — has to
	// do the same two edits without it.
	if (typeof HTMLRewriter === 'undefined') {
		const html = (await asset.text())
			// A form that already carries an action: replace it.
			.replace(/(<form\b[^>]*\baction=)["'][^"']*["']/i, `$1"${LOGIN}"`)
			// A form that does not: add one. The gate markup has no action, because
			// in production the rewriter sets it — so this branch is the common one.
			.replace(/(<form\b(?![^>]*\baction=)[^>]*?)\s*>/i, `$1 action="${LOGIN}">`)
			.replace(/(<form\b[^>]*>)/i, `$1${hidden}`);
		return new Response(request.method === 'HEAD' ? null : html,
			{status: 401, headers: PRIVATE_HEADERS});
	}

	const rewriter = new HTMLRewriter().on('form', {
		element(element) {
			element.setAttribute('action', LOGIN);
			element.append(hidden, {html: true});
		},
	});
	return rewriter.transform(new Response(asset.body, {status: 401, headers: PRIVATE_HEADERS}));
}

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		const route = url.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
		const pages = manifest(env);

		// ── login endpoint ──────────────────────────────────────────────────────
		if (route === LOGIN) {
			if (request.method !== 'POST') {
				return new Response('Method not allowed', {status: 405, headers: {Allow: 'POST'}});
			}
			// CSRF: the cookie is SameSite=Strict, and this blocks cross-site posts.
			if (request.headers.get('Origin') !== url.origin) {
				return new Response('Forbidden', {status: 403});
			}
			if (!env.PRIVATE_PAGE_PASSWORD || !env.PRIVATE_SESSION_SECRET
				|| env.PRIVATE_SESSION_SECRET.length < 32) {
				return new Response('Private access is not configured',
					{status: 503, headers: {'Cache-Control': 'no-store'}});
			}

			let body;
			try { body = new URLSearchParams(await boundedBody(request)); }
			catch { return new Response('Request too large', {status: 413}); }

			// Digest both sides to a fixed 32 bytes before comparing: timingSafeEqual
			// throws on a length mismatch, which would itself leak the length.
			const supplied = await crypto.subtle.digest('SHA-256',
				encoder.encode(body.get('pass') || body.get('password') || ''));
			const expected = await crypto.subtle.digest('SHA-256',
				encoder.encode(env.PRIVATE_PAGE_PASSWORD));

			// Only a route in the manifest may be returned to — this is what stops the
			// login endpoint being usable as an open redirect.
			const returnTo = body.get('returnTo');
			const destination = Object.hasOwn(pages, returnTo) ? returnTo : DEFAULT_ROUTE;

			if (!timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))) {
				return new Response(null, {status: 303, headers: {
					Location: `${destination}?e=1`,
					'Cache-Control': 'no-store',
				}});
			}

			const expiry = String(Date.now() + TTL);
			const signature = Buffer.from(
				await crypto.subtle.sign('HMAC', await signingKey(env), encoder.encode(expiry)),
			).toString('base64url');

			return new Response(null, {status: 303, headers: {
				Location: destination,
				'Cache-Control': 'no-store',
				'Set-Cookie': `${COOKIE}=${expiry}.${signature}; Path=${PREFIX}; HttpOnly; Secure; SameSite=Strict; Max-Age=${TTL / 1000}`,
			}});
		}

		// ── protected subtree ───────────────────────────────────────────────────
		if (isProtected(route)) {
			if (!Object.hasOwn(pages, route)) return new Response('Not found', {status: 404});

			if (await validSession(request, env)) {
				return new Response(request.method === 'HEAD' ? null : pages[route],
					{headers: PRIVATE_HEADERS});
			}
			return gate(request, env, url, route);
		}

		// Everything else is an ordinary static asset.
		//
		// On this site this branch is near-unreachable: `run_worker_first` names
		// only the protected paths and the login endpoint, so a public URL never
		// invokes this Worker at all and keeps the asset layer's own `_redirects`,
		// `_headers` and `not_found_handling` behaviour untouched. It stays because
		// the fallthrough must be a pass-through and not a 404 — if the route list
		// is ever widened to `true`, this is the line that keeps the site up.
		return env.ASSETS.fetch(request);
	},
};
