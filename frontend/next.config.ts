import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 'standalone' is needed for Docker but breaks Vercel — skip it there
  output: process.env.VERCEL ? undefined : 'standalone',
  async rewrites() {
    // In Docker, containers communicate via service names (not localhost)
    const backendUrl = process.env.STRAPI_INTERNAL_URL || 'http://backend:1337';
    const adminUrl = process.env.ADMIN_INTERNAL_URL || 'http://admin:3001';

    // On Vercel there's no admin or backend container — use only /uploads proxy
    if (process.env.VERCEL) {
      const vercelApiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://api.ideabyido.com';
      return [
        {
          source: '/uploads/:path*',
          destination: `${vercelApiUrl}/uploads/:path*`,
        },
      ];
    }

    return [
      // ── Proxy /uploads/* → backend (fixes image URLs stored as relative paths)
      {
        source: '/uploads/:path*',
        destination: `${backendUrl}/uploads/:path*`,
      },
      // ── Admin dashboard proxy
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
