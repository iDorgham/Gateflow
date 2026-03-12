/** @type {import('jest').Config} */
const config = {
  testEnvironment: '<rootDir>/custom-jest-environment.js',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { moduleResolution: 'node' } }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: ['**/*.test.ts'],
  setupFiles: [],
};

module.exports = config;
