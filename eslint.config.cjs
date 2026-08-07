// Flat config for ESLint 10, for packages that have no eslint.config of
// their own and previously fell through to the root .eslintrc.json's
// cascade. Apps with their own eslint.config.cjs (mirroring their old
// root: true .eslintrc.cjs) are found first by ESLint's upward config
// search and never reach this file.
const globals = require('globals');
const sharedConfig = require('@gate-access/config/eslint-flat');

module.exports = [
  {
    ignores: [
      '**/dist/**',
      '**/.next/**',
      '**/node_modules/**',
      '**/public/**',
      '**/__mocks__/**',
    ],
  },
  ...sharedConfig,
  {
    files: [
      '**/*.{test,spec}.{js,jsx,ts,tsx}',
      '**/jest.setup.*',
      '**/jest.config.*',
    ],
    languageOptions: {
      globals: { ...globals.jest },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-require-imports': 'warn',
      'prefer-const': 'warn',
      'no-empty': 'warn',
    },
  },
];
