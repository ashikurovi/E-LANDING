/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "i.ibb.co",
      },
      {
        protocol: "https",
        hostname: "squadlog-cdn.up.railway.app",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "squadlog-cdn.up.railway.app",
        pathname: "/uploads/**",
      },

    ],
  },
};

module.exports = nextConfig;
