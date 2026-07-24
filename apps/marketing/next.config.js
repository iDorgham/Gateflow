/** @type {import('next').NextConfig} */
const { securityHeaders } = require('../../packages/config/security-headers');

const path = require('path');

const nextConfig = {
  outputFileTracingRoot: path.join(__dirname, '../../'),
  transpilePackages: [
    '@gateflow/ui',
    '@gate-access/i18n',
    'framer-motion',
  ],
  // Keep Prisma out of the Turbopack/webpack bundle so the native query engine
  // (rhel-openssl-3.0.x on Vercel) is resolved from node_modules at runtime.
  serverExternalPackages: ['@prisma/client', 'prisma', '@gate-access/db'],
  outputFileTracingIncludes: {
    '/**': [
      './node_modules/.pnpm/@prisma+client@*/node_modules/.prisma/client/**',
      './node_modules/.pnpm/@prisma+client@*/node_modules/@prisma/client/**',
      '../../node_modules/.pnpm/@prisma+client@*/node_modules/.prisma/client/**',
      '../../node_modules/.pnpm/@prisma+client@*/node_modules/@prisma/client/**',
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@gateflow/ui', 'framer-motion'],
    nextScriptWorkers: true,
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
    ],
    // Serve AVIF first (50% smaller than JPEG), WebP as fallback
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  },
};

module.exports = nextConfig;
