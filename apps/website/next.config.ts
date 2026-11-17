import type { NextConfig } from 'next';

import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 20;

const backendOrigin =
  process.env.BACKEND_ORIGIN || process.env.NEXT_PUBLIC_API_URL || '';

const isProd = process.env.NODE_ENV === 'production';

const apiOrigin = backendOrigin
  ? backendOrigin
  : isProd
    ? ''
    : `http://localhost:${process.env.NEXT_PUBLIC_API_PORT || '8080'}`;

if (isProd && !apiOrigin) {
  // In production (e.g. Vercel), proxying to localhost/private hosts will fail.
  // Ensure BACKEND_ORIGIN is set to a publicly reachable backend base URL.
  // eslint-disable-next-line no-console
  console.warn(
    'Missing BACKEND_ORIGIN (or NEXT_PUBLIC_API_URL). Production rewrites to the backend will not work without it.',
  );
}

const apiHost = apiOrigin ? new URL(apiOrigin).hostname : 'localhost';
const apiProtocol = apiOrigin
  ? (new URL(apiOrigin).protocol.replace(':', '') as 'http' | 'https')
  : 'http';
const apiPort = apiOrigin ? new URL(apiOrigin).port || '' : '8080';

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
  eslint: {
    ignoreDuringBuilds: true,
  },
  compress: true,
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion', 'date-fns'],
  },
  async rewrites() {
    if (!apiOrigin) return [];
    return [
      {
        source: '/api/backend/:path*',
        destination: `${apiOrigin}/:path*`,
      },
    ];
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
