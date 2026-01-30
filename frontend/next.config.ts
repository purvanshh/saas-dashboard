import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Explicitly set the root to silence the warning
  turbopack: {
    root: process.cwd(),
  },
  // Optimize for production builds
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js'],
  },
};

export default nextConfig;

