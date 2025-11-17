/** @type {import('next').NextConfig} */
const nextConfig = {
  
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "klassart.com",
        pathname: "/web/uploads/**", // allow all under this path
      },
      {
        protocol: "https",
        hostname: "static.vecteezy.com",
        pathname: "/**", // allow all paths from vecteezy
      },
      {
        protocol: "https",
        hostname: "cdn.dribbble.com",
        pathname: "/**", // allow all paths from dribbble
      },
      {
        protocol: "https",
        hostname: "admin.klassart.com",
        pathname: "/**", // allow all paths from klassart
      },
    ],
  },
  reactStrictMode: true,
  // ❌ removed invalid experimental key
};

module.exports = nextConfig;
