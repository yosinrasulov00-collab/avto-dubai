/** @type {import('next').NextConfig} */
const path = require('path');

const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';

const nextConfig = {
  outputFileTracingRoot: path.join(__dirname, '..'),
  async rewrites() {
    return [
      { source: '/api/:path*', destination: `${backendUrl}/api/:path*` },
      { source: '/uploads/:path*', destination: `${backendUrl}/uploads/:path*` },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'http', hostname: 'localhost', port: '4000' },
      { protocol: 'https', hostname: '**.trycloudflare.com' },
      { protocol: 'https', hostname: '**.vercel.app' },
      { protocol: 'https', hostname: '**.onrender.com' },
    ],
  },
};

module.exports = nextConfig;
