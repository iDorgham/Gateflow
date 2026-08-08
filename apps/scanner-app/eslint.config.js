// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    rules: {
      // eslint-config-expo enables eslint-plugin-react-hooks@7's new React
      // Compiler diagnostics by default (everything in the plugin except
      // the two classic rules below). This app wasn't written against
      // React Compiler's purity/memoization assumptions, and these rules
      // have a known false-positive rate on ordinary effect/ref code (see
      // packages/config/eslint.config.cjs for the Next.js-side apps' same
      // rationale). Keep the classic hooks rules; opt into the compiler
      // diagnostics deliberately later if desired.
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
    // eslint-config-expo's import resolver doesn't follow @gateflow/ui's
    // subpath exports (e.g. "./tokens") the way Metro's own bundler
    // resolution does at build/runtime — the dist files it points to are
    // genuinely built and resolve fine outside of lint. False positive,
    // not a real broken import.
    files: ['src/components/QueueStatusBadge.tsx'],
    rules: {
      'import/no-unresolved': 'off',
    },
  },
]);
