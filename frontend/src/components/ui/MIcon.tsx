import { cn } from "@/lib/cn";

/**
 * Material Symbols Outlined icon (the icon system from the Stitch design).
 * Size is controlled with a text-size class, color with a text-color class.
 */
export function MIcon({
  name,
  className,
  filled,
  weight,
}: {
  name: string;
  className?: string;
  filled?: boolean;
  weight?: number;
}) {
  return (
    <span
      className={cn("material-symbols-outlined select-none leading-none", className)}
      style={{
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' ${
          weight ?? 400
        }, 'GRAD' 0, 'opsz' 24`,
      }}
      aria-hidden
    >
      {name}
    </span>
  );
}
