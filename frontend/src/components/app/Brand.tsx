import { Logo } from "@/components/Logo";

/** Dashboard brand lockup — the shared Stitch logo with the eyebrow. */
export function Brand({ className }: { className?: string }) {
  return <Logo size="md" eyebrow className={className} />;
}
