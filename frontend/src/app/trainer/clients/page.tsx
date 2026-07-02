import { MIcon } from "@/components/ui/MIcon";
import { Bento, Eyebrow } from "@/components/app/kit";
import { mockClients } from "@/lib/mock";

export default function ClientsPage() {
  const featured = mockClients[0];

  return (
    <div className="mx-auto max-w-[1200px] space-y-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Featured client */}
        <div className="relative col-span-12 overflow-hidden rounded-[24px] bento-card p-6 lg:col-span-8">
          <div className="pointer-events-none absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-primary/5 blur-[80px]" />
          <div className="relative flex items-start justify-between">
            <div className="flex gap-6">
              <div className="relative">
                <span
                  className="grid h-32 w-32 place-items-center rounded-2xl font-display text-4xl font-bold text-on-primary-container"
                  style={{ background: featured.accent }}
                >
                  {featured.initials}
                </span>
                <span className="absolute -bottom-2 -right-2 rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-on-secondary">
                  Active
                </span>
              </div>
              <div>
                <h3 className="font-display text-[24px] font-semibold text-on-surface">
                  {featured.name}
                </h3>
                <p className="mt-1 text-on-surface-variant">
                  {featured.goal} program · Phase 3
                </p>
                <div className="mt-4 flex flex-wrap gap-4">
                  {[
                    { l: "Sessions", v: featured.sessions, c: "text-primary" },
                    { l: "Progress", v: `${featured.progress}%`, c: "text-secondary" },
                    { l: "Next", v: featured.nextSession.split(" · ")[0], c: "text-on-surface" },
                  ].map((s) => (
                    <div
                      key={s.l}
                      className="rounded-xl border border-outline-variant bg-surface-container-high px-4 py-2"
                    >
                      <Eyebrow>{s.l}</Eyebrow>
                      <p className={`font-display text-[20px] font-semibold ${s.c}`}>
                        {s.v}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button className="grid h-11 w-11 place-items-center rounded-xl border border-outline-variant bg-surface-container-highest text-on-surface-variant hover:text-primary">
                <MIcon name="chat_bubble" className="text-[22px]" />
              </button>
              <button className="grid h-11 w-11 place-items-center rounded-xl border border-outline-variant bg-surface-container-highest text-on-surface-variant hover:text-primary">
                <MIcon name="more_horiz" className="text-[22px]" />
              </button>
            </div>
          </div>
          <div className="relative mt-8">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <Eyebrow>Quarterly goal progress</Eyebrow>
                <p className="mt-1 font-semibold text-on-surface">
                  Fat loss & strength maintenance
                </p>
              </div>
              <p className="font-display text-[32px] font-semibold text-primary">
                {featured.progress}%
              </p>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-surface-container-highest">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${featured.progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Client feed */}
        <Bento className="col-span-12 flex flex-col lg:col-span-4">
          <div className="mb-6 flex items-center justify-between">
            <h4 className="font-display text-[20px] font-semibold text-on-surface">
              Client feed
            </h4>
            <MIcon
              name="filter_list"
              className="cursor-pointer text-[20px] text-on-surface-variant hover:text-primary"
            />
          </div>
          <div className="flex-1 space-y-3">
            {mockClients.map((c, i) => (
              <div
                key={c.id}
                className="flex cursor-pointer items-center gap-4 rounded-2xl border border-outline-variant/50 bg-surface-container-high p-3 transition-all hover:border-primary/30"
              >
                <span
                  className="grid h-11 w-11 place-items-center rounded-full text-xs font-bold text-on-primary-container"
                  style={{ background: c.accent }}
                >
                  {c.initials}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-on-surface">{c.name}</p>
                  <p className="text-sm text-on-surface-variant">
                    {i === 1 ? "Check-in overdue (2d)" : "On track"}
                  </p>
                </div>
                {i === 1 ? (
                  <MIcon name="priority_high" className="text-[20px] text-error" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-secondary" />
                )}
              </div>
            ))}
          </div>
          <a
            href="#"
            className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-primary"
          >
            View all directory <MIcon name="arrow_forward" className="text-[18px]" />
          </a>
        </Bento>

        {/* Performance */}
        <Bento className="col-span-12 md:col-span-6 lg:col-span-4">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-secondary/10 text-secondary">
              <MIcon name="trending_up" className="text-[22px]" />
            </span>
            <h4 className="font-display text-[20px] font-semibold text-on-surface">
              Performance
            </h4>
          </div>
          <Eyebrow>Average group progress</Eyebrow>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-[32px] font-semibold text-on-surface">
              14.2%
            </span>
            <span className="text-sm text-secondary">+2.1% this week</span>
          </div>
          <div className="mt-6 space-y-4">
            {[["Strength", 75], ["Mobility", 50]].map(([l, w]) => (
              <div key={l as string}>
                <div className="mb-1 flex justify-between text-sm text-on-surface-variant">
                  <span>{l}</span>
                  <span className="text-on-surface">↑ {w as number > 60 ? 12 : 8}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
                  <div className="h-full bg-secondary" style={{ width: `${w}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Bento>

        {/* Session load */}
        <Bento className="col-span-12 md:col-span-6 lg:col-span-4">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
              <MIcon name="calendar_month" className="text-[22px]" />
            </span>
            <h4 className="font-display text-[20px] font-semibold text-on-surface">
              Session load
            </h4>
          </div>
          <Eyebrow>Upcoming 48 hours</Eyebrow>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-display text-[32px] font-semibold text-on-surface">
              18
            </span>
            <span className="text-sm text-on-surface-variant">scheduled</span>
          </div>
          <div className="mt-6 flex h-20 items-end gap-1.5">
            {[40, 65, 95, 55, 30, 45, 15].map((h, i) => (
              <div
                key={i}
                className={`flex-1 rounded-t-lg ${
                  h > 90 ? "bg-primary" : "bg-primary/20"
                }`}
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </Bento>

        {/* Training hub */}
        <div className="col-span-12 flex flex-col justify-between overflow-hidden rounded-[24px] bg-surface-container-highest p-6 lg:col-span-4">
          <div>
            <h4 className="font-display text-[20px] font-semibold text-on-surface">
              Program hub
            </h4>
            <p className="mt-2 text-sm text-on-surface-variant">
              Build new macro-cycles and assign them to clients.
            </p>
          </div>
          <a
            href="/trainer/programs"
            className="mt-6 rounded-xl bg-on-surface py-3 text-center font-medium text-background hover:opacity-90"
          >
            Open builder
          </a>
        </div>
      </div>
    </div>
  );
}
