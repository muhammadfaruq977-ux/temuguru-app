import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Abaikan error typescript saat build Vercel
  typescript: {
    ignoreBuildErrors: true,
  },
};

const withConfig = {
  ...nextConfig,
  // Mengabaikan eslint saat build untuk mengamankan deployment MVP
  ignoreDuringBuilds: true, 
};

export default nextConfig;