/**
 * Bind Sanity content into a frozen Webflow collection template.
 *
 * Webflow's published HTML carries NO marker on a CMS-bound element — no
 * `data-field`, nothing. The only way to find where a field was rendered is to
 * look for the SAMPLE item's own value, which is why every template is
 * extracted from one specific item and why that item's values are passed in
 * here alongside the target's.
 *
 * EVERY HELPER THROWS WHEN ITS HANDLE IS MISSING. That is the whole design.
 *
 * A silent fallback publishes the sample item's content on every page in the
 * collection — all six team pages showing one photograph, all thirteen
 * subareas one hero — and the structural verifier CANNOT catch it, because the
 * frozen markup is byte-identical to the live page's. The text is right, the
 * tag count is right, and the page is wrong. A build that fails loudly is the
 * only protection available.
 */

/** Escape a value the way Webflow's own renderer would have. */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export class BindError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BindError';
  }
}

/**
 * Replace every occurrence of a sample value with the target's.
 *
 * Deliberately replaces ALL occurrences: Webflow commonly renders the same
 * field more than once on a page (a title in the hero, again in a breadcrumb,
 * again in an `alt`). Replacing only the first leaves the sample's value
 * visible somewhere on every other page in the collection.
 *
 * `allowMissing` is for a field the sample item does not populate — there is
 * no handle to find, so there is nothing to bind and nothing is wrong.
 */
