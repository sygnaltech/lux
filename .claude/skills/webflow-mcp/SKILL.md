---
name: webflow-mcp
description: >-
  Use when working with any Webflow site through the Webflow MCP server —
  CMS content, Designer canvas/elements/styles/variables/components, custom
  scripts, pages, or publishing. Covers the two-transport model (Data API vs
  Designer bridge), what the MCP can and cannot do, the confirmed bugs and
  their workarounds, and the operating discipline that keeps a session from
  silently corrupting a site. Load this before issuing Webflow MCP tool calls.
---

# Using the Webflow MCP effectively

> **Target version:** Webflow MCP **v2.0.1** (Data API v2.0.0 baseline).
> Source audit live-tested 2026-05-10; reconciled to 2.0.1 naming on
> 2026-07-22. **Tool names drift between MCP versions** — the *behaviors* in
> this skill are durable, but before you trust an exact tool/action name, call
> `webflow_guide_tool` on the live endpoint and confirm. Record the MCP version
> you actually worked against in any skill or notes you derive from this.

## The one thing to internalize first: there are two transports

The MCP is **not** one uniform API. It exposes two surfaces that behave nothing
alike operationally. Know which one every call lives on.

| | **Data tools** (REST) | **Designer tools** (UI bridge) |
|---|---|---|
| Tool prefix (2.0.1) | `data_*` | `data_*_builder`, `designer_tool`, `data_element_*`, `data_component_*`, `data_style_tool`, `data_variable_tool` |
| Auth | Site / workspace token | App linked **into an open Designer tab** |
| Designer must be open | **No** — headless | **Yes** — user clicks a launch link |
| Stability | Stable, fast | Sensitive to tab focus & parallel calls |
| Best for | CMS, scripts, webhooks, page settings, publishing | Building/modifying canvas, classes, variables, components |

**The single biggest UX gotcha:** every Designer-tool call hard-errors with a
launch URL (`https://<site>.design.webflow.com?app=<appId>`) until the user
clicks it **and keeps that tab in the foreground**. The bridge drops the moment
the tab loses focus or two Designer calls run in parallel. There is **no
headless Designer mode**. Content automation (Data API) has no such requirement.

## Golden operating rules

These are the hard-won rules. Violating them is how sessions silently corrupt a
site. Full detail + reproductions in [reference/gotchas.md](reference/gotchas.md).

1. **Keep the Designer tab foregrounded; issue Designer calls serially.**
   Parallel `designer_tool` / builder / style calls in one turn are the most
   common cause of timeouts.
2. **Treat a timed-out write as "may have succeeded."** Never blind-retry — a
   duplicate is worse than a gap. Query state (`query_elements`, `get_component`,
   list items) *first*, then re-issue only the actions that didn't land.
3. **`success` ≠ applied.** Several tools return success while doing nothing:
   batch prop-value CMS binding can no-op the whole instance (`hasOverride:
   false`), variable delete/rename silently no-op, `switch_page` reports success
   without navigating. Verify the actual state after every consequential write.
4. **Every `204`-style delete throws `"undefined" is not valid JSON` — but the
   delete succeeded.** Ignore the parse error; confirm by re-listing.
5. **Query settings before binding.** Setting *keys* (`text`, `domId`,
   `visibility`, `tag`) are per-element-type and differ from *value types*
   (`textContent`, `richText`). Ask `get_settings`/`query_settings` for the real
   key; don't assume. Spans have no `text` key at all.
6. **Check `bindableTo` before wiring a prop.** A `richText` prop only binds
   RichText nodes; ordinary paragraph copy needs a `textContent` prop. A
   type mismatch fails **silently**.
7. **Plan variables right the first time.** `delete_variable` / `rename_variable`
   are BETA no-ops and there is no collection-delete; cleanup is UI-only.
8. **Run `webflow_guide_tool` on the actual endpoint at session start.**
   Capabilities and action names differ across production/beta/version. Do not
   act on memorized tool names.
9. **Reference variables via `variable_as_value:"variable-<id>"`, never raw
   `var(...)` strings.** Raw strings don't register as variable references, don't
   show in the Designer variable UI, and break silently on rename.
10. **`data_whtml_builder` is for genuine HTML embeds only — never design work.**
    It reports success while silently dropping whole style classes, pseudo-
    elements, and vendor properties. Build design component-first with granular
    tools (`create_style` → `element_builder` → components).
11. **Never `update_style` an existing grid class.** Editing a `display:grid`
    style — even to the same value — desyncs the Designer Grid panel and squishes
    the layout. Create a new grid class instead, or adjust it in the Designer.
12. **Motion vs behavior:** Interactions/IX2/animations are not exposed by any MCP
    tool — build those in the Designer. Deterministic JS behaviors (tabs,
    accordions, counters, mobile-nav) go through `data_scripts_tool`.

## Before you start: is the task even possible?

A large fraction of "the MCP won't let me…" is because the capability genuinely
**does not exist**. Check [reference/capabilities.md](reference/capabilities.md)
before promising an outcome. The big absences:

- **Forms, Ecommerce, Memberships** — entirely absent from both transports.
- **Interactions / Animations / Page Transitions** — not addressable at all.
- **Binary asset upload** — no tool exists (rename/retag/folder only).
- **Dynamic CMS templating** — the Designer CMS Collection element is a hollow
  shell; you cannot bind it to a collection or add an item template, and
  Collection Template pages are not navigable via the MCP. This is UI-only.
- **Component definitions from scratch / component props via the stable API** —
  definitions only via `transform_element_to_component`; prop *definition* is
  beta-only and fragile.
- **Site lifecycle** — cannot create/duplicate/transfer/delete a site.

If the task lands on one of these, say so and route the human to the Webflow UI
rather than burning turns hunting for a tool that isn't there.

## Strongest use case: CMS content automation via the Data API

This is where the MCP shines and is reliable. To push CMS content end-to-end:

1. `data_cms_tool` create collection → fields → items.
2. Publish the **site once via the UI** (or `data_sites_tool > publish_site`)
   before `publish_collection_items` — it 409s on a never-published site.
3. Items are always **staged** (`create_collection_items` has no live variant);
   publish is a separate step.
4. Ignore the empty-body parse error on deletes; verify by re-listing.

## Reference material in this skill

- [reference/capabilities.md](reference/capabilities.md) — full coverage map:
  what works, what's partial, what's absent, per capability area.
- [reference/gotchas.md](reference/gotchas.md) — the confusion log: concrete
  reproductions, expected-vs-actual, and the workaround for each trap.
- [reference/components-and-binding.md](reference/components-and-binding.md) — the
  2.0.x component surface: props (10 types), variants, slots, the 3-step binding
  workflow, `set_settings`/`get_settings` semantics, CMS action naming, and bulk
  caps. Load this before building components or wiring props/CMS bindings.
