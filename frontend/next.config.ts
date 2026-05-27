import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 'standalone' is needed for Docker but breaks Vercel — skip it there
  output: process.env.VERCEL ? undefined : 'standalone',
  async rewrites() {
    // On Vercel there's no admin container — skip these rewrites
    if (process.env.VERCEL) return [];
    const adminUrl = process.env.ADMIN_INTERNAL_URL || 'http://localhost:3001';
    return [
      {
        source: '/admin',
        destination: `${adminUrl}/`,
      },
      {
        source: '/admin/:path*',
        destination: `${adminUrl}/:path*`,
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
      {
        protocol: 'https',
        hostname: 'webdevido.onrender.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'img.freepik.com',
        pathname: '/**',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
