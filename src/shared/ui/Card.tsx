import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type CardPadding = "md" | "lg";

const paddingClasses: Record<CardPadding, string> = {
  md: "p-4",
  lg: "p-6",
};

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  padding?: CardPadding;
};

export function Card({ className, padding = "md", ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-card bg-surface shadow-sm transition-shadow hover:shadow-md",
        paddingClasses[padding],
        className,
      )}
      {...props}
    />
  );
}
