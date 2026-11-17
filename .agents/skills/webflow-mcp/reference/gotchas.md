# Webflow MCP — confusion log & workarounds

Concrete traps hit during a real Webflow rebuild via the MCP, each with the
observed behavior and the workaround. **Behaviors are durable; exact tool names
are as of MCP v2.0.1 and should be re-confirmed against `webflow_guide_tool`.**
Ordered roughly worst-to-live-with first.

## Silent successes — the dangerous class

These return `success` (or an empty array treated as success) while doing
nothing. Never trust the response shape; verify state.

- **Batch CMS prop-value binding can no-op the whole instance.** Binding several
  component-instance props to CMS fields in one `set_component_instance_prop_values`
  call sometimes returns every prop with `hasOverride: false` (i.e. nothing
  bound) — reproducibly, on mixed-type batches (boolean + string + textContent).
  The *same call shape* works when the batch is all one type. **Workaround:**
  split into single-prop calls; each succeeds with `hasOverride: true`. Treat
  `hasOverride: false` in the response as "binding rejected," not "no override
  requested."
- **Type-incompatible bindings fail silently.** Binding a CMS **RichText** field
  to a `textContent` prop returns `success` with `hasOverride: false`. The prop's
  `bindableTo` (e.g. `["string","textContent","altText","id"]`) simply doesn't
  include `richText`. **Workaround:** check `bindableTo` first; match prop type to
  field type, or leave static.
- **Variable delete/rename no-op.** `delete_variable` / `rename_variable` (BETA)
  return `[]` and change nothing. There is no `delete_variable_collection` at
  all. **Workaround:** get variables right the first time; delete in the UI.
- **`switch_page` reports success without navigating** to Collection Template
  pages (see the CMS-template trap below).

## Timeouts can lie

- A Designer write that **times out client-side may have applied server-side.**
  Re-issuing a timed-out `insert_component_instance` batch produced **two** sets
  of instances. **Workaround:** after any timeout, query state
  (`query_elements` / `get_component` / list items) and re-issue only the
  actions that didn't land — never blind-retry.
- **`create_prop` with `type:"link"` + a default link hangs (~2 min) and fails.**
  The same prop **without** a default succeeds instantly. Link-with-default also
  appears to poison multi-prop batches. **Workaround:** create link props without
  defaults; set defaults later or in the UI. Prefer single-prop calls when a link
  prop is involved.

## Designer bridge fragility

- **The Designer tab must be foregrounded.** Any `designer_tool` / builder /
  style / variable call errors with a launch URL and "ensure the tab is active
  and in the foreground" the moment focus is lost. There is no headless mode.
- **Go serial.** Parallel Designer calls in one turn frequently time out one or
  more. Modify one thing at a time.
- **Page switches especially must be serial.** `switch_page` in the *same*
  message as an `insert_component_instance` (or any page-context call) races —
  the insert fires before the switch propagates and errors "Parent element not
  found." Send `switch_page` alone, wait, then the dependent call.

## Settings & binding model

- **Setting keys are per-element-type and differ from value types.** Binding a
  Heading's text uses key **`text`** (valueType `textContent`) — passing
  `"textContent"` as the key errors `not applicable to this element`. **Always**
  `get_settings`/`query_settings` on the element to read the real key before
  binding. Common keys: `text`, `domId`, `visibility`, `tag`, `assetId`,
  `altText`, `href`.
- **Spans have no `text` setting** — only `domId` and `visibility`. Their visible
  text lives in a child `String` node that is **not introspectable**
  (`get_settings` → "Could not resolve element data type"). **Workaround:** to
  make Span text bindable, replace it with a text-capable Block/TextBlock.
- **`richText` props only bind RichText nodes** — no fallback to plain text.
  For ordinary paragraph copy, define the prop as `textContent`
  (`bindableTo: ["string","textContent","altText","id"]`) and bind that.

## `data_whtml_builder` (WHTML) — the wrong tool for design

**Do not use WHTML for brand/design markup. Use it only for genuine external
HTML/CSS embeds** (a third-party widget). For design, build component-first with
granular tools (`create_style`, `element_builder`, components). WHTML reports
`success` while quietly mangling design work:

- **It silently drops whole style classes.** In one real build ~20% of the CSS
  classes (every Nav class) were never created — elements came back with
  `styleNames: []` and the page rendered as unstyled raw HTML, with `success`
  reported the whole time. **If you ever do use WHTML, audit every class name via
  `query_styles` afterward;** anything with empty properties or zero matches must
  be recreated by hand.
- **It stores CSS variable references as literal strings.** `color:
  var(--_brand---cream)` is saved verbatim as the string, so the Designer's
  variable UI doesn't recognize it and a renamed variable silently breaks it.
  Reference variables via `variable_as_value` instead (see below).
- **Descendant selectors are silently dropped.** `.footer__links a { … }` never
  applies. Put styles on the leaf class itself.
- **`::before` / `::after` pseudo-elements are dropped.** Add them separately
  with `update_style` and `pseudo:"before"`/`"after"`.
- **`@keyframes` are silently stripped.** Inject via a `data_scripts_tool` inline
  `<style>` block, or use Designer IX2 (not MCP-exposed anyway).
