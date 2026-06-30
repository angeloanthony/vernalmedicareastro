// Flat ESLint config. Scoped to the TypeScript layer only — `.astro` pages and
// layouts are covered by `astro check`, not ESLint, so legacy templates don't
// gate the lint. As folders graduate from scaffold to real code, they're already
// in scope via src/{lib,config,types,data}.
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.astro/**',
      'public/**',
      '**/*.astro',
      'src/pages/**',
      'src/layouts/**',
      'astro.config.mjs',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/{lib,config,types,data}/**/*.ts', 'tests/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
);
