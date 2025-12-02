import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure @vercel/og is properly bundled for serverless deployments
  // Explicitly include @vercel/og and its native dependencies in the output file tracing
  outputFileTracingIncludes: {
    '/api/og': [
      './node_modules/@vercel/og/**/*',
      './node_modules/@vercel/og/dist/**/*',
    ],
  },
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
