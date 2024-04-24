/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["media.steampowered.com"],
  },
  env: {
    backendAddress: process.env.backendAddress,
    apiKey: process.env.apiKey,
  },
};

export default nextConfig;
