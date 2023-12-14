/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // allow all domains
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // reactStrictMode: false
}

module.exports = nextConfig
