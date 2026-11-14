/**
 * Minimal HTML span scanning, shared by the extractor and the seam inspector.
 *
 * Both need to find a balanced element subtree by class and cut it out by byte
 * offset. Webflow's output is regular enough that a parser would be a
 * dependency for one job — but the two copies of this logic drifted once
 * already, so it lives here now.
 *
 * WHY `hasClass` IS NOT A `\b` REGEX
 *
 * It was, and it was wrong in a way that took a while to see. `\bfooter\b`
 * matches `class="footer-header"`, because `-` is a non-word character and so
 * counts as a word boundary. Combined with the scanner returning spans in
 * CLOSE order — innermost first — asking for `div.footer` returned the
 * 184-byte logo wrapper nested inside it.
 *
 * The result still rendered correctly, which is the worst part: the real footer
 * stayed in every page's HTML and the marker landed in the middle of it, so the
 * output was byte-for-byte plausible and the structural verifier passed. The
 * only symptom was a "shared" footer file that was obviously too small to be a
 * footer.
 *
 * So: match a whitespace-delimited class token exactly, and let callers ask for
 * the OUTERMOST match rather than whichever closed first.
 */

const VOID = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

/**
 * Every balanced element span in `src`, sorted by start offset, each carrying
 * its nesting depth and its verbatim opening tag.
 */
export function scanSpans(src) {
  const tagRe = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)\b([^>]*)>/g;
  const stack = [];
  const spans = [];
  let m;
  while ((m = tagRe.exec(src)) !== null) {
    const [full, closing, rawTag, attrs] = m;
    const tag = rawTag.toLowerCase();
    if (VOID.has(tag) || attrs.endsWith('/')) continue;
    if (!closing) {
      stack.push({ tag, attrs, open: full, start: m.index, depth: stack.length });
    } else {
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].tag === tag) {
          spans.push({ ...stack[i], end: m.index + full.length });
          stack.length = i;
          break;
        }
      }
    }
  }
  return spans.sort((a, b) => a.start - b.start);
}

/** Does this element's class attribute contain `cls` as a whole token? */
export function hasClass(attrs, cls) {
  const value = /class="([^"]*)"/.exec(attrs)?.[1];
  if (!value) return false;
  return value.split(/\s+/).includes(cls);
}

/**
 * The OUTERMOST span matching tag + class.
 *
 * Outermost, not first: a page shell element usually contains descendants with
 * related class names, and the caller wants the container. Spans are sorted by
 * start offset, so the first match is already the outermost of any nested set —
 * but the filter is explicit so the intent survives a refactor.
 */
export function findSpan(spans, tag, cls) {
  const matches = spans.filter((s) => s.tag === tag && hasClass(s.attrs, cls));
  if (matches.length === 0) return undefined;
  return matches.find((s) => !matches.some((o) => o !== s && o.start < s.start && o.end > s.end));
}

export { VOID };
