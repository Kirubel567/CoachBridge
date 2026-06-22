import { Logo } from "@/components/Logo";

// Links that point to a live section on this page use an anchor.
// Ones marked `soon: true` target pages that don't exist yet — they're
// wired up in later build phases.
const columns = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/#how" },
      { label: "Find a trainer", href: "/trainers" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Become a trainer", href: "/signup?role=trainer" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Careers", href: "#", soon: true },
      { label: "Blog", href: "#", soon: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Data rights", href: "/data-rights" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border py-16">
      <div className="container-x">
        <div className="grid gap-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <a href="/">
              <Logo />
            </a>
            <p className="mt-4 max-w-xs text-sm text-muted">
              The trusted way to connect with certified personal trainers across
              Ethiopia.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="font-display text-sm font-semibold">{col.title}</p>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="group inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
                    >
                      {l.label}
                      {"soon" in l && l.soon && (
                        <span className="rounded-full border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted/60">
                          soon
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-sm text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} CoachBridge. Made in Ethiopia. 🇪🇹</p>
          <p>Built for trainers and trainees who mean it.</p>
        </div>
      </div>
    </footer>
  );
}
