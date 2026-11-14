/**
 * The user-agent every script sends when fetching the live Webflow site.
 *
 * Fixed, not configured: it only needs to be identifiably ours rather than an
 * unexplained scraper in the client's Webflow logs, and to say which stage made
 * the request. Nothing about it varies per site, so it is not config.
 */
export const userAgent = (stage) => `Mozilla/5.0 (webflow-sanity-migration; ${stage})`;
