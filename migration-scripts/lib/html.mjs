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

/**
 * The INNERMOST `tag` span that wraps an element carrying class `childCls`.
 *
 * For shell elements that have NO class of their own. Webflow emits these
 * routinely: on the site this was added for, every page begins
 * `<body><div><div class="mobile-navigation …">`, where that bare `<div>` is
 * the entire navigation region — a mobile navbar, a desktop navbar, a sticky
 * scroll navbar, a mobile section and an alert bar, all as siblings inside it.
 * There is no class anywhere that covers the set, so `findSpan` cannot address
 * it and the whole region would otherwise land in every page's main fragment.
 *
 * INNERMOST, not outermost — the opposite of `findSpan`, and deliberately so.
 * Every ancestor up to `<body>` also "contains" the marker child, so the
 * outermost match is whatever the page's top-level wrapper happens to be. On
 * that same site one page nests everything in `div.page_wrapper`, so asking
 * for the outermost would have returned the entire page there and the nav
 * region everywhere else — a difference that only shows up as a shared-shell
 * mismatch on one page out of eighteen.
 *
 * Pick `childCls` to be a class that appears ONCE inside the intended wrapper
 * and nowhere above it.
 */
export function findSpanWrapping(spans, tag, childCls) {
  const marker = spans.find((s) => hasClass(s.attrs, childCls));
  if (!marker) return undefined;

  /**
   * STRICTLY outside the marker — `<` and `>`, never `<=` and `>=`.
   *
   * The marker is usually the same tag as its wrapper (a `div` inside a
   * `div`), so a non-strict comparison matches the marker ITSELF and, being
   * the innermost match, wins. The wrapper is then never found and the
   * "shared" fragment is just the marker element.
   *
   * That was written `<=` first and the symptom was a nav.html of 2,897 bytes
   * instead of 10,277 — the mobile navbar alone, with the rest of the nav
   * region left duplicated in every page's main fragment. It RENDERED
   * PERFECTLY, so the only signal was a shared file too small to be a nav.
   * Exactly the `\bfooter\b` failure described above, via a different route.
   */
  const candidates = spans.filter(
    (s) => s.tag === tag && s.start < marker.start && s.end > marker.end,
  );
  if (candidates.length === 0) return undefined;

  // Innermost = the latest-starting strict ancestor.
  return candidates.reduce((best, s) => (s.start > best.start ? s : best));
}

export { VOID };
