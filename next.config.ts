import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ESLint runs separately in CI; skip during production build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
