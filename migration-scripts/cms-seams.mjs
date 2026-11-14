/**
 * Inventory every Webflow collection-list region in the ported HTML, and dump
 * each one's item template.
 *
 *   node migration-scripts/cms-seams.mjs            # report
 *   node migration-scripts/cms-seams.mjs --dump     # also write migration/seams/*.html
 *
 * WHY THIS EXISTS
 *
 * A CMS route works by cutting the ported body at a `.w-dyn-list` and rendering
 * Sanity content into the gap. Getting that right means knowing, exactly:
 *
 *   - which lists a page has, and in what document order
 *   - the WHOLE opening tag of the wrapper and of the `.w-dyn-items` inside it,
 *     attributes included — Webflow puts grid placement in generated
 *     `#w-node-*` ids, so a hand-typed wrapper silently collapses the layout
 *   - the markup of ONE item, to transcribe into an Astro component
 *   - whether a list is NESTED inside another list's item, which changes it
 *     from "one seam" into "a seam inside a repeated template"
 *
 * `--dump` writes the item templates so the card components can be transcribed
 * from real markup rather than reconstructed from a screenshot. migration/seams/
 * is gitignored; it is scratch, re-derivable from this script.
 *
 * LAYOUT: `WEB` assumes the Astro app sits in `web/`. In a single-package repo,
 * point it at ROOT instead.
 */
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { scanSpans, hasClass } from './lib/html.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WEB = join(ROOT, 'web');
const HTML_DIR = join(WEB, 'src/html');
// migration/ is shared and stays at the root, so this one straddles: it reads
// the site's markup and writes the migration record.
const OUT = join(ROOT, 'migration/seams');

const dump = process.argv.includes('--dump');

const classOf = (attrs) => /class="([^"]*)"/.exec(attrs)?.[1] ?? '';
const idOf = (attrs) => /\bid="([^"]*)"/.exec(attrs)?.[1];

const files = (await readdir(HTML_DIR)).filter((f) => f.startsWith('main.') && f.endsWith('.html'));

if (dump) await mkdir(OUT, { recursive: true });

const report = [];

for (const file of files.sort()) {
  const slug = file.replace(/^main\./, '').replace(/\.html$/, '');
  const html = await readFile(join(HTML_DIR, file), 'utf8');
  const spans = scanSpans(html);

  const lists = spans.filter((s) => hasClass(s.attrs, 'w-dyn-list'));
  if (lists.length === 0) continue;

  for (const [i, list] of lists.entries()) {
    // Nested when another list fully contains this one.
    const parent = lists.find((o) => o !== list && o.start < list.start && o.end > list.end);

    const items = spans.find(
      (s) => hasClass(s.attrs, 'w-dyn-items') && s.start > list.start && s.end < list.end,
    );
    const firstItem = items
      ? spans.find(
          (s) => hasClass(s.attrs, 'w-dyn-item') && s.start > items.start && s.end < items.end,
        )
      : undefined;
    // Count only DIRECT children of this list's items wrapper.
    //
    // An earlier version excluded any item nested inside another `w-dyn-item`
    // anywhere on the page, which is wrong wherever a parent collection renders
    // its children inline: a child item is legitimately inside a parent item,
    // so every nested list reported zero and looked empty. Depth is the
    // reliable test — the span scanner already records it.
    const itemCount = items
      ? spans.filter(
          (s) =>
            hasClass(s.attrs, 'w-dyn-item') &&
            s.start > items.start &&
            s.end < items.end &&
            s.depth === items.depth + 1,
        ).length
      : 0;
    const empty = spans.find(
      (s) => hasClass(s.attrs, 'w-dyn-empty') && s.start > list.start && s.end < list.end,
    );

    report.push({
      slug,
      index: i,
      wrapperClass: classOf(list.attrs),
      wrapperId: idOf(list.attrs),
      itemsClass: items ? classOf(items.attrs) : null,
      itemCount,
      hasEmptyState: Boolean(empty),
      nestedIn: parent ? classOf(parent.attrs) : null,
    });

    if (dump && firstItem) {
      const name = `${slug}.${i}${parent ? '.nested' : ''}.html`;
      await writeFile(
        join(OUT, name),
        [
          `<!-- ${slug} list ${i}${parent ? ` (nested in .${classOf(parent.attrs)})` : ''} -->`,
          `<!-- wrapper: ${list.open} -->`,
          `<!-- items:   ${items?.open ?? '(none)'} -->`,
          '',
          html.slice(firstItem.start, firstItem.end),
          '',
        ].join('\n'),
        'utf8',
      );
    }
  }
}

const pad = (s, n) => String(s ?? '—').padEnd(n);
console.log();
console.log(
  `${pad('page', 20)}${pad('#', 3)}${pad('wrapper class', 30)}${pad('items', 7)}${pad('empty', 7)}nested in`,
);
console.log('-'.repeat(100));
for (const r of report) {
  console.log(
    `${pad(r.slug, 20)}${pad(r.index, 3)}${pad(r.wrapperClass.replace(' w-dyn-list', ''), 30)}${pad(r.itemCount, 7)}${pad(r.hasEmptyState ? 'yes' : 'no', 7)}${r.nestedIn ? `.${r.nestedIn.replace(' w-dyn-list', '')}` : '—'}`,
  );
}

const nested = report.filter((r) => r.nestedIn).length;
console.log(
  `\n${report.length} list region(s) across ${new Set(report.map((r) => r.slug)).size} page(s)` +
    `${nested ? `, ${nested} nested` : ''}`,
);
if (dump) console.log(`      item templates -> migration/seams/\n`);
else console.log(`      re-run with --dump to write the item templates\n`);
