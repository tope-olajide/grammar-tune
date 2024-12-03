/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdf.js-extract'],
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production', // Ignore TypeScript errors only in production
  },
}

module.exports = nextConfig;