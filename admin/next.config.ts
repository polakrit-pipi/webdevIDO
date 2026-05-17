import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  basePath: '/admin',
  async redirects() {
    return [
      {
        source: '/',
        destination: '/admin',
        permanent: false,
        basePath: false,
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
        hostname: 'backend',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'webdevido.onrender.com',
        pathname: '/uploads/**',
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
