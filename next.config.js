/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  distDir: 'docs',
  images: {
    unoptimized: true
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/my-life' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/my-life' : '',
}

module.exports = nextConfig