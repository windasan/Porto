import type { Config } from "tailwindcss";

/**
 * tailwind.config.ts
 *
 * Design System Configuration
 * ─────────────────────────────────────────────────────────────────────────────
 * - Uses `class` strategy for dark mode → controlled by `next-themes`
 * - Extends the default palette with a custom `charcoal` scale anchored
 *   at the brand dark background (#21252a)
 * - Defines semantic CSS-variable-driven color tokens so both themes share
 *   the same Tailwind class names (e.g. `bg-surface`, `text-primary`)
 * ─────────────────────────────────────────────────────────────────────────────
 */

const config: Config = {
  // ── Dark mode strategy ──────────────────────────────────────────────────
  // "class" → next-themes adds/removes `dark` on <html>; Tailwind responds.
  darkMode: "class",

  // ── Content paths ────────────────────────────────────────────────────────
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],

  theme: {
    extend: {
      // ── Custom color palette ─────────────────────────────────────────────
      colors: {
        /**
         * Charcoal scale — generated around brand dark bg #21252a
         * Use these for hard-coded colors where semantic tokens aren't needed.
         */
        charcoal: {
          50:  "#f2f3f4",
          100: "#e4e6e9",
          200: "#c9cdd3",
          300: "#aeb4bc",
          400: "#939ba6",
          500: "#788290",
          600: "#5d6978",  // subtle borders / muted text in dark mode
          700: "#3f4650",  // card surfaces in dark mode
          800: "#2d3138",  // elevated surfaces
          850: "#252930",  // slightly above base
          900: "#21252a",  // ← BRAND DARK BASE BACKGROUND
          950: "#181b1f",  // deepest shadows / dropdowns
        },

        /**
         * Semantic tokens — mapped to CSS custom properties in globals.css.
         * These are the classes you should use throughout the UI so that
         * switching themes requires zero component changes.
         *
         * Usage:  bg-surface  /  text-primary  /  border-subtle
         */
        surface: {
          DEFAULT: "var(--color-surface)",
          raised:  "var(--color-surface-raised)",
          overlay: "var(--color-surface-overlay)",
        },
        primary: {
          DEFAULT: "var(--color-text-primary)",
        },
        secondary: {
          DEFAULT: "var(--color-text-secondary)",
        },
        muted: {
          DEFAULT: "var(--color-text-muted)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          hover:   "var(--color-accent-hover)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          subtle:  "var(--color-border-subtle)",
        },
      },

      // ── Typography ───────────────────────────────────────────────────────
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.875rem" }],
      },

      // ── Spacing / Layout ─────────────────────────────────────────────────
      maxWidth: {
        content: "720px",   // Readable prose column
        wide:    "1100px",  // Grid / dashboard layouts
      },

      // ── Border radius ────────────────────────────────────────────────────
      borderRadius: {
        "4xl": "2rem",
      },

      // ── Animations ───────────────────────────────────────────────────────
      keyframes: {
        "fade-in": {
          "0%":   { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in":  "fade-in 0.4s ease forwards",
        "fade-up":  "fade-up 0.5s ease forwards",
      },
    },
  },

  plugins: [],
};

export default config;
