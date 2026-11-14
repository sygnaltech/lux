import fs from 'node:fs';
import path from 'node:path';
import {parseEnv} from 'node:util';
import project from './lib/project.mjs';
import {ROOT as root} from './lib/env.mjs';

const studio = process.argv.includes('--studio');
const key = studio ? 'SANITY_STUDIO_DATASET' : 'SANITY_DATASET';
const projectKey = studio ? 'SANITY_STUDIO_PROJECT_ID' : 'SANITY_PROJECT_ID';
const envDirIndex = process.argv.indexOf('--env-dir');
if (envDirIndex !== -1 && (!process.argv[envDirIndex + 1] || process.argv[envDirIndex + 1].startsWith('--'))) {
  throw new Error('--env-dir requires the app env directory relative to the repository root');
}
const siteEnvDir = envDirIndex === -1 ? root : path.resolve(root, process.argv[envDirIndex + 1]);
const sources = [['shell', process.env]];
for (const base of studio ? [root, path.join(root, 'studio')] : [...new Set([root, siteEnvDir])]) {
  for (const name of ['.env', '.env.local', '.env.production', '.env.production.local']) {
    const file = path.join(base, name);
    if (fs.existsSync(file)) sources.push([path.relative(root, file), parseEnv(fs.readFileSync(file, 'utf8'))]);
  }
}
const errors = [];
if (project.sanity.dataset !== 'production') errors.push('project.jsonc sanity.dataset must be production');
for (const [source, env] of sources) {
  if (env[key] && env[key] !== 'production') errors.push(`${source}: ${key} must be production or empty`);
  if (env[projectKey] && env[projectKey] !== project.sanity.projectId) errors.push(`${source}: ${projectKey} differs from project.jsonc`);
}
if (errors.length) {
  console.error(`Deployment blocked:\n${errors.join('\n')}`);
  process.exit(1);
}
console.log(`Production dataset guard passed (${studio ? 'Studio' : 'site'}).`);
