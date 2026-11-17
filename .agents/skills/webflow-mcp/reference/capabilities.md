# Webflow MCP — capability & limitation map

Derived from a live capability audit (exercised against a real site, not
schema-only) on 2026-05-10, reconciled to MCP v2.0.1 naming. The MCP is a
**curated subset** of the public Webflow APIs, not a 1:1 wrapper. Legend:
✅ works · ⚠️ works with a catch · ❌ absent.

> **Version reconciliation (read first).** The tables below reflect a
> **2026-05-10 audit of the *production* endpoint (Data API v2.0.0)**. On
> **2026-05-12** the beta endpoint — which became the **2.0.x** line this skill
> targets — added capabilities the production audit recorded as absent. As of
> **MCP v2.0.1** the following ARE available and **override the "absent/limited"
> cells below**:
> - **Component props** — `data_component_props_tool` create/update/remove; 10
>   types (textContent, string, richText, image, link, video, number, boolean,
>   id, altText); per-instance override via `set_component_instance_prop_values`.
>   *(Independently confirmed by Webflow's 2.0.1 tool list.)*
> - **Component variants** — `data_component_variants_tool` create/duplicate/
>   delete/rename + per-variant style overrides. *(Confirmed by 2.0.1 tool list.)*
> - **Blank component scaffold** — `create_blank_component` + `open_canvas` build
>   a definition without the `transform_element_to_component` dance.
> - **Component slots** — `element_builder type:"ComponentSlot"` inside a
>   component's `open_canvas`.
> - **Element→prop binding** — `open_canvas` → `get_bindable_sources` →
>   `set_settings` with `binding{source_type:"prop", prop_id}`.
> - **Branches** — `data_pages_tool` create/list/delete branches.
> - **Sitemap control** — `data_sitemap_tool` per-page / per-item inclusion.
> - **Hosted scripts + site-/page-level apply** — `data_scripts_tool` beyond
>   inline. *(Conflicts with the production audit's "inline-only"; lower
>   confidence — verify against `webflow_guide_tool` on your endpoint.)*
>
> Everything else in the audit — CMS mechanics, the confirmed bugs, Designer
> fragility — still holds. When a cell conflicts with this note, **the note wins
> for 2.0.1.**

## Coverage at a glance

| Capability area | Data API | Designer | Notes |
|---|---|---|---|
| Sites — list, get, publish | ✅ | n/a | No create/duplicate/delete |
| CMS — collections create/get/list | ✅ | n/a | **No delete/rename/duplicate** |
| CMS — fields (16 types) CRUD | ✅ | n/a | Update only changes name/help/required — **not type, options, or reference target** |
| CMS — items CRUD/archive/publish | ✅ | n/a | Staged-only writer; publish blocked until site first published |
| Pages — list, metadata, settings, content | ✅ | partial | Designer creates/switches; **no delete/duplicate** |
| Components — list/content/properties (read + per-locale write) | ✅ | ✅ | Definitions via `transform_element_to_component` **or `create_blank_component`**; **prop + variant CRUD available in 2.0.x** — see version note |
| Elements — read/query/create (32 types)/modify/delete | n/a | ✅ | Form fields placement-restricted; CMS-collection children rejected |
| Styles — class, combo, 7 breakpoints, 16 pseudo, variable-as-value | n/a | ✅ | Type compatibility enforced |
| Variables — collections, modes, 5 types, alias, custom CSS | n/a | ✅ | **Rename/delete are BETA and silently no-op** |
| Assets — list, folders, update meta, URL upload | partial | partial | **`upload_image_by_url` works; no binary/multipart upload, no delete, no folder delete/rename** |
| Custom code — inline register, per-page apply | partial | n/a | **No hosted-URL register; no site-level apply; delete-all only** |
| Webhooks — CRUD (17 triggers) | ✅ | n/a | `get_webhook` omits `lastTriggered` |
| Comments — read threads/replies | ✅ | n/a | Read-only by design |
| Enterprise — 301s, robots.txt, activity logs | ✅ (plan-gated) | n/a | Errors on non-Enterprise sites |
| Localization — secondary-locale content/props | ✅ | n/a | **Primary locale id is rejected** |
| **Forms** | ❌ | ❌ | Entirely missing |
| **Ecommerce** | ❌ | n/a | Entirely missing |
| **Users / Memberships** | ❌ | n/a | Entirely missing |
| **Interactions / Animations / Page Transitions** | ❌ | ❌ | **Not addressable at all** |
| **Backups, branches, versioning** | ❌ | ❌ | UI only |
| **Site-level SEO defaults / sitemap / favicon / 404** | ❌ | n/a | Missing |
| **Workspace** (site create/duplicate/delete/transfer) | ❌ | n/a | Missing |

## CMS (Data API) — the reliable core

- **Collections:** `get_collection_list` (lite), `get_collection_details`
  (full schema), `create_collection` (auto-creates required `Name` + `Slug`).
  No delete / rename / duplicate — duplicate is manual (read + create +
  per-field + per-item).
- **Creatable field types (16):** PlainText, RichText, Number, Color, DateTime,
  Email, Phone, Link, VideoLink, Switch, Image, MultiImage, File, Option
  (single-select), Reference, MultiReference.
- **Not creatable:** `Set` (multi-select), ecommerce fields (Sku/price),
  membership `User`.
- **`update_collection_field`** only changes displayName / helpText / isRequired.
  Cannot change field type, option list, reference target, or number precision —
  the only path is delete + recreate + re-migrate items.
- **Items** are always **staged** regardless of `isDraft:false`. There is no
  create-and-publish in one call. `publish_collection_items` returns
  `409 "The site is not published."` until the site has been whole-site
  published once. `update_collection_items` requires `name` and `slug` in
  `fieldData` even for partial updates.
- **Field-value gotchas:** `Option` writes need the option **id**, not the name.
  `VideoLink` is asymmetric — you write a URL string, the server stores a
  structured embed object; diff/sync tools must normalize. Every item carries a
  `cmsLocaleId` even on single-locale sites.

## Pages & components (Data API)

- Pages: list / metadata / settings / content all work; `update_page_settings`
  can move a page (`parentId`), set SEO/OG, draft/archived/members-only.
  **No delete, no duplicate, no set-homepage, no per-page publish, no branching.**
- Components: read (list/content/properties) is Data-API and needs no Designer.
  Writes are **per-locale value overrides only** and require a secondary locale.
  Create/delete only exist Designer-side.

## Scripts, webhooks, comments, enterprise (Data API)

- **Scripts:** `add_inline_site_script` — **inline only, 2000-char limit**,
  returns a hosted CDN URL. `upsert_page_script` replaces all app-applied
  scripts on a page. **No hosted-URL register, no site-level apply, no granular
  delete** (delete-all per page/site only). See gotchas for the
  `add_site_script` 404 bootstrap trap.
- **Webhooks:** full CRUD, 17 trigger types. `delete_webhook` hits the 204
  parse-error bug (succeeds anyway).
- **Comments:** read-only (`list_comment_threads`, replies). No create/resolve.
- **Enterprise:** 301 redirects, robots.txt, well-known, activity logs — all
  plan-gated; error on non-Enterprise sites.

## Designer surface — what's buildable

- **Elements (32 types)** buildable incl. Section, Container, DivBlock, Heading,
  TextBlock, Button, Link variants, RichText, CodeBlock, HtmlEmbed, Video,
  Tabs, Slider, Dropdown, DOM/custom-tag, Form (as FormWrapper), CMSCollection
  (as DynamoWrapper — hollow), ComponentSlot (only inside a component view).
  Form children are **placement-restricted** and a bad placement **fails the
  whole batch**.
- **Styles:** create base + combo, per-breakpoint (`xxl,xl,large,main,medium,
  small,tiny`) and per-pseudo (16), variable-as-value with **type compatibility
  enforced** (a Size variable is rejected on `padding`).
- **Variables:** create collections/modes and all 5 types (color, size, number,
  percentage, font-family) with static values, aliases, and custom CSS
  expressions. **Rename & delete are BETA and silently no-op; no
  collection/mode delete, no reorder, no move-between-collections.**
- **Components:** `transform_element_to_component` is the **only** definition-
  create path (build an element, then transform). `insert_component_instance`,
  `rename_component`, enter/exit component view all work. In **2.0.x**,
  `create_blank_component` also builds a definition directly, and **prop +
  variant CRUD** are available (`data_component_props_tool` /
  `data_component_variants_tool`) — see the version note at the top.

## What is completely missing (route to the Webflow UI)

Forms · Ecommerce · Memberships · binary/multipart asset upload (URL-based
`upload_image_by_url` **does** work) · asset/folder delete · granular script
delete · collection delete/rename/duplicate · field type change · CMS item
unpublish · item filter-by-field-value · page delete/duplicate · set-homepage ·
per-page publish · site-level SEO defaults/favicon/404 ·
Interactions/Animations/Page-Transitions · backups/versioning · **dynamic CMS
templating** (CMS Collection element cannot be bound; Collection Template pages
are not navigable via the MCP) · site create/duplicate/transfer/delete.

*(Removed from this list as of 2.0.x — now available; see the version note:
component prop/variant CRUD, blank component scaffold, branches, sitemap control,
and hosted/site-level scripts.)*
