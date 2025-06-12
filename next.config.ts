import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: '47bd859f4f5f40a8bc53f66c1da7b676.r2.cloudflarestorage.com' },
    ],
  },
};

export default nextConfig;
