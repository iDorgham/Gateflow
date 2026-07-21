/** @type {import('next').NextConfig} */
const { securityHeaders } = require('../../packages/config/security-headers');

const path = require('path');

const nextConfig = {
  outputFileTracingRoot: path.join(__dirname, '../../'),
  reactStrictMode: true,
  transpilePackages: ['@gateflow/ui', '@gate-access/db', '@gate-access/types'],
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
  async rewrites() {
    return [
      {
        source: '/api/resident/:path*',
        destination: 'http://localhost:3001/api/resident/:path*',
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
