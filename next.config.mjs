/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "upload.wikimedia.org" },
    ],
  },
  reactStrictMode: false
};

export default nextConfig;
