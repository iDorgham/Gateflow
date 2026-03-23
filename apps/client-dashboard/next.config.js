const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
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
    '@gate-access/ui',
    '@gate-access/db',
    '@gate-access/i18n',
  ],
  experimental: {
    serverComponentsExternalPackages: [
      '@node-rs/argon2',
      '@prisma/client',
      'prisma',
    ],
    optimizePackageImports: [
      '@phosphor-icons/react',
      'lucide-react',
      '@gate-access/ui',
    ],
  },
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
  images: {
    // Explicit allowlist — wildcard disabled Next.js image optimization (no AVIF/WEBP)
    remotePatterns: [
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }, // Google OAuth avatars
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' }, // GitHub avatars
      { protocol: 'https', hostname: 'ui-avatars.com' }, // Fallback avatar service
      { protocol: 'https', hostname: '*.amazonaws.com' }, // S3 / CloudFront
      { protocol: 'https', hostname: '*.cloudfront.net' }, // CloudFront CDN
      { protocol: 'https', hostname: 'images.unsplash.com' }, // Unsplash media
      { protocol: 'https', hostname: 'res.cloudinary.com' }, // Cloudinary uploads
    ],
    // Serve modern formats — AVIF first (50% smaller), WebP fallback
    formats: ['image/avif', 'image/webp'],
    // Responsive sizes for common breakpoints
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // Standard image sizes for thumbnails/icons
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

module.exports = withBundleAnalyzer(nextConfig);
