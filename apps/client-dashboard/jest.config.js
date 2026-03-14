module.exports = {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^uncrypto$': '<rootDir>/__mocks__/uncrypto.js',
    '^jose$': '<rootDir>/__mocks__/jose.js',
    '^@upstash/redis$': '<rootDir>/__mocks__/@upstash/redis.js',
    '^@upstash/ratelimit$': '<rootDir>/__mocks__/@upstash/ratelimit.js',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          module: 'ESNext',
          moduleResolution: 'bundler',
          esModuleInterop: true,
          target: 'ES2020',
          strict: true,
          jsx: 'react-jsx',
        },
      },
    ],
  },
  transformIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  setupFiles: [],
};
