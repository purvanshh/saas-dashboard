import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Minimal configuration for Vercel deployment
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js'],
  },
  // Ensure proper static export
  trailingSlash: false,
  // Disable image optimization for static export if needed
  images: {
    unoptimized: false,
  },
};

export default nextConfig;

