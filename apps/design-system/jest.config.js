/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: { moduleResolution: 'node' } }],
  },
  testMatch: ['**/*.test.ts'],
  modulePathIgnorePatterns: ['node_modules', '.next'],
};
