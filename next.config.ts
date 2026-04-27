import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['node-ical'],
  output: 'standalone',
};

export default nextConfig;