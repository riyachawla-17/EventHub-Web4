import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Helps catch potential bugs
  images: {
    domains: ["localhost"], // Allow loading images from local server
  },
  env: {
    JWT_SECRET: process.env.JWT_SECRET, // Make env variables accessible in frontend (if needed)
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL, // Optional: for public base URL
  },
};

export default nextConfig;
