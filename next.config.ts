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
    ],
  },
};

export default nextConfig;
