
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  experimental: {
    fontLoaders: [
      {loader: 'next/font/google', options: {subsets: ['latin']}},
    ],
  },
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co', // Added placehold.co for product images
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