- **Vendor-prefixed properties (`-webkit-`, `-moz-`) are rejected** and abort the
  rest of that style — the style registers with zero properties. Put vendor CSS
  in head freeform code.
- **Form-element translation defaults are wrong.** A WHTML `<input>` with no
  `placeholder` lands with a literal `"Example text"` placeholder — set
  `placeholder=""` explicitly (or clear via `set_settings` after). A WHTML
  `<button>Label</button>` **loses its text** and defaults to "Submit"; the
  correct setting key is **`buttonText`** (not `value`, which errors), plus
  `loadingText` for the loading state.
- **Nested inline tags fail.** `<strong><em>…</em></strong>` renders the literal
  token `##INLINE1##` — WHTML can't represent nested inline runs (outer survives,
  inner is lost). One inline tag per run, or build with `element_builder`.
  Recovery: filter `element_filter:{text:"INLINE"}` and `set_text` each match.
- Images inserted as raw `<img>` become fake `imgraw` elements — see the Images
  section below.

## Styling model — variables & specificity

- **Always reference brand variables via `variable_as_value:"variable-<id>"` on
  `create_style`/`update_style`, never a raw `var(...)` string.** Variables are
  only emitted to page CSS when something references them *properly*; raw strings
  depend on someone else emitting them, don't show in the Designer variable UI,
  and break on rename. Variable CSS names also carry a long auto prefix
  (`--_brand---background`, not `--bg`).
- **`create_style` that fails on one invalid property still registers the style
  name with zero properties.** Retrying returns "A style named X already exists."
  **Recovery:** `update_style` the empty shell with the valid properties.
- **Set `font-family` explicitly on every text-bearing class.** Sites often have
  pre-existing tag styles (`default-h1`, custom `h1` with a set font) that win
  the specificity battle over inheritance — set every property explicitly rather
  than relying on cascade.
- **The Body element rejects styles** ("This element doesn't support styles").
  Style the body via its Body tag style, head freeform CSS, or a wrapper `div`.
- **No gradient or shadow variable *types*.** Variable types are Color, Size,
  Number, Percentage, FontFamily only — a Color variable rejects
  `linear-gradient(...)`. Apply gradients as raw `background` and shadows as raw
  `box-shadow` per style/element.
- **Variable batch limits.** The `variable_tool` `actions` array silently drops
  actions beyond ~23 items, and **mixed create/delete batches drop the deletes.**
  Split into smaller, homogeneous batches.
- **Deleted classes leave orphans.** Removing an element doesn't remove its style
  classes from the site stylesheet, so a later WHTML/build call may auto-rename
  the root class (`hero` → `hero-1`). Cosmetic — styling still resolves — but
  query the actual class name before restyling it.
- **Diagnostic:** `query_styles` with `include_properties:true` surfaces which
  properties are stored as raw `var(...)` strings (vs proper `variable_as_value`
  references) so you can convert them in one pass.
- **CMS RichText child tags can't be classed via the MCP.** The visible tags
  inside a RichText field (`h2`, `p`, `ul`, `blockquote`, `a`…) are render-time;
  `style_tool`/`create_style`/`update_style` are **single-class scoped and expose
  no nested selectors**. The Designer's native **Nested Selector** ("All H2"
  scoped under a wrapper) is the real fix; a `<style>` block in head freeform code
  (`.wrapper h2 {…}`) works but is debt (hardcoded values, FOUC risk, invisible in
  the Style Panel).

## Grid styles — never `update_style` an existing grid class

- **`update_style` on a style that includes `display:grid` / `grid-template-*`
  desyncs the Designer Grid panel's track metadata** — even re-applying the
  *identical* `grid-template-columns` leaves the CSS correct via the API but the
  Grid panel shows an empty column count and the tracks squish/misrender.
- **Rule:** creating a *new* grid class via `data_whtml_builder` `css` is fine;
  **updating an existing grid class is not.** To change a grid, build a new class
  or adjust it in the Designer (recovery from a desync requires a manual toggle of
  the Rows field in the Grid panel).

## Text elements — the reliable primitive

- **`set_text` silently no-ops on `DivBlock`, `TextBlock` (which is really a
  Block), and `BY_CUSTOM_TAG:"div"`.** All three yield an empty box or Webflow
  placeholder copy.
- **The reliable styled-text primitive is `BY_CUSTOM_TAG` with
  `custom_tag:"span"`** — it accepts `set_text` (creates a DOM span with a String
  child) and the class still applies. Give the class `display:block` so the span
  lays out on its own line (stat numbers over labels, eyebrows over headings).
- **`Paragraph` can't host child elements** ("Elements cannot be added to
  Paragraph elements") — hoist an inline link out to a sibling under the same
  prose container.
- **Inline emphasis in a `Heading`:** the type enum has no `Emphasized`; insert a
  `DOM`/`BY_CUSTOM_TAG` `em` as a child. `set_text` takes plain text only.
- **String text nodes can't be edited** via the API — remove and rebuild the
  parent, or insert a corrected sibling and drop the placeholder.

