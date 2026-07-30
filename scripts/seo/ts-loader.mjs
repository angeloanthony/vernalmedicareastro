// scripts/seo/ts-loader.mjs — lets plain Node import the site's TypeScript data.
//
// Node 24 strips TS types natively, but it does NOT do TypeScript-style
// extension resolution: `import { TOWNS } from './towns'` fails because Node
// requires a full specifier. src/data/*.ts uses extensionless imports
// throughout, so we register one resolve hook that appends `.ts` / `/index.ts`.
//
// Deliberately does NOT set `format` — returning `format: 'module'` would tell
// Node the file is plain JS and skip type stripping, which fails on the first
// `import type {...}` line.
//
// Import this module for side effects BEFORE importing anything under src/.

import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HAS_EXT = /\.(m|c)?(j|t)sx?$/;

registerHooks({
  resolve(specifier, context, nextResolve) {
    const parent = context.parentURL;
    if (specifier.startsWith('.') && !HAS_EXT.test(specifier) && parent?.startsWith('file:')) {
      const base = path.resolve(path.dirname(fileURLToPath(parent)), specifier);
      for (const candidate of [`${base}.ts`, path.join(base, 'index.ts')]) {
        if (existsSync(candidate)) {
          return { url: pathToFileURL(candidate).href, shortCircuit: true };
        }
      }
    }
    return nextResolve(specifier, context);
  },
});

/** Import a project-relative TypeScript module (e.g. 'src/data/pageIndex.ts'). */
export function importTs(relPath) {
  return import(pathToFileURL(path.resolve(relPath)).href);
}
