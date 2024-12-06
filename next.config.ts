/** @type {import('next').NextConfig} */
const nextConfig = {

  serverExternalPackages: ['pdf.js-extract'],
  
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production', // Ignore TypeScript errors only in production
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
     ignoreDuringBuilds: true,
     
  },
}

module.exports = nextConfig;