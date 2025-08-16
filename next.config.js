/** @type {import('next').NextConfig} */
const isStatic = process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true';
const basePath = isStatic ? '/profile' : '';

const nextConfig = {
  // Enable static export for GitHub Pages
  output: isStatic ? 'export' : 'standalone',
  basePath: isStatic ? basePath : undefined,
  assetPrefix: isStatic ? basePath : undefined,
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
