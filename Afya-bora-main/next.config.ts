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
    console.log('Setting up redirects for Vercel deployment');
    return [
      {
        source: '/',
        destination: '/landing',
        permanent: false,
      },
    ];
  },
  // Ensure proper handling of dynamic routes and redirects
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
  // Additional Vercel optimizations
  experimental: {
    // Allow these server-only packages to remain external and not be bundled for the client
    serverComponentsExternalPackages: ['genkit', '@genkit-ai/googleai', '@opentelemetry/sdk-node'],
  },
  // Ensure proper output for Vercel
  output: 'standalone',
  // Disable static optimization for dynamic routes
  trailingSlash: false,
  // Ensure proper handling of dynamic routes
  generateStaticParams: async () => [],
  // Disable telemetry to prevent OpenTelemetry issues
  telemetry: false,
  // Avoid bundling optional OpenTelemetry exporters and Node core modules in client builds
  webpack: (config, { isServer }) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@opentelemetry/exporter-jaeger': false,
      '@opentelemetry/exporter-zipkin': false,
      '@opentelemetry/exporter-trace-otlp-grpc': false,
      '@opentelemetry/exporter-trace-otlp-http': false,
      '@opentelemetry/otlp-grpc-exporter-base': false,
    } as any;

    if (!isServer) {
      config.resolve.fallback = {
        ...(config.resolve.fallback || {}),
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        worker_threads: false,
      };
    }
    return config;
  },
};

export default nextConfig;
