/**
 * next.config.mjs
 * @type {import('next').NextConfig}
 */
const config = {
  // ── Image domains ──────────────────────────────────────────────────────
  images: {
    remotePatterns: [
      {
        // Supabase Storage
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // Malasngoding
        protocol: 'https',
        hostname: 'www.malasngoding.com',
        port: '',
        pathname: '/**',
      },
      {
        // Stokcoding
        protocol: 'https',
        hostname: 'stokcoding.com',
        port: '',
        pathname: '/**',
      },
      {
        // TAMBAHKAN INI: Domain BCA Pustaka
        protocol: 'https',
        hostname: 'pustaka.bca.co.id',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // ── Strict mode ─────────────────────────────────────────────────────────
  reactStrictMode: true,

  // ── Experimental ────────────────────────────────────────────────────────
  experimental: {
    typedRoutes: true,
  },
};

export default config;