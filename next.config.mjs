/** @type {import('next').NextConfig} */

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['@google/genai'],
  },
};

export default nextConfig;
