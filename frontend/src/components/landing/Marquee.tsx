const words = [
  "Strength",
  "Weight loss",
  "Yoga",
  "Nutrition",
  "Bodybuilding",
  "Mobility",
  "Athletic performance",
  "Rehab",
  "HIIT",
  "Powerlifting",
];

export function Marquee() {
  return (
    <div className="relative overflow-hidden border-b border-border/60 py-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ink to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ink to-transparent" />
      <div className="flex w-max animate-marquee gap-10" style={{ ["--marquee-duration" as string]: "28s" }}>
        {[...words, ...words].map((w, i) => (
          <div key={i} className="flex items-center gap-10">
            <span className="font-display text-2xl font-semibold text-muted/70">
              {w}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-accent-strong" />
          </div>
        ))}
      </div>
    </div>
  );
}
