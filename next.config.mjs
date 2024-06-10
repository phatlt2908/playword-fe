/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "upload.wikimedia.org" },
      { hostname: "img-eshop.cdn.nintendo.net" },
      { hostname: "i2.wp.com" },
      { hostname: "publish.one37pm.net" },
    ],
  },

  reactStrictMode: false,
};

export default nextConfig;
