/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
  },
  turbopack: {},
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      aggregateTimeout: 300,
      ignored: [
        '**/.next/**',
        '**/node_modules/**',
        '**/prisma/migrations/**',
      ],
      poll: 1000,
    }

    return config
  },
}

module.exports = nextConfig
