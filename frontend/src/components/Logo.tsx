import { MIcon } from "@/components/ui/MIcon";
import { cn } from "@/lib/cn";

const sizes = {
  sm: { box: "h-8 w-8 rounded-lg", icon: "text-[18px]", word: "text-lg" },
  md: { box: "h-9 w-9 rounded-lg", icon: "text-[20px]", word: "text-[20px]" },
  lg: { box: "h-11 w-11 rounded-xl", icon: "text-[24px]", word: "text-xl" },
};

/**
 * The CoachBridge logo (Stitch design): a primary rounded square with the
 * fitness_center mark + wordmark. Used across landing, auth, and dashboards.
 */
export function Logo({
  size = "sm",
  eyebrow = false,
  className,
}: {
  size?: keyof typeof sizes;
  eyebrow?: boolean;
  className?: string;
}) {
  const s = sizes[size];
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "grid place-items-center bg-primary text-on-primary-container",
          s.box
        )}
      >
        <MIcon name="fitness_center" filled className={s.icon} />
      </span>
      <span className="leading-tight">
        <span
          className={cn(
            "block font-display font-semibold tracking-tight text-on-surface",
            s.word
          )}
        >
          CoachBridge
        </span>
        {eyebrow && (
          <span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-on-surface-variant">
            Elite Coaching
          </span>
        )}
      </span>
    </span>
  );
}
