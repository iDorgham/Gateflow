// Native flat config for ESLint 9, replacing the eslintrc.cjs equivalent
// (kept alongside it for anything that still resolves the "." export).
// Bridging next/core-web-vitals and typescript-eslint's legacy shareable
// config names through @eslint/eslintrc's FlatCompat crashes today
// (circular plugin objects in eslint-config-next's own flat internals
// trip FlatCompat's legacy JSON-schema error formatter), so this uses
// each package's native flat exports directly instead.
//
// Pinned to ESLint 9, not 10: eslint-plugin-react (a transitive dep of
// eslint-config-next) doesn't support ESLint 10 yet (peer range tops out
// at ^9.7) and crashes on its `react/display-name` rule under 10.
const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const nextVitals = require('eslint-config-next/core-web-vitals');
const nextTs = require('eslint-config-next/typescript');
const prettierConfig = require('eslint-config-prettier/flat');
const globals = require('globals');

module.exports = [
  {
    ignores: [
      'next-env.d.ts',
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'coverage/**',
      'dist/**',
      'public/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...nextVitals,
  ...nextTs,
  prettierConfig,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2015,
      },
    },
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
      '@next/next/no-img-element': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-this-alias': 'warn',
      'no-empty': 'warn',
      // TypeScript handles undefined identifiers; keep eslint from fighting TS.
      'no-undef': 'off',
      // eslint-config-next's `typescript`/`core-web-vitals` presets enable
      // eslint-plugin-react-hooks@7's new React Compiler diagnostics by
      // default (everything in the plugin except the two classic rules
      // below). This codebase wasn't written against React Compiler's
      // purity/memoization assumptions, and these rules have a known
      // false-positive rate on ordinary effect/ref code — not something
      // to adopt as a side effect of an ESLint version bump. Keep the
      // classic hooks rules (rules-of-hooks, exhaustive-deps); opt into
      // the compiler diagnostics deliberately later if desired.
      ...Object.fromEntries(
        Object.keys(require('eslint-plugin-react-hooks').rules)
          .filter(
            (rule) => !['exhaustive-deps', 'rules-of-hooks'].includes(rule)
          )
          .map((rule) => [`react-hooks/${rule}`, 'off'])
      ),
    },
  },
  {
    // ESLint's own flat config files are plain CommonJS by convention
    // (ESLint loads eslint.config.cjs itself before any transpilation
    // could apply); require() here is correct, not a violation.
    files: ['eslint.config.{js,cjs,mjs}'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
