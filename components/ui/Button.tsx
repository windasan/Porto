/**
 * components/ui/Button.tsx
 *
 * Polymorphic button component supporting multiple visual variants and sizes.
 * Can render as a <button> or be composed with Next.js <Link> via `asChild`.
 */

import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

/* ── Variant map ─────────────────────────────────────────────────────────── */
const variants = {
  primary:  [
    "bg-primary text-surface",
    "hover:opacity-80",
    "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
  ],
  secondary: [
    "border border-border text-secondary bg-transparent",
    "hover:text-primary hover:border-primary hover:bg-surface-raised",
  ],
  ghost: [
    "text-muted bg-transparent",
    "hover:text-primary hover:bg-surface-raised",
  ],
  danger: [
    "bg-red-500/10 text-red-400 border border-red-500/20",
    "hover:bg-red-500/20",
  ],
} as const;

const sizes = {
  sm:  "h-7  px-3   text-xs  gap-1.5 rounded-md",
  md:  "h-9  px-4   text-sm  gap-2   rounded-lg",
  lg:  "h-10 px-5   text-sm  gap-2   rounded-lg",
  xl:  "h-11 px-6   text-base gap-2  rounded-xl",
  icon:"h-8  w-8    text-sm          rounded-lg",
} as const;

/* ── Types ───────────────────────────────────────────────────────────────── */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants;
  size?:    keyof typeof sizes;
  loading?: boolean;
}

/* ── Component ───────────────────────────────────────────────────────────── */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant  = "primary",
      size     = "md",
      loading  = false,
      disabled,
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          // Base
          "inline-flex items-center justify-center font-medium",
          "transition-all duration-150",
          "focus-visible:outline-none",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          "select-none",
          // Variant + size
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-3.5 w-3.5 shrink-0"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <circle
              className="opacity-25"
              cx="12" cy="12" r="10"
              stroke="currentColor" strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
