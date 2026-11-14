/// <reference types="astro/client" />

/**
 * The project.jsonc values Vite inlines at build time.
 *
 * Declared so `astro check` does not reject them as undefined identifiers.
 * The substitution itself is configured in `vite.define` in
 * web/astro.config.mjs — a name declared here but missing from that block
 * type-checks and then fails at build as an undefined identifier, so the two
 * lists must be kept in step.
 */
declare const __PROJECT_WEBFLOW_SOURCE__: string;
declare const __PROJECT_SANITY_PROJECT_ID__: string;
declare const __PROJECT_SANITY_DATASET__: string;
declare const __PROJECT_SANITY_API_VERSION__: string;
