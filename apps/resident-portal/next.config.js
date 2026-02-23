/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@gate-access/ui',
    '@gate-access/db',
    '@gate-access/types',
  ],
};

module.exports = nextConfig;
