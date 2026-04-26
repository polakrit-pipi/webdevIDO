import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    const adminUrl = process.env.ADMIN_INTERNAL_URL || 'http://localhost:3001';
    return [
      {
        source: '/admin',
        destination: `${adminUrl}/admin`,
      },
      {
        source: '/admin/:path*',
        destination: `${adminUrl}/admin/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'strapi',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'backend',
        port: '1337',
        pathname: '/uploads/**',
      },
    ],

    unoptimized: true,
  },
};

export default nextConfig;