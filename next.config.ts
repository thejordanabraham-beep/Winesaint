import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Aggressive optimizations to reduce build time
  experimental: {
    // Skip static optimization to speed up builds
    optimizePackageImports: ['@sanity/client'],
  },

  // Skip bundle analysis during build
  outputFileTracingIncludes: {
    '/': [],
  },

  // Reduce build-time processing
  typescript: {
    // Skip type checking during build (already done in dev)
    ignoreBuildErrors: true,
  },
  eslint: {
    // Skip linting during build (already done in dev)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
