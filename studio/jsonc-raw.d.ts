/**
 * Type for Vite's `?raw` suffix, so `import projectSource from
 * '../project.jsonc?raw'` in sanity.config.ts type-checks.
 *
 * Vite returns the file's text. There is no runtime component to this
 * declaration — it exists purely so the Studio's TypeScript pass does not
 * reject the import.
 */
declare module '*.jsonc?raw' {
  const source: string;
  export default source;
}
