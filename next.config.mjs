/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "drive.google.com" }],
  },
  reactStrictMode: false,
};

export default nextConfig;
