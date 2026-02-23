import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Limit concurrent static page generation to prevent timeouts
    workerThreads: false,
    cpus: 1,
  },
  // Generate critical pages at build time, rest on-demand
  generateBuildId: async () => {
    return 'winesaint-' + Date.now();
  },
};

export default nextConfig;