## Component instances & page build order

- **You cannot insert a sibling before/after a `ComponentInstance`** ("Cannot
  insert elements directly into a component instance"). Shared Topbar/Nav/Footer
  instances therefore can't be before/after anchors.
- **Workaround:** append everything to the body in order —
  Topbar → Nav → [middle sections] → Footer — inserting the Footer *last*.

## Images — real Image elements, never raw `<img>`

- **Never insert images via WHTML raw HTML.** An `<img src>` becomes a fake
  `type:"DOM"` `tag:"imgraw"` element: `set_image_asset` doesn't work on it, alt
  text isn't a real Webflow setting, the Designer Image panel doesn't control it,
  and it has no asset-library link. If you find `imgraw` nodes, build a real
  Image sibling and `remove_element` the fake.
- **Order of operations:** (1) check the destination's asset library first
  (`get_all_assets_and_folders`, `query:"all"`) — the asset is usually already
  there; (2) if genuinely absent, upload via `upload_image_by_url` (returns an
  `asset_id`) — don't hot-link external/legacy CDNs; (3) if the image is CMS
  content, bind the Image to the CMS field (`get_bindable_sources` with
  `value_type:"imageAsset"`, then `set_settings` cms binding); (4) create the
  Image with `element_builder type:"Image"` + `set_image_asset:{image_asset_id,
  alt_text}`; (5) style via `set_style.style_names` (`object-fit:cover`), not CSS
  on the tag.

## Scripts & head freeform code

- **`set_site_freeform_code` replaces the entire block.** Always
  `get_site_freeform_code` first, append your block, write the combined string
  back. (Google Fonts go here, `location:"head"`.)
- **Use head freeform CSS sparingly — no site-wide "safety-net" resets.** A broad
  `.brand-* a { color:inherit }` kills per-link semantics and can't be tuned per
  element. Fix each class on its own Webflow style.

## `element_snapshot_tool` is not a section-level verifier

- Snapshots come back **collapsed/wrong for any layout using `aspect-ratio`,
  `display:grid`, or `position:absolute`** even when the styles are correct.
  Simple single elements snapshot fine. **Verify whole sections via the Designer
  canvas or a published preview URL, not snapshots.**

## `data_element_builder` quirks

- **A `div`-tagged Block rejects new children** ("Elements cannot be added to Div
  Block elements") even though the guide says DivBlock can have children.
  `move_element` hits the **same** wall. Yet **WHTML-built** `div`s accept
  children at creation. **Workaround:** build container subtrees via
  `data_whtml_builder`, or create children in an accepting parent.
- **`type:"TextBlock"` produces a `Block`** (not "TextBlock") pre-filled with the
  Webflow placeholder "This is some text inside of a div block." — and the atomic
  `set_text` at creation is a **no-op**. **Workaround:** set text via
  `set_settings` (`key:"text"`) after creation.
- **`element_builder.settings.attributes` is rejected** as "not applicable" even
  though documented. **Workaround:** set custom attributes via
  `set_attributes` (formerly `add_or_update_attribute`) after creation.
- **`query_elements` text filter doesn't match builder-created text** (it lives
  in a child `String` node). WHTML-built text does match.

## CMS template pages — a hard wall

- **Collection Template pages are not navigable via the MCP.** `switch_page`
  returns success but stays put; `open_page_canvas` and `open_canvas` error.
  `data_sitemap_tool` also explicitly excludes template pages. **Dynamic
  CMS-driven page building is effectively UI-only.** **Workaround:** the human
  must open the template in the Designer page panel before any MCP composition;
  scope agent expectations accordingly.

## Delete / publish / locale mechanics

- **Every `204 No Content` delete throws `SyntaxError: "undefined" is not valid
  JSON` — but the delete succeeded** (`delete_collection_field`,
  `delete_collection_items`, `delete_webhook`). **Workaround:** ignore the parse
  error; verify by re-listing.
- **`create_collection_items` is staged-only** despite older `_live` naming; make
  items live with a separate `publish_collection_items`, which itself 409s until
  the **site** has been whole-site published once.
- **Localization writes reject the primary locale** — `update_static_content` /
  component content/props are secondary-locale-only; passing the primary locale
  id returns "The provided locale must be a secondary locale."
- **`add_site_script` 404s for a freshly registered script** ("Custom code block
  not found") until `set_site_scripts` has run once to create the underlying
  custom-code resource. **Workaround:** bootstrap the first apply with
  `set_site_scripts` (note: it **replaces** all applied scripts), then use
  additive `add_site_script`.

## Version / endpoint drift

- **Capabilities differ by endpoint and version.** The production guide hid
  variants, prop definitions, canvas navigation, comments and scripts that the
  beta guide exposed; action names change across versions (`element_builder` →
  `data_element_builder`, `get_image_preview(url)` →
  `get_asset_preview(asset_id)`, `add_or_update_attribute` → `set_attributes`,
  `set_id` → `set_dom_id`, `create_collection_items_live` →
  `create_collection_items`). **Workaround:** run `webflow_guide_tool` on the
  live endpoint at session start; never act on memorized names; version-stamp any
  derived skill.
