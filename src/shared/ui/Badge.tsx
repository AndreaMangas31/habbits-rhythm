import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type BadgeVariant = "primary" | "success" | "warning" | "info" | "neutral";

type BadgeSize = "sm" | "md";

const badgeVariantClasses: Record<BadgeVariant, string> = {
  primary: "bg-primary/12 text-primary",
  success: "bg-success/12 text-success",
  warning: "bg-warning/14 text-warning",
  info: "bg-info/12 text-info",
  neutral: "bg-muted/12 text-muted",
};

const badgeSizeClasses: Record<BadgeSize, string> = {
  sm: "px-2 py-1 text-xs",
  md: "px-2.5 py-1 text-sm",
};

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  size?: BadgeSize;
};

export function Badge({
  className,
  variant = "neutral",
  size = "sm",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full font-medium",
        badgeVariantClasses[variant],
        badgeSizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
