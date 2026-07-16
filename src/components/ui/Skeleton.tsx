import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

export type SkeletonProps = HTMLAttributes<HTMLDivElement> & {
  lines?: number;
};

export function Skeleton({ className, lines = 1, ...props }: SkeletonProps) {
  if (lines === 1) {
    return (
      <div
        className={cn(
          "h-4 w-full animate-pulse rounded-md bg-muted/20",
          className,
        )}
        {...props}
      />
    );
  }

  return (
    <div className={cn("space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          className="h-4 w-full animate-pulse rounded-md bg-muted/20"
          key={`skeleton-line-${index}`}
        />
      ))}
    </div>
  );
}
