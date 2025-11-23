import type { NextConfig } from 'next'
// @ts-expect-error - next-pwa doesn't have type definitions
import withPWA from 'next-pwa'

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  ...(process.env.NODE_ENV === 'development' && {
    webpackDevMiddleware: (config: any) => {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
      return config
    },
  }),
}

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})(nextConfig)
