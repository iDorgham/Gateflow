const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
];

const nextConfig = {
  transpilePackages: [
    '@gate-access/types',
    '@gate-access/db',
    '@gate-access/ui',
    '@gate-access/i18n',
  ],
  serverExternalPackages: ['@node-rs/argon2', '@prisma/client', 'prisma'],
  experimental: {
    serverComponentsExternalPackages: [
      '@prisma/client/edge',
      '@prisma/extension-accelerate',
    ],
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
  images: {
    // No remote images needed in the admin dashboard.
    remotePatterns: [],
  },
};

module.exports = nextConfig;
