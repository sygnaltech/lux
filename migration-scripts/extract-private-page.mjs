/**
 * Extract Webflow's PASSWORD-PROTECTED pages into verbatim HTML fragments.
 *
 *   WEBFLOW_PAGE_PASSWORD=… node migration-scripts/extract-private-page.mjs
 *   WEBFLOW_PAGE_PASSWORD=… node migration-scripts/extract-private-page.mjs poac
 *
 * The sibling of `extract-webflow-page.mjs`, for the pages that one cannot see.
 * Same punch-out, same shell markers, same asset rewriting — three differences,
 * and each of them is the reason this is a separate script rather than a flag.
 *
 * 1. IT FETCHES FROM THE STAGING HOST, NOT `webflow.source`.
 *
 *    `webflow.source` is the production hostname, and after cut-over that is
 *    OUR site. Asking it for /poac returns our own 404 — which is exactly the
 *    bug this page exists to fix, so re-extracting from there would "succeed"
 *    against the wrong site. `webflow.staging` still serves the Webflow
 *    original for as long as the Webflow project exists.
 *
 * 2. IT PASSES WEBFLOW'S PASSWORD GATE FIRST.
 *
 *    A protected page answers 401 with a password form. `POST /.wf_auth` with
 *    `pass`, `path` and `page` returns a `wf_auth_page` cookie scoped to that
 *    path, and the page is readable with it. The password comes from the
 *    environment and is never written anywhere — not to a fragment, not to a
 *    log, not to the manifest.
 *
 * 3. IT WRITES TO `private/`, NOT `web/src/html/`.
 *
 *    That separation is the point, not tidiness. `web/src/html/` is globbed by
 *    BaseLayout and `web/src/pages/` generates routes; anything that lands in
 *    there is one careless import away from being published. Protected content
 *    lives outside the Astro app entirely and is read only by
 *    `scripts/private-pages.config.mjs`, at build time, into the Worker bundle.
 *
 * IT NEVER TOUCHES THE SHARED SHELL. nav.html, footer.html and head-custom.html
 * are derived from the PUBLIC pages and are compared against here, not
 * rewritten. A mismatch is a hard failure: it means either the shell moved and
 * every public page needs re-extracting, or an asset in the shell is not
 * localised yet — and silently forking the nav for one page is the kind of bug
 * nobody notices for a month.
 */
import { mkdir, writeFile, readFile, access } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { SHELL } from './pages.config.mjs';
import { PRIVATE_SOURCES } from '../scripts/private-pages.config.mjs';
import { WEBFLOW_STAGING } from './lib/project.mjs';
import { loadEnv, requireEnv } from './lib/env.mjs';
import { userAgent } from './lib/ua.mjs';
import { scanSpans, findSpan, findSpanWrapping } from './lib/html.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WEB = join(ROOT, 'web');
const SHARED_DIR = join(WEB, 'src/html');
const PRIVATE_DIR = join(ROOT, 'private');
const HTML_DIR = join(PRIVATE_DIR, 'html');
const PUBLIC_DIR = join(WEB, 'public');

const exists = (p) => access(p).then(() => true, () => false);

const decode = (s) =>
  s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
   .replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#39;/g, "'");

loadEnv();

if (!WEBFLOW_STAGING) {
  console.error('\nproject.jsonc is missing `webflow.staging`.');
  console.error('  A protected page can only be read from Webflow\'s *.webflow.io host —');
  console.error('  `webflow.source` is this site now. See the note in project.jsonc.\n');
  process.exit(1);
}

const password = requireEnv('WEBFLOW_PAGE_PASSWORD', {
  why: "Webflow's per-page password, to read the protected pages being ported",
});

// ---------------------------------------------------------------------------
// Shared with extract-webflow-page.mjs — keep in step
// ---------------------------------------------------------------------------

