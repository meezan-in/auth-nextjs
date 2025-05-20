import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Linting configuration (temporary during development)
  eslint: {
    ignoreDuringBuilds: Boolean(process.env.IGNORE_ESLINT),
  },
  typescript: {
    ignoreBuildErrors: Boolean(process.env.IGNORE_TSC),
  },

  // Core optimizations
  reactStrictMode: true,
  staticPageGenerationTimeout: 300,
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,

  // Compiler optimizations
  compiler: {
    styledComponents: {
      ssr: true,
      displayName: true,
      pure: true,
    },
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.example.com',
      },
    ],
    minimumCacheTTL: 86400,
  },

  // Module optimization
  modularizeImports: {
    '@heroicons/react/24/outline': {
      transform: '@heroicons/react/24/outline/{{member}}',
      skipDefaultConversion: true,
    },
    lodash: {
      transform: 'lodash/{{member}}',
      preventFullImport: true,
    },
  },

  // Experimental features
  experimental: {
    optimizePackageImports: [
      '@mui/material',
      '@mui/icons-material',
    ],
    serverActions: {},
    typedRoutes: true,
  },

  // Logging
  logging: {
  },
  productionBrowserSourceMaps: false,
}

export default nextConfig