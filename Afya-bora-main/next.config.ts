import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
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
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Ensure redirects work properly on Vercel
  async redirects() {
    return [
      {
        source: '/',
        destination: '/landing',
        permanent: false,
      },
    ];
  },
  // Additional Vercel optimizations
  experimental: {
    // Disable features that might cause issues on Vercel
    serverComponentsExternalPackages: [],
  },
  // Ensure proper output for Vercel
  output: 'standalone',
  // Disable static optimization for dynamic routes
  trailingSlash: false,
  // Ensure proper handling of dynamic routes
  generateStaticParams: async () => [],
  // Disable telemetry to prevent OpenTelemetry issues
  telemetry: false,
};

export default nextConfig;
