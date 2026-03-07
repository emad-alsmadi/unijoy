import type { NextConfig } from 'next';

import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 20;

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const apiHost = apiUrl ? new URL(apiUrl).hostname : 'localhost';
const apiProtocol = apiUrl
  ? (new URL(apiUrl).protocol.replace(':', '') as 'http' | 'https')
  : 'http';
const apiPort = apiUrl ? new URL(apiUrl).port || '' : '8080';

const nextConfig: NextConfig = {
  images: {
    domains: [apiHost, 'localhost'],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: apiProtocol,
        hostname: apiHost,
        port: apiPort,
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
