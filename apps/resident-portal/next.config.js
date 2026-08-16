/** @type {import('next').NextConfig} */
const { securityHeaders } = require('../../packages/config/security-headers');
const path = require('path');
const { resolveResidentRewriteDestination } = require('./api-upstream.cjs');

const nextConfig = {
  outputFileTracingRoot: path.join(__dirname, '../../'),
  reactStrictMode: true,
  transpilePackages: [
    '@gateflow/ui',
    '@gateflow/theme',
    '@gate-access/db',
    '@gate-access/types',
  ],
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
  async rewrites() {
    return [
      {
        source: '/api/resident/:path*',
        destination: resolveResidentRewriteDestination(),
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
