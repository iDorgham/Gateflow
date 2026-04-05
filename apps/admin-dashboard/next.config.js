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

const path = require('path');

const nextConfig = {
  outputFileTracingRoot: path.join(__dirname, '../../'),
  transpilePackages: [
    '@gate-access/types',
    '@gate-access/db',
    '@gate-access/ui',
    '@gate-access/i18n',
  ],
  serverExternalPackages: [
    '@node-rs/argon2',
    '@prisma/client',
    '@prisma/client/edge',
    '@prisma/extension-accelerate',
    'prisma',
    '.prisma/client',
  ],
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
  async redirects() {
    return [
      // Old overview -> root of organizations (picker)
      {
        source: '/dashboard',
        destination: '/organizations',
        permanent: true,
      },
      // Note: We cannot statically know the orgId here,
      // Middleware or the /organizations page handles the "auto-select" logic.
    ];
  },
  images: {
    // No remote images needed in the admin dashboard.
    remotePatterns: [],
  },
};

module.exports = nextConfig;
