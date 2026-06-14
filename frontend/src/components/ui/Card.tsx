import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Card({
  className,
  hover,
  ...props
}: HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-border bg-surface/40 p-6",
        hover &&
          "transition-all duration-300 hover:-translate-y-1 hover:border-accent-strong/50 hover:bg-surface",
        className
      )}
      {...props}
    />
  );
}