export function bindText(
  html: string,
  label: string,
  sampleValue: string | undefined | null,
  targetValue: string | undefined | null,
  {allowMissing = false}: {allowMissing?: boolean} = {},
): string {
  if (!sampleValue) {
    if (allowMissing) return html;
    throw new BindError(
      `${label}: the template's sample item has no value for this field, so there is no handle to bind to. ` +
        `Either pick a richer sample in migration-scripts/pages.config.mjs or mark this binding allowMissing.`,
    );
  }

  /**
   * Webflow does not escape the way we do, so try its spellings too.
   *
   * It emits `'` as `&#x27;` — so a title like "Ponsonby's New Radiology
   * Service" is NOT findable with our own escaping, and the binding fails on
   * the one page whose title contains an apostrophe while every other page in
   * the collection binds fine. Curly quotes get the same treatment.
   *
   * Order matters: the most-escaped form is tried first, so a template that
   * happens to contain both forms binds the one Webflow actually wrote.
   */
  const base = escapeHtml(sampleValue);
  const candidates = [
    base.replace(/'/g, '&#x27;'),
    base.replace(/'/g, '&#39;'),
    base,
    sampleValue,
  ];

  const needle = candidates.find((c) => html.includes(c));
  if (!needle) {
    throw new BindError(
      `${label}: sample value ${JSON.stringify(sampleValue.slice(0, 60))} is not in the template, ` +
        `in any of ${candidates.length} escapings. The template was probably re-extracted from a ` +
        `different item, or the field is no longer rendered.`,
    );
  }

  // Replace with the SAME escaping style the template used, so a page whose
  // value contains an apostrophe matches its neighbours byte for byte.
  const replacement = needle.includes('&#x27;')
    ? escapeHtml(targetValue ?? '').replace(/'/g, '&#x27;')
    : needle.includes('&#39;')
      ? escapeHtml(targetValue ?? '').replace(/'/g, '&#39;')
      : escapeHtml(targetValue ?? '');

  return html.split(needle).join(replacement);
}

/**
 * Swap an `<img>`'s source, and STRIP `srcset`/`sizes` on the same tag.
 *
 * Webflow generates a responsive set of its own CDN derivatives. Those URLs do
 * not exist for a Sanity asset, and a stale `srcset` BEATS the `src` beside
 * it — so the browser keeps loading the sample item's image from Webflow and
 * the page looks correct while being both wrong and still dependent on the
 * account we are leaving. This is the single most likely mistake in §6.
 */
export function bindImage(
  html: string,
  label: string,
  sampleSrc: string | undefined | null,
  targetSrc: string | undefined | null,
  {allowMissing = false}: {allowMissing?: boolean} = {},
): string {
  if (!sampleSrc) {
    if (allowMissing) return html;
    throw new BindError(`${label}: no sample image source to bind against.`);
  }

  const tagRe = new RegExp(`<img\\b[^>]*?src="${sampleSrc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`, 'g');
  const matches = html.match(tagRe);
  if (!matches) {
    throw new BindError(
      `${label}: no <img> in the template with src="${sampleSrc}". ` +
        `The template may have been re-extracted, or this image is set in CSS rather than an <img>.`,
    );
  }

  return html.replace(tagRe, (tag) => {
    let out = tag
      .replace(/\s+srcset="[^"]*"/g, '')
      .replace(/\s+sizes="[^"]*"/g, '')
      .replace(/\s+data-w-id="[^"]*"/g, (m) => m); // keep: CSS targets generated ids
    if (!targetSrc) {
      // No image on this document. Leave the element but blank the source
      // rather than emitting the sample's — a missing image is visible and
      // fixable; the wrong person's photograph is neither.
      return out.replace(/src="[^"]*"/, 'src="" alt=""');
    }
    return out.replace(/src="[^"]*"/, `src="${escapeHtml(targetSrc)}"`);
  });
}

/**
 * Replace the inner HTML of the Nth `.w-richtext` region.
 *
 * `.w-richtext` is the one reliable structural handle Webflow gives us: it is
 * the class it puts on every rendered rich-text field. Index is in document
 * order, zero-based.
 *
 * The replacement should come from `renderPortableText(..., {wrapper: null})`
 * — the surrounding `.w-richtext` div is already in the template, so wrapping
 * again would nest two of them and double the inherited padding.
 */
export function bindRichText(
  html: string,
  label: string,
  index: number,
  innerHtml: string,
): string {
  const open = /<div[^>]*\bclass="[^"]*\bw-richtext\b[^"]*"[^>]*>/g;
  const opens = [...html.matchAll(open)];

  if (opens.length <= index) {
    throw new BindError(
      `${label}: template has ${opens.length} .w-richtext region(s); index ${index} was requested.`,
    );
  }

  const match = opens[index];
  const start = match.index! + match[0].length;

  // Walk to the matching close, counting nested divs.
  let depth = 1;
  let i = start;
  const tag = /<\/?div\b[^>]*>/g;
  tag.lastIndex = start;
  let m: RegExpExecArray | null;
  while ((m = tag.exec(html)) !== null) {
    depth += m[0].startsWith('</') ? -1 : 1;
    if (depth === 0) {
      i = m.index;
      break;
    }
  }
  if (depth !== 0) {
    throw new BindError(`${label}: unbalanced divs inside .w-richtext region ${index}.`);
  }

  return html.slice(0, start) + innerHtml + html.slice(i);
}

/**
 * Swap a CSS `background-image` URL inside a `style` attribute.
 *
 * Webflow renders some CMS images as an `<img>` and others as an inline
 * background — on this site the category hero is a background on
 * `div.hero-image` while the category icon beside it is an `<img>`. There is
 * no way to tell from the content model which it will be; only the template
 * says.
 *
 * NOTE THE ESCAPED QUOTES. Inside an HTML attribute the CSS reads
 * `url(&quot;...&quot;)`, so a pattern written for a stylesheet finds nothing
 * here. This is the same trap that made six assets look like Webflow 403s
 * during §5.
 */
export function bindBackgroundImage(
  html: string,
  label: string,
  sampleUrl: string,
  targetUrl: string | undefined | null,
): string {
  const escaped = sampleUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // Both the escaped-quote form (inside a style attribute) and the plain form.
  const re = new RegExp(`(background-image:\\s*url\\((?:&quot;|&#0*34;|["'])?)${escaped}`, 'g');

  if (!re.test(html)) {
    throw new BindError(
      `${label}: no background-image url() in the template pointing at "${sampleUrl}". ` +
        `It may be an <img> instead — use bindImage — or the template was re-extracted.`,
    );
  }
  re.lastIndex = 0;

  // No image on this document: leave the declaration but point it at nothing
  // rather than at the sample's photograph.
  const replacement = targetUrl ? escapeHtml(targetUrl) : '';
  return html.replace(re, (_m, prefix) => `${prefix}${replacement}`);
}

/** Visible text of an HTML fragment, collapsed — for matching, not display. */
const plainOf = (html: string): string =>
  html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();

/** Every `.w-richtext` region with its balanced inner bounds. */
function richTextRegions(html: string): Array<{start: number; end: number}> {
  const open = /<div[^>]*\bclass="[^"]*\bw-richtext\b[^"]*"[^>]*>/g;
  const out: Array<{start: number; end: number}> = [];

  for (const match of [...html.matchAll(open)]) {
    const start = match.index! + match[0].length;
    let depth = 1;
    const tag = /<\/?div\b[^>]*>/g;
    tag.lastIndex = start;
    let m: RegExpExecArray | null;
    let end = -1;
    while ((m = tag.exec(html)) !== null) {
      depth += m[0].startsWith('</') ? -1 : 1;
      if (depth === 0) {
        end = m.index;
        break;
      }
    }
    if (end !== -1) out.push({start, end});
  }
  return out;
}

/**
 * Replace the `.w-richtext` region that currently holds the SAMPLE's content.
 *
 * Preferred over `bindRichText`'s positional index. A service template has six
 * `.w-richtext` regions — the service description, the category's booking note
 * and four pieces of static furniture — and which index is which is not
 * obvious, not stable across a re-extraction, and wrong in a way that renders
 * perfectly: bind the description into the booking-note slot and both regions
 * still look like prose.
 *
 * Matching on content makes the binding say what it means, and makes a
 * template change a build failure instead of a content swap.
 */
export function bindRichTextByContent(
  html: string,
  label: string,
  sampleRendered: string,
  innerHtml: string,
): string {
  const wanted = plainOf(sampleRendered).slice(0, 60);
  if (!wanted) {
    throw new BindError(`${label}: the sample's rich text is empty, so there is no handle to match.`);
  }

  const regions = richTextRegions(html);
  const hits = regions.filter((r) => plainOf(html.slice(r.start, r.end)).startsWith(wanted));

  if (hits.length === 0) {
    throw new BindError(
      `${label}: no .w-richtext region starts with the sample's text ` +
        `${JSON.stringify(wanted.slice(0, 40))}. Template re-extracted, or the field is no longer rendered.`,
    );
  }
  if (hits.length > 1) {
    throw new BindError(
      `${label}: ${hits.length} .w-richtext regions match the sample's text — the handle is ambiguous.`,
    );
  }

  const {start, end} = hits[0];
  return html.slice(0, start) + innerHtml + html.slice(end);
}

/**
 * Remove an element subtree by class, for a region the target document has no
 * content for. Throws if the class is not present — an optional region that
 * silently is not there is a template that changed under us.
 */
export function removeByClass(html: string, label: string, cls: string): string {
  const open = new RegExp(`<div[^>]*\\bclass="[^"]*\\b${cls}\\b[^"]*"[^>]*>`);
  const match = open.exec(html);
  if (!match) throw new BindError(`${label}: no div.${cls} to remove.`);

  const start = match.index;
  let depth = 1;
  const tag = /<\/?div\b[^>]*>/g;
  tag.lastIndex = start + match[0].length;
  let m: RegExpExecArray | null;
  let end = -1;
  while ((m = tag.exec(html)) !== null) {
    depth += m[0].startsWith('</') ? -1 : 1;
    if (depth === 0) {
      end = m.index + m[0].length;
      break;
    }
  }
  if (end === -1) throw new BindError(`${label}: unbalanced divs around div.${cls}.`);
  return html.slice(0, start) + html.slice(end);
}
