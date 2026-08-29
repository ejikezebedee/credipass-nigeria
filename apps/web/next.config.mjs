/**
 * CrediPass Nigeria — Next.js configuration.
 * Security headers are applied app-wide. No secrets live here; any value the
 * browser needs must be prefixed NEXT_PUBLIC_ and must never be a secret.
 *
 * Full Content-Security-Policy (with nonce-based script loading) is tracked as
 * a hardening follow-up because strict CSP requires middleware/_document wiring
 * that Next.js does not apply by default.
 */

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()',
  },
  { key: 'X-DNS-Prefetch-Control', value: 'off' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};

export default nextConfig;
