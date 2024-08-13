/** @type {import('next').NextConfig} */

import path from 'path';
import withBundleAnalyzer from '@next/bundle-analyzer';
import withPlugins from 'next-compose-plugins';

const isProd = ['production'].includes(process.env.NODE_ENV);

const nextConfig = {
  reactStrictMode: false,
  env: {
    BASE_URL: process.env.NEXT_PUBLIC_BASEURL,
  },
  // 转发
  rewrites: () => {
    if (!isProd) {
      return [
        {
          source: '/api/:slug*',
          destination: process.env.PROXY,
        },
      ];
    } else {
      return [];
    }
  },
  // 自定义 Webpack 配置
  webpack: (config, { dev, isServer }) => {
    // 性能优化：分析和 Tree-shaking
    if (!dev && !isServer) {
      // 将 React 和 ReactDOM 提取到一个共享包中
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        reactVendor: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'react-vendor',
          chunks: 'all',
          priority: 20,
        },
      };
    }
    return config;
  },
  // 支持 TypeScript 和 ESLint
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default withPlugins([withBundleAnalyzer], nextConfig);