/** CSS and JS become local files under public/wf/<kind>/. */
const ASSET_RE =
  /https:\/\/(?:cdn\.prod\.website-files\.com|d3e54v103j8qbb\.cloudfront\.net)\/[^"')\s]+?\.(?:css|js)(?:\?[^"')\s]*)?/g;

const localForAsset = (url) => {
  const base = decodeURIComponent(url.split('?')[0].split('/').pop());
  return `${base.endsWith('.css') ? 'css' : 'js'}/${base}`;
};

/**
 * Everything else Webflow hosts — images, fonts, PDFs — becomes
 * public/wf/assets/<name>.
 *
 * The host list and both terminator rules are lifted from
 * localise-webflow-assets.mjs, including `&quot;` and friends: Webflow writes
 * CSS into HTML `style` attributes with HTML-escaped quotes inside `url(...)`,
 * and a naive character class swallows `&quot;)` onto the end of the URL.
 */
const WF_HOST = String.raw`https:\/\/(?:(?:[a-z0-9.-]*\.)?website-files\.com|d3e54v103j8qbb\.cloudfront\.net)\/`;
const TERM = String.raw`(?:&quot;|&#0*34;|&apos;|&#0*39;|["'\s])`;
const WF_IN_HTML = new RegExp(`${WF_HOST}(?:(?!${TERM}).)+`, 'g');

const localName = (url) =>
  decodeURIComponent(url.split('?')[0].split('/').pop() ?? '').replace(/\s+/g, '-');

/**
 * Both localisations, in one pass, plus the `integrity`/`crossorigin` removal
 * that has to go with the CSS/JS rewrite.
 *
 * A subresource-integrity hash is computed over the bytes Webflow served. The
 * local file is byte-identical, but the attribute refers to a cross-origin URL
 * that no longer applies, and a stale hash is a silently blocked script.
 *
 * CSS/JS FIRST, deliberately: WF_IN_HTML would otherwise claim those URLs too
 * and route a stylesheet into /wf/assets/.
 */
const localise = (html) =>
  html
    .replace(ASSET_RE, (url) => `/wf/${localForAsset(url)}`)
    .replace(/\s+integrity="[^"]*"/g, '')
    .replace(/\s+crossorigin="[^"]*"/g, '')
    .replace(WF_IN_HTML, (url) => `/wf/assets/${localName(url)}`);

/** Remove Webflow's active-link markers so one nav serves every page. */
const stripCurrent = (html) =>
  html
    .replace(/ aria-current="page"/g, '')
    .replace(/\s*\bw--current\b/g, '')
    .replace(/ class="\s*"/g, '');

const findShell = (spans, entry) =>
  entry?.childCls
    ? findSpanWrapping(spans, entry.tag, entry.childCls)
    : findSpan(spans, entry.tag, entry.cls);

const describeShell = (entry) =>
  entry?.childCls ? `${entry.tag} wrapping .${entry.childCls}` : `${entry?.tag}.${entry?.cls}`;

function meta(head, key) {
  const attr = key.startsWith('og:') ? 'property' : 'name';
  const a = new RegExp(`<meta[^>]*${attr}="${key}"[^>]*content="([^"]*)"`, 'i').exec(head);
  const b = new RegExp(`<meta[^>]*content="([^"]*)"[^>]*${attr}="${key}"`, 'i').exec(head);
  const v = a?.[1] ?? b?.[1];
  return v ? decode(v) : undefined;
}

function tokenizeHead(html) {
  const nodes = [];
  let i = 0;
  while (i < html.length) {
    const lt = html.indexOf('<', i);
    if (lt === -1) break;

    if (html.startsWith('<!--', lt)) {
      const end = html.indexOf('-->', lt);
      const stop = end === -1 ? html.length : end + 3;
      nodes.push(html.slice(lt, stop));
      i = stop;
      continue;
    }

    const tag = /^<([a-zA-Z][a-zA-Z0-9-]*)/.exec(html.slice(lt, lt + 40))?.[1]?.toLowerCase();
    if (!tag) { i = lt + 1; continue; }

    if (tag === 'script' || tag === 'style' || tag === 'title') {
      const close = `</${tag}>`;
      const end = html.indexOf(close, lt);
      const stop = end === -1 ? html.length : end + close.length;
      nodes.push(html.slice(lt, stop));
      i = stop;
      continue;
    }

    const gt = html.indexOf('>', lt);
    const stop = gt === -1 ? html.length : gt + 1;
    nodes.push(html.slice(lt, stop));
    i = stop;
  }
  return nodes.map((n) => n.trim()).filter(Boolean);
}

/**
 * Head nodes that are page-level DATA rather than furniture. The renderer
 * re-emits these from the manifest values, so they must not also land in a head
 * fragment or the page would carry two titles.
 */
const isPageData = (node) =>
  /^<title/i.test(node) ||
  /^<meta[^>]*\b(charset|name="viewport"|name="generator"|name="description"|name="twitter:(title|description|card)"|property="og:(title|description|type)")/i.test(node);

// ---------------------------------------------------------------------------
// Webflow's password gate
// ---------------------------------------------------------------------------

/**
 * Trade the password for a `wf_auth_page` cookie scoped to `path`.
 *
 * `--path-as-is` has a Node equivalent only by accident: `fetch` does not
 * normalise `/.wf_auth`, but curl does, which is worth knowing if this is ever
 * reproduced by hand — curl answers 404 without it and the endpoint looks dead.
 *
 * The cookie is per-path, so one is needed per protected page rather than one
 * per session.
 */
async function webflowSession(path) {
  const res = await fetch(`${WEBFLOW_STAGING}/.wf_auth`, {
    method: 'POST',
    redirect: 'manual',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'user-agent': userAgent('port'),
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
    // Webflow answers a wrong password with the same 302 and a `deleted`
    // cookie, so "no usable cookie" is the only signal there is. Never echo the
    // password or the response body.
    console.error(`\nWebflow refused the password for ${path} (HTTP ${res.status}).`);
    console.error('  Check WEBFLOW_PAGE_PASSWORD, and that the page is still protected.\n');
    process.exit(1);
  }
  return cookie;
}

// ---------------------------------------------------------------------------
// Extract
// ---------------------------------------------------------------------------

const only = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const targets = PRIVATE_SOURCES.filter((s) => only.length === 0 || only.includes(s.slug));

if (targets.length === 0) {
  console.error(`\nNo private pages matched: ${only.join(' ')}`);
  console.error(`  Known: ${PRIVATE_SOURCES.map((s) => s.slug).join(', ')}\n`);
  process.exit(1);
}

await mkdir(HTML_DIR, { recursive: true });

const sharedNav = await readFile(join(SHARED_DIR, 'nav.html'), 'utf8');
const sharedFooter = await readFile(join(SHARED_DIR, 'footer.html'), 'utf8');
const sharedHead = new Set(
  tokenizeHead(await readFile(join(SHARED_DIR, 'head-custom.html'), 'utf8')),
);

const entries = {};
let failed = false;

for (const target of targets) {
  const { slug, webflowPath } = target;
  const cookie = await webflowSession(webflowPath);

  const res = await fetch(`${WEBFLOW_STAGING}${webflowPath}`, {
    headers: { cookie, 'user-agent': userAgent('port') },
  });
  if (!res.ok) {
    console.error(`FAIL  ${res.status}  ${WEBFLOW_STAGING}${webflowPath}`);
    failed = true;
    continue;
  }
  const raw = await res.text();

  const htmlTag = /<html([^>]*)>/i.exec(raw)?.[1] ?? '';
  const wfPage = /data-wf-page="([^"]*)"/.exec(htmlTag)?.[1];
  const lang = /\blang="([^"]*)"/.exec(htmlTag)?.[1] ?? 'en';

  const headStart = raw.indexOf('>', raw.indexOf('<head')) + 1;
  const head = raw.slice(headStart, raw.indexOf('</head>'));
  const bodyStart = raw.indexOf('>', raw.indexOf('<body')) + 1;
  const body = raw.slice(bodyStart, raw.lastIndexOf('</body>'));

  const spans = scanSpans(body);
  const nav = findShell(spans, SHELL.nav);
  const footer = findShell(spans, SHELL.footer);

  if (!nav) console.error(`WARN  ${webflowPath}: no ${describeShell(SHELL.nav)} found`);
  if (!footer) console.error(`WARN  ${webflowPath}: no ${describeShell(SHELL.footer)} found`);

  // The shell is COMPARED, never written. See the header note.
  for (const [label, span, reference] of [
    ['nav', nav, sharedNav],
    ['footer', footer, sharedFooter],
  ]) {
    if (!span) continue;
    const extracted = localise(stripCurrent(body.slice(span.start, span.end)));
    if (extracted !== reference) {
      console.error(`\nFAIL  ${slug}: its ${label} differs from web/src/html/${label}.html`);
      console.error(`      extracted ${extracted.length} bytes, shared ${reference.length} bytes`);
      console.error('      Either the shared shell moved (re-extract the public pages with');
      console.error('      `npm run extract`) or an asset inside it is not localised yet');
      console.error('      (`npm run localise:assets`). Do NOT fork the shell for one page.\n');
      failed = true;
    }
  }

  // Keep the WHOLE body and punch out the shell subtrees, rather than slicing
  // between them — the nav is nested inside the hero section on this site.
  const cuts = [];
  if (nav) cuts.push({ ...nav, marker: '<!--wf:nav-->' });
  if (footer) cuts.push({ ...footer, marker: '<!--wf:footer-->' });
  cuts.sort((a, b) => a.start - b.start);

  let main = '';
  let cursor = 0;
  for (const cut of cuts) {
    main += body.slice(cursor, cut.start) + cut.marker;
    cursor = cut.end;
  }
  main += body.slice(cursor);
  main = localise(main);

  const headNodes = tokenizeHead(head).filter((n) => !isPageData(n)).map(localise);
  const extra = headNodes.filter((n) => !sharedHead.has(n));

  await writeFile(join(HTML_DIR, `main.${slug}.html`), main, 'utf8');
  if (extra.length) {
    await writeFile(join(HTML_DIR, `head-extra.${slug}.html`), extra.join('\n'), 'utf8');
  }

  entries[slug] = {
    route: target.route,
    webflowPath,
    wfPage,
    lang,
    // DECODED, like the metas. The manifest holds real text, not HTML — the
    // renderer escapes on output, so storing `&amp;` here yields `&amp;amp;` in
    // the <title> and the reader sees a literal "&amp;".
    title: decode(/<title[^>]*>([\s\S]*?)<\/title>/i.exec(head)?.[1]?.trim() ?? '') || undefined,
    description: meta(head, 'description'),
    ogTitle: meta(head, 'og:title'),
    ogDescription: meta(head, 'og:description'),
    shell: nav && footer ? 'full' : nav ? 'nav' : 'bare',
    headExtra: extra.length > 0,
  };

  console.log(`get   ${webflowPath}  ->  private/html/main.${slug}.html  (${main.length} bytes)`);

  // Every local reference the fragment now makes must actually exist. The
  // fragment is rewritten unconditionally — a half-localised page that still
  // points at Webflow is worse, because it keeps working until the account
  // lapses — so this is the check that says what is missing.
  const refs = new Set(main.match(/\/wf\/(?:assets|css|js)\/[^"')\s]+/g) ?? []);
  const absent = [];
  for (const ref of refs) {
    if (!(await exists(join(PUBLIC_DIR, ref)))) absent.push(ref);
  }
  if (absent.length) {
    console.error(`\nWARN  ${slug}: ${absent.length} referenced asset(s) are not in web/public yet:`);
    for (const ref of absent) console.error(`        ${ref}`);
    console.error('      Run `npm run localise:assets` to download them.\n');
  }
}

// Manifest. Merged over what is already there, so a single-page re-extract does
// not drop the others.
const manifestPath = join(PRIVATE_DIR, 'pages.json');
const prior = (await exists(manifestPath))
  ? JSON.parse(await readFile(manifestPath, 'utf8'))
  : { pages: {} };

const manifest = {
  // The canonical host, NOT the staging host the bytes came from. The ported
  // page's canonical URL and `data-wf-domain` are production facts.
  extractedFrom: (await import('./lib/project.mjs')).WEBFLOW_SOURCE,
  pages: { ...prior.pages, ...entries },
};

await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');

if (failed) {
  console.error('\nFAILED — fragments were written, but the shell check did not pass.');
  console.error('Fix that before building: the page would render with a forked nav.\n');
  process.exit(1);
}

console.log(`\nok    ${Object.keys(entries).length} protected page(s) -> private/`);
console.log('      next: npm run build  (renders them into the Worker and checks for leaks)');
