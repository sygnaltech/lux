# Components, props, variants & binding (MCP 2.0.x)

The component-authoring surface that the older production audit lacked. All of
this is available on the **2.0.x** line (formerly the beta endpoint). Tool names
are as observed on beta; the 2.0.1 equivalents are `data_component_props_tool` /
`data_component_variants_tool` — **verify against `webflow_guide_tool`**.

## Endpoint auth

- The beta endpoint (`mcp.webflow.com/beta/mcp`) requires **OAuth** — it exposes
  `authenticate` / `complete_authentication` and needs a browser approval before
  any tool is callable (production did not). **If tools won't call, check for a
  pending auth flow first.**

## Building component definitions

- Two paths: `transform_element_to_component` (convert a clean canvas element) **or
  `create_blank_component`** + `open_canvas` (build a definition directly).
- **`open_canvas({component_id | page_id})` switches the whole canvas context** —
  distinct from `open_component_view`, which edits one instance in place.
- **ComponentSlot:** `open_canvas` into the component, then `element_builder` with
  `type:"ComponentSlot"`.

## Props

- **`create_prop` — 10 types**, each with its own default group:
  - `textContent` / `string` / `richText` → `default_text`
  - `image` / `altText` / `id` → `default_text`
  - `number` → `default_number` (min / max / decimals)
  - `boolean` → `default_boolean` (true_label / false_label)
  - `link` → `default_link` (mode / to / to_element_id / open_in_new_tab /
    email_subject / rel)
  - `video` → `default_video` (src / title)
- **`prop_id` and `type` are immutable.** `clear_default_value:true` clears the
  default; pass `null` inside a per-type group to clear an individual constraint.
- **Per-instance values:** `get_component_instance_props` (read),
  `set_component_instance_prop_values` (flat `FlatPropValue` overrides),
  `reset_all_props_value`.
- **No standalone "list props" action** — discover via
  `get_component(options.includeProps ...)`.
- Historical trap (see gotchas): a `link` prop with a **default** can hang/poison
  a batch — create link props without defaults.

## Variants

- `create_variant`, `duplicate_variant`, `delete_variant`, `set_variant_name`,
  `set_variant_styles` (per-variant style overrides).
- **Variant style actions are keyed by `variant_id + style_name`, NOT
  `component_id`** — style names are global.
- **New variants are not auto-selected.** The **base variant can't be deleted.**
  Variant styles are *overrides*; any property left unset falls back to the base
  variant at render.
- **No standalone "list variants" action** — discover via
  `get_component(options.includeVariants ...)`.

## Binding — the durable 3-step

`open_canvas(component_id)` → `get_bindable_sources` (source types `prop`, `cms`,
`page`, `locale`, `localeItem`) → `set_settings` with
`binding:{ source_type, prop_id | ... }`.

- **`element_builder` can create elements pre-bound** via a `settings[]` array on
  each element schema (same shape as `set_settings`) — avoids the two-step
  create-then-bind.
- **`move_element` preserves bindings *and* styles** when relocating an existing
  element (delete + recreate loses them).
- **`set_tag` binding is allowed only on DOM and Heading elements.** `set_id` can
  be bound, but the stable `update_id_attribute` is static-only.

## Element settings (`set_settings` / `get_settings`)

- **`set_settings`: each setting takes exactly one of** `clear:true`, `binding`,
  or a static value group (`static_text` / `static_number` / `static_boolean` /
  `static_link` / `static_video`).
- **The `"attributes"` key REPLACES the element's entire attribute list** — it is
  not a merge. Read-modify-write if you mean to add one attribute.
- **`get_settings` has three modes:** `all_raw_settings` (stored values + binding
  metadata), `all_resolved_settings` (bindings evaluated), `query_settings`
  (filtered `ElementSetting` entries).

## CMS action naming & scope

- **`create_collection_items`** (beta) — was `create_collection_items_live`
  (production); the `_live` suffix was dropped.
- **`unpublish_collection_items`** reverts live items to draft — distinct from
  `delete_collection_items`, which deletes the draft.
- **`set_component_metadata` is preferred over `rename_component`.**

## Bulk caps & staging

- **Sitemap bulk ops cap at 100 items, and sitemap updates are staged — publish
  afterward.** CMS unpublish is up to 100 per call. Comment reply content is
  1–2040 chars.

## Comments → navigation

- A comment's `elementId` gives an `{element, component}` pair usable with
  `switch_page` + `query_element` to jump to the commented element.
