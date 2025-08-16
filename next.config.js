/** @type {import('next').NextConfig} */
const isStatic = process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true';
const basePath = isStatic ? (process.env.NEXT_PUBLIC_BASE_PATH || '/profile') : '';

const nextConfig = {
  // Avoid forcing 'export' in JS config to keep API routes functional in dev/normal builds.
  // Static HTML is assembled by scripts/export-to-docs.js from .next/server/app instead.
  output: undefined,
  basePath: isStatic ? basePath : undefined,
  assetPrefix: isStatic ? basePath + '/' : undefined,
  trailingSlash: isStatic ? true : undefined,
  images: {
    unoptimized: isStatic,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
