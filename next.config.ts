/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during builds
  },
  typescript: {
    ignoreBuildErrors: true, // Disable TypeScript errors during builds
  },
  // ... rest of your config
};

module.exports = nextConfig;
