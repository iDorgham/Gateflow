/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@gate-access/types', '@gate-access/ui', '@gate-access/db'],
};

module.exports = nextConfig;
