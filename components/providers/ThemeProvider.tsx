/**
 * components/providers/ThemeProvider.tsx
 *
 * Thin "use client" wrapper around next-themes <ThemeProvider>.
 * Kept separate from the root layout (Server Component) so only
 * this small boundary is hydrated on the client.
 */

"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      /**
       * attribute="class"  → next-themes toggles the `dark` class on <html>
       * defaultTheme="dark" → Brand default is the dark charcoal experience
       * enableSystem       → Respects OS preference on first visit
       * disableTransitionOnChange → Prevents flash during rapid toggles
       */
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
