import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ...other config options
  eslint: {
    // WARNING: This allows production builds to succeed even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
