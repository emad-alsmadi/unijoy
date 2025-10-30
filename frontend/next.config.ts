import type { NextConfig } from 'next';

import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 20;

const nextConfig: NextConfig = {
  images: {
    domains: ['localhost'],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8080',
        pathname: '/**',
      },
    ],
  },
  compress: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'date-fns'],
  },
  async headers() {
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/_next/static/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
        {
          source: '/images/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
      ];
    }
    // In development, avoid aggressive caching to ensure HMR works reliably
    return [];
  },
};

export default nextConfig;
