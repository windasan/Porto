/**
 * lib/utils.ts
 *
 * General-purpose utility functions.
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn — Class name helper.
 *
 * Merges Tailwind classes intelligently:
 *  - clsx   → handles conditional/array/object class expressions
 *  - twMerge → resolves Tailwind class conflicts (e.g. "p-4 p-6" → "p-6")
 *
 * Install deps: npm install clsx tailwind-merge
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-surface-raised", className)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * formatDate — Human-readable date from ISO string.
 * @example formatDate("2023-09-01") → "September 2023"
 */
export function formatDate(
  iso: string,
  opts: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" }
): string {
  return new Date(iso).toLocaleDateString("en-US", opts);
}

/**
 * truncate — Trim a string to `max` characters with an ellipsis.
 */
export function truncate(str: string, max = 120): string {
  if (str.length <= max) return str;
  return `${str.slice(0, max).trimEnd()}…`;
}

/**
 * slugify — Convert a string to a URL-safe slug.
 * @example slugify("Hello, World!") → "hello-world"
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * getInitials — Return up to 2 uppercase initials from a name.
 * @example getInitials("John Doe") → "JD"
 */
export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}
