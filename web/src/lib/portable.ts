/**
 * Portable Text -> HTML, rendered into Webflow's own rich-text wrapper.
 *
 * THE HIGHEST-LEVERAGE TRICK IN THE WHOLE MIGRATION: the output is wrapped in
 * `<div class="w-richtext">`, which is the class Webflow puts on every rich-text
 * field it renders. The ported stylesheet already has complete rules for
 * `.w-richtext p`, `.w-richtext h2`, `.w-richtext ul` and the rest — so a
 * paragraph coming out of Sanity is indistinguishable from one Webflow
 * rendered, with NO new CSS written. Drop the wrapper and every CMS region on
 * the site loses its typography at once.
 *
 * Hand-written rather than @portabletext/to-html: the input is one generator's
 * output over a bounded corpus (styles normal/h2/h3/blockquote, marks strong
 * and link, bullet and numbered lists), and the bar is not "reasonable" — it is
 * that the client's published wording survives exactly. That is asserted by
 * `npm test`, which runs the real pipeline over real fixtures:
 * Webflow HTML -> Portable Text -> HTML, comparing visible characters.
 *
 * ESCAPES EVERYTHING. Content is data, never markup — a `<script>` in a review
 * body renders as text.
 */

export interface PortableSpan {
  _type: 'span';
  _key?: string;
  text: string;
  marks?: string[];
}

export interface PortableMarkDef {
  _key: string;
  _type: string;
  href?: string;
}

export interface PortableBlock {
  _type: string;
  _key?: string;
  style?: string;
  listItem?: 'bullet' | 'number';
  level?: number;
  markDefs?: PortableMarkDef[];
  children?: PortableSpan[];
}

export interface RenderOptions {
  /**
   * Wrapper class. Defaults to Webflow's own `w-richtext` — see the note above
   * before changing it. Pass `null` for no wrapper, e.g. when the surrounding
   * ported markup already provides one.
   */
  wrapper?: string | null;
}

/** `&` first, or the other replacements get double-escaped. */
const esc = (s: string): string =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** Heading styles the schema allows. `h1` is never emitted — the page owns it. */
const HEADINGS = new Set(['h2', 'h3', 'h4', 'h5', 'h6']);

const DECORATOR_TAGS: Record<string, string> = {
  strong: 'strong',
  em: 'em',
  underline: 'u',
  'strike-through': 's',
  code: 'code',
};

/**
 * One span, with its decorators and at most one annotation.
 *
 * Decorators nest in a FIXED ORDER (the order of `DECORATOR_TAGS`) rather than
 * the order they appear in `marks`, so the same input always produces the same
 * bytes. Sanity does not guarantee mark order, and a serializer that follows it
 * makes every re-render a spurious diff.
 */
function renderSpan(span: PortableSpan, markDefs: PortableMarkDef[]): string {
  if (!span.text) return '';

  let html = esc(span.text);
  const marks = span.marks ?? [];

  for (const [mark, tag] of Object.entries(DECORATOR_TAGS)) {
    if (marks.includes(mark)) html = `<${tag}>${html}</${tag}>`;
  }

  // An annotation is a mark whose name matches a markDef key.
  for (const mark of marks) {
    const def = markDefs.find((d) => d._key === mark);
    if (!def) continue;
    if (def._type === 'link' && def.href) {
      // No `target` is added. Webflow's own rich-text links carry none, so
      // adding one would be a behaviour change dressed up as a port — and a
      // `target="_blank"` without `rel="noopener"` leaks `window.opener`.
      html = `<a href="${esc(def.href)}">${html}</a>`;
    }
  }

  return html;
}

function renderChildren(block: PortableBlock): string {
  return (block.children ?? []).map((c) => renderSpan(c, block.markDefs ?? [])).join('');
}

/**
 * A non-list block.
 *
 * `white-space: pre-line` on paragraphs that contain a newline is load-bearing.
 * The converter turns a `<br>` into a newline INSIDE one block rather than
 * splitting the block — which is correct, because Webflow uses `<br>` stacks
 * for spacing within a paragraph — but HTML collapses newlines, so without
 * this the lines run together into one. Applied only where there is a newline,
 * so it does not alter every other paragraph on the site.
 */
function renderTextBlock(block: PortableBlock): string {
  const inner = renderChildren(block);

  // An empty block renders as a dead, undeletable gap. Drop it.
  if (!inner.trim()) return '';

  const style = block.style ?? 'normal';
  if (HEADINGS.has(style)) return `<${style}>${inner}</${style}>`;
  if (style === 'blockquote') return `<blockquote>${inner}</blockquote>`;

  const multiline = (block.children ?? []).some((c) => c.text?.includes('\n'));
  return multiline
    ? `<p style="white-space:pre-line">${inner}</p>`
    : `<p>${inner}</p>`;
}

/**
 * Build nested lists from a flat run of listItem blocks.
 *
 * Portable Text expresses nesting as a `level` on each item, not as structure,
 * so the tree has to be rebuilt. A deeper list is emitted INSIDE the preceding
 * `<li>` — which is what browsers and the Webflow stylesheet both expect;
 * a sibling `<ul>` after a closed `<li>` is invalid and indents wrongly.
 *
 * Returns the HTML and the index of the first block it did not consume.
 */
function renderList(
  blocks: PortableBlock[],
  start: number,
  level: number,
): {html: string; next: number} {
  const kind = blocks[start].listItem === 'number' ? 'ol' : 'ul';
  const items: string[] = [];
  let i = start;

  while (i < blocks.length) {
    const block = blocks[i];
    const blockLevel = block.level ?? 1;

    if (!block.listItem) break;
    // A shallower item, or a switch between bullet and numbered at this level,
    // ends this list and is handled by the caller.
    if (blockLevel < level) break;
    if (blockLevel === level && (block.listItem === 'number' ? 'ol' : 'ul') !== kind) break;

    if (blockLevel > level) {
      // Deeper: nest inside the item just emitted. If there is no previous
      // item (a list that starts over-indented), open a synthetic one rather
      // than dropping the content.
      const nested = renderList(blocks, i, blockLevel);
      if (items.length === 0) items.push(nested.html);
      else items[items.length - 1] += nested.html;
      i = nested.next;
      continue;
    }

    items.push(`<li>${renderChildren(block)}</li>`);
    i += 1;
  }

  // `<li>…</li>` already carries its own tags; a nested list appended to the
  // previous item must sit before that item's closing tag.
  const fixed = items.map((item) =>
    item.startsWith('<li>') ? item.replace(/<\/li>(?=(?:<[uo]l>[\s\S]*)$)/, '') : item,
  );

  return {html: `<${kind}>${fixed.join('')}</${kind}>`, next: i};
}

export function renderPortableText(
  blocks: PortableBlock[] | undefined | null,
  options: RenderOptions = {},
): string {
  if (!Array.isArray(blocks) || blocks.length === 0) return '';

  const parts: string[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];

    if (block._type !== 'block') {
      // Nothing else is expected: this corpus produces only `block`. Skipping
      // rather than throwing keeps a future image block from breaking a build,
      // and `npm test`'s no-text-loss assertion would catch a real loss.
      i += 1;
      continue;
    }

    if (block.listItem) {
      const {html, next} = renderList(blocks, i, block.level ?? 1);
      parts.push(html);
      i = next;
      continue;
    }

    parts.push(renderTextBlock(block));
    i += 1;
  }

  const body = parts.filter(Boolean).join('');
  if (!body) return '';

  const wrapper = options.wrapper === undefined ? 'w-richtext' : options.wrapper;
  return wrapper ? `<div class="${wrapper}">${body}</div>` : body;
}
