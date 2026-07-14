const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(__dirname, '../../'),
  transpilePackages: [
    '@gateflow/ui',
    '@gateflow/tokens',
    '@gateflow/theme',
    '@gateflow/components',
  ],
};

module.exports = nextConfig;
