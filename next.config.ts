import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Admin image uploads are served from Firebase Storage (public objects).
    remotePatterns: [
      { protocol: "https", hostname: "storage.googleapis.com" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
    ],
  },
  async headers() {
    // Baseline hardening. (CSP is intentionally left off to avoid breaking the
    // Google Maps embed and Turnstile; add it deliberately if needed.)
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  experimental: {
    serverActions: {
      // Admin image uploads allow up to 8MB (see MAX_UPLOAD_BYTES); raise the
      // Server Action body limit above that (plus multipart overhead) so large
      // photo uploads aren't rejected with a 1MB "Body exceeded" 413 error.
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
