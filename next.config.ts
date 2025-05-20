/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Only for temporary development
  },
  typescript: {
    ignoreBuildErrors: true, // Only if absolutely necessary
  },
  reactStrictMode: true,
  // Compiler optimizations (updated for Next.js 15)
  compiler: {
    styledComponents: true, // If using styled-components
    removeConsole: process.env.NODE_ENV === "production",
  },
  images: {
    domains: ["example.com"], // Add your domains
  },
  modularizeImports: {
    "@heroicons/react/24/outline": {
      transform: "@heroicons/react/24/outline/{{member}}",
    },
    lodash: {
      transform: "lodash/{{member}}",
    },
  },
  // New recommended options for Next.js 15:
  experimental: {
    optimizePackageImports: ["@mui/material"], // If using MUI
  },
  logging: {
    level: "error", // Reduce build logs
  },
};

module.exports = nextConfig;
