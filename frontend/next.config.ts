import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://127.0.0.1:8000/api/:path*",
      },
      {
        source: "/ws/:path*",
        destination: "http://127.0.0.1:8000/ws/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
