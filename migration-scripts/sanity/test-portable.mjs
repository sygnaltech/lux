/**
 * Assert the Portable Text -> HTML serializer.
 *
 *   node --experimental-strip-types migration-scripts/sanity/test-portable.mjs
 *
 * Runs the real pipeline end to end on the real fixtures: Webflow HTML ->
 * Portable Text -> HTML. The second conversion is the one under test, but
 * testing it on converter output rather than hand-written blocks is the point —
 * it is the combination that ships, and a mismatch between the two stages is
 * exactly the bug that would otherwise reach a page.
 *
 * The serializer is TypeScript, so this imports it through Node's type
 * stripping (Node 22+). If that ever breaks, the assertions matter more than
 * the mechanism: port them into a .test.ts and run via vitest.
 *
 * Fixture-DRIVEN, like test-converter.mjs — the per-fixture round-trip runs on
 * whatever is in migration/fixtures/, and the structural checks fire only where
 * the corpus exercises the case.
 *
 * PATH: the serializer is assumed at web/src/lib/portable.ts. In a
 * single-package repo it is src/lib/portable.ts.
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { toPortableText } from './html-to-portable-text.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const FIXTURES = join(ROOT, 'migration/fixtures');

const { renderPortableText } = await import('../../web/src/lib/portable.ts');

let failures = 0;
const check = (name, ok, detail = '') => {
  if (ok) console.log(`ok    ${name}`);
  else {
    console.error(`FAIL  ${name}`);
    if (detail) console.error(`      ${detail}`);
    failures++;
  }
};

const visible = (s) =>
  s
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/\s+/g, '')
    .trim();

const sourceText = (html) =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/‌/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&zwnj;/g, '')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rsquo;/g, '’')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/\s+/g, '')
    .trim();

if (!existsSync(FIXTURES)) {
  console.error('\nNo migration/fixtures/ — see the note in migration-scripts/sanity/test-converter.mjs.\n');
  process.exit(1);
}

const files = readdirSync(FIXTURES).filter((f) => f.endsWith('.html')).sort();
if (files.length === 0) {
  console.error('\nNo fixtures in migration/fixtures/.\n');
  process.exit(1);
}

const rendered = {};
for (const file of files) {
  const html = readFileSync(join(FIXTURES, file), 'utf8');
  const out = renderPortableText(toPortableText(html));
  rendered[file] = out;

  check(
    `${file} — round-trips without losing text`,
    visible(out) === sourceText(html),
    `source ${sourceText(html).length} chars, rendered ${visible(out).length}`,
  );
}

const sourceAll = files.map((f) => readFileSync(join(FIXTURES, f), 'utf8')).join('\n');
const outAll = Object.values(rendered).join('\n');

/**
 * Per-fixture sources, for guards whose pattern can SPAN a file boundary.
 *
 * `sourceAll` joins every fixture, which is fine for a single-tag guard like
 * `/<blockquote/` and wrong for anything containing `[\s\S]*?`: an `<li>` in
 * one fixture matches a `<ul>` in a DIFFERENT one, and the suite then demands
 * a construct the corpus does not contain. The same bug exists in
 * test-converter.mjs and is fixed the same way.
 */
const sources = files.map((f) => readFileSync(join(FIXTURES, f), 'utf8'));
const anySource = (re) => sources.some((s) => re.test(s));

if (anySource(/<li[^>]*>[\s\S]*?<(ul|ol)\b/i)) {
  check(
    'emits a nested list inside an <li>',
    /<li>[^<]*<(ul|ol)\b/.test(outAll),
    'nesting was flattened',
  );
}

if (/<blockquote/i.test(sourceAll)) {
  check('blockquote emitted', outAll.includes('<blockquote>'), 'no blockquote in the output');
}

if (/<h[1-6]\b/i.test(sourceAll)) {
  check('headings emitted', /<h[2-6]\b/.test(outAll), 'headings became paragraphs');
}

if (/<br\b/i.test(sourceAll)) {
  check(
    'paragraphs carry pre-line so <br> newlines render',
    outAll.includes('white-space:pre-line'),
    'without this a multi-line block collapses to one line',
  );
}

if (/href="mailto:/i.test(sourceAll)) {
  check('mailto preserved', /href="mailto:/.test(outAll), 'mailto href lost');
}

check('no empty paragraphs', !/<p[^>]*><\/p>/.test(outAll), 'an empty <p> renders as a dead gap');

check(
  'no target without rel=noopener',
  !/target="_blank"(?![^>]*rel=)/.test(outAll),
  'a target=_blank without rel=noopener leaks window.opener',
);

// --- escaping and empty input, always ---------------------------------------

{
  // Content containing HTML must not become markup.
  const blocks = [
    {
      _type: 'block',
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', text: '<script>alert(1)</script> & "quoted"', marks: [] }],
    },
  ];
  const out = renderPortableText(blocks);
  check(
    'content is escaped, not injected',
    !out.includes('<script>') && out.includes('&lt;script&gt;') && out.includes('&amp;'),
    out,
  );
}

check('empty body renders nothing', renderPortableText([]) === '', 'expected an empty string');
check(
  'undefined body renders nothing',
  renderPortableText(undefined) === '',
  'expected an empty string',
);

{
  const html = readFileSync(join(FIXTURES, files[0]), 'utf8');
  const out = renderPortableText(toPortableText(html));
  const again = renderPortableText(toPortableText(html));
  check('serializer is deterministic', out === again, 'two renders of the same input differ');
}

console.log();
if (failures) {
  console.error(`${failures} assertion(s) failed\n`);
  process.exit(1);
}
console.log('serializer ok\n');
