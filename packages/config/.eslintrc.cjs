/** @type {import('eslint').Linter.Config} */
module.exports = {
  ignorePatterns: [
    'next-env.d.ts',
    '.next/**',
    'node_modules/**',
    'out/**',
    'build/**',
    'coverage/**',
    'dist/**',
    'public/**',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'next/core-web-vitals',
    'prettier',
  ],
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
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
};
