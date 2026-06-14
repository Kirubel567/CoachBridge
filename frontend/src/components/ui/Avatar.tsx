import { cn } from "@/lib/cn";

const sizes = {
  sm: "h-9 w-9 text-sm rounded-xl",
  md: "h-12 w-12 text-base rounded-2xl",
  lg: "h-16 w-16 text-xl rounded-2xl",
  xl: "h-24 w-24 text-3xl rounded-3xl",
};

export function Avatar({
  initials,
  color = "#7c5cff",
  size = "md",
  className,
}: {
  initials: string;
  color?: string;
  size?: keyof typeof sizes;
  className?: string;
}) {
  // Dark accent colors get light text; light accents get ink text.
  const light = ["#cdff4a", "#f4f4f6"].includes(color.toLowerCase());
  return (
    <div
      className={cn(
        "grid shrink-0 place-items-center font-display font-bold",
        sizes[size],
        light ? "text-ink" : "text-white",
        className
      )}
      style={{ background: color }}
    >
      {initials}
    </div>
  );
}
