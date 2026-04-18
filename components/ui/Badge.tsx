/**
 * components/ui/Badge.tsx
 *
 * Small label chip for tags, statuses, and categories.
 */

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "success" | "warning";
}

const badgeVariants = {
  default:  "bg-surface-raised text-secondary border-border",
  outline:  "bg-transparent text-muted border-border",
  success:  "bg-green-500/10 text-green-400 border-green-500/20",
  warning:  "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export function Badge({ children, className, variant = "default" }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5",
        "text-2xs font-medium tracking-wide",
        badgeVariants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}


/**
 * components/ui/Card.tsx
 *
 * Surface card with optional hover lift and border.
 */

interface CardProps {
  children:   React.ReactNode;
  className?: string;
  hover?:     boolean;
  as?:        "div" | "article" | "li";
}

export function Card({
  children,
  className,
  hover = false,
  as: Tag = "div",
}: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-2xl border border-border bg-surface-raised p-6",
        hover && [
          "transition-all duration-200",
          "hover:border-border hover:shadow-lg hover:shadow-black/10",
          "hover:-translate-y-0.5",
        ],
        className
      )}
    >
      {children}
    </Tag>
  );
}
