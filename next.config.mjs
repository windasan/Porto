/**
 * next.config.mjs
 * @type {import('next').NextConfig}
 */
const config = {
  // ── Image domains ──────────────────────────────────────────────────────
  images: {
    remotePatterns: [
      {
        // Supabase Storage (project images)
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  // ── Strict mode ─────────────────────────────────────────────────────────
  reactStrictMode: true,

  // ── Experimental ────────────────────────────────────────────────────────
  experimental: {
    // Server Actions are stable in Next 14, but typedRoutes helps catch
    // broken links at build time (opt-in)
    typedRoutes: true,
  },
};

export default config;