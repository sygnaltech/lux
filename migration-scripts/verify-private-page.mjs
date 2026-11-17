/**
 * Structurally diff each RENDERED protected page against the live Webflow one.
 *
 *   WEBFLOW_PAGE_PASSWORD=… node migration-scripts/verify-private-page.mjs
 *
 * The sibling of `verify-port.mjs`, and — after cut-over — the only fidelity
 * check in this repo that still measures anything. `verify-port.mjs` fetches
 * `webflow.source`, which is now THIS SITE, so it compares the build against
 * itself and passes unconditionally. The Webflow originals survive only on
 * `webflow.staging`, which is where this looks.
 *
 * It reads the rendered HTML from `scripts/private-pages.config.mjs` directly
 * rather than from a built file, because a built file is exactly what must not
 * exist. No build is required and nothing is written.
 *
 * TWO COMPARISONS, as in verify-port.mjs:
 *
 *   TAGS   the number of element open-tags in <body> must match exactly. This
 *          is the hard check: it catches a dropped section, a nav that did not
 *          substitute, a list that came back empty.
 *   TEXT   every visible line of text on the live page should appear on ours.
 *          REPORTED, NOT ENFORCED — see below.
 *
 * WHY TEXT IS A REPORT AND NOT A FAILURE, only on this page type:
 *
 * /poac's sidebar carries a Webflow collection list sorted RANDOMLY — two
 * fetches a minute apart return different customer reviews. The ported copy is
 * frozen, as every ported Webflow list is, so a text comparison against a live
 * fetch can never be clean and a hard check here would be red forever. Red
 * forever is worse than no check: it trains everyone to ignore the line.
 *
 * So the missing lines are printed. Expect a handful from one rotating review
 * (its quote, the reviewer's name, its "Read Full Review" href). Anything
 * beyond that — a heading, a service name, a button label — is a real
 * regression, and the tag count is what catches the structural half regardless.
 *
 * WHAT NEITHER CHECK CAN CATCH: CSS, layout, and anything JavaScript builds at
 * runtime. The /poac booking buttons are wired up by the external Site Engine
 * (`engine/src/page/poac.ts`, dispatched on pathname `/poac`), so they can only
 * be confirmed in a browser, signed in.
 */
import { userAgent } from './lib/ua.mjs';
import { WEBFLOW_STAGING } from './lib/project.mjs';
import { loadEnv, requireEnv } from './lib/env.mjs';
import { PRIVATE_SOURCES, PRIVATE_PAGES } from '../scripts/private-pages.config.mjs';

loadEnv();

if (!WEBFLOW_STAGING) {
  console.error('\nproject.jsonc is missing `webflow.staging` — see the note there.\n');
  process.exit(1);
}

const password = requireEnv('WEBFLOW_PAGE_PASSWORD', {
  why: "Webflow's per-page password, to read the protected originals being compared against",
});

/** Visible text lines, with <script>/<style> contents removed first. */
function textLines(html) {
  const stripped = html
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<[^>]+>/g, '\n');
  return stripped
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

/** Element open-tags inside <body>. */
function bodyTags(html) {
  const i = html.indexOf('<body');
  const body = i === -1 ? html : html.slice(i);
  return body.match(/<[a-zA-Z][\w-]*/g) ?? [];
}

/** Trade the password for Webflow's per-path `wf_auth_page` cookie. */
async function webflowSession(path) {
  const res = await fetch(`${WEBFLOW_STAGING}/.wf_auth`, {
    method: 'POST',
    redirect: 'manual',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent': userAgent('verify'),
      origin: WEBFLOW_STAGING,
      referer: `${WEBFLOW_STAGING}${path}`,
    },
    body: new URLSearchParams({ pass: password, path, page: path }).toString(),
  });
  const cookie = res.headers
    .getSetCookie()
    .map((c) => c.split(';')[0])
    .find((c) => c.startsWith('wf_auth_page=') && !c.endsWith('=deleted'));
  if (!cookie) {
    console.error(`\nWebflow refused the password for ${path} (HTTP ${res.status}).`);
    console.error('  Check WEBFLOW_PAGE_PASSWORD, and that the page is still protected.\n');
    process.exit(1);
  }
  return cookie;
}

const only = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const renderFor = new Map(PRIVATE_PAGES.map((p) => [p.route, p.render]));

let failed = 0;

for (const source of PRIVATE_SOURCES) {
  if (only.length && !only.includes(source.slug)) continue;

  const render = renderFor.get(source.route);
  if (!render) {
    console.error(`FAIL  ${source.slug}: no PRIVATE_PAGES entry for route ${source.route}`);
    failed++;
    continue;
  }

  const ours = await render();

  const cookie = await webflowSession(source.webflowPath);
  const res = await fetch(`${WEBFLOW_STAGING}${source.webflowPath}`, {
    headers: { cookie, 'user-agent': userAgent('verify') },
  });
  if (!res.ok) {
    console.error(`FAIL  ${source.slug}: HTTP ${res.status} from ${WEBFLOW_STAGING}${source.webflowPath}`);
    failed++;
    continue;
  }
  const live = await res.text();

  const liveTags = bodyTags(live).length;
  const ourTags = bodyTags(ours).length;
  const tagsOk = liveTags === ourTags;

  const ourText = new Set(textLines(ours));
  const missing = [...new Set(textLines(live))].filter((line) => !ourText.has(line));

  console.log(`\n${source.slug}  ${source.route}`);
  console.log(`  tags  ${tagsOk ? 'ok' : 'FAIL'}   live ${liveTags}, ours ${ourTags}`);
  console.log(`  text  ${missing.length} live line(s) absent from ours`);
  for (const line of missing) {
    console.log(`          ${line.length > 110 ? `${line.slice(0, 110)}…` : line}`);
  }
  if (missing.length) {
    console.log('        (a randomly-sorted review list makes a few of these expected —');
    console.log('         see the note at the top of this file)');
  }

  if (!tagsOk) failed++;
}

console.log('');
if (failed) {
  console.error(`${failed} protected page(s) differ structurally from the Webflow original.\n`);
  process.exit(1);
}
console.log('ok    every protected page matches the Webflow original on tag count.\n');
