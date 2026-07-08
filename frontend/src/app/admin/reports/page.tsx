import { LineChart } from "@/components/app/LineChart";
import { MIcon } from "@/components/ui/MIcon";
import { Bento, Eyebrow } from "@/components/app/kit";
import { mockAdminStats } from "@/lib/mock";

export default function ReportsPage() {
  const s = mockAdminStats;
  const stats = [
    { l: "Total revenue", v: `${(s.revenue / 1000).toFixed(0)}K ETB`, d: "+12.5%", tone: "text-secondary", icon: "trending_up" },
    { l: "Commission", v: `${(s.commission / 1000).toFixed(0)}K ETB`, d: "+4.2%", tone: "text-secondary", icon: "trending_up" },
    { l: "Coach retention", v: "94.2%", d: "Stable", tone: "text-on-surface-variant", icon: "horizontal_rule" },
    { l: "Take rate", v: `${Math.round((s.commission / s.revenue) * 100)}%`, d: "Optimal", tone: "text-secondary", icon: "check_circle" },
  ];

  return (
    <div className="mx-auto max-w-[1300px] space-y-6">
      {/* Quick stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {stats.map((m) => (
          <Bento key={m.l} className="flex flex-col justify-between">
            <Eyebrow>{m.l}</Eyebrow>
            <p className="mt-2 font-display text-[32px] font-semibold text-on-surface">
              {m.v}
            </p>
            <p className={`mt-4 flex items-center gap-2 text-[12px] font-semibold ${m.tone}`}>
              <MIcon name={m.icon} className="text-[16px]" /> {m.d}
            </p>
          </Bento>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Financial trajectory */}
        <Bento className="col-span-12 lg:col-span-8">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h4 className="font-display text-[20px] font-semibold text-on-surface">
                Financial trajectory
              </h4>
              <p className="text-sm text-on-surface-variant">
                Commission revenue trend (000s ETB)
              </p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-lg border border-outline-variant bg-surface-container-high px-3 py-1.5 text-xs">
                Monthly
              </button>
              <button className="rounded-lg bg-primary px-3 py-1.5 text-xs text-on-primary">
                Yearly
              </button>
            </div>
          </div>
          <LineChart data={s.revenueSeries} stroke="#cabeff" height={260} />
        </Bento>

        {/* Top trainers */}
        <Bento className="col-span-12 flex flex-col lg:col-span-4">
          <div className="mb-6 flex items-center justify-between">
            <h4 className="font-display text-[20px] font-semibold text-on-surface">
              Top trainers
            </h4>
            <MIcon name="emoji_events" className="text-[22px] text-secondary" />
          </div>
          <div className="flex-1 space-y-1">
            {s.topTrainers.map((t, i) => (
              <div
                key={t.name}
                className="flex items-center gap-4 rounded-2xl px-3 py-3 transition-colors hover:bg-surface-container-high"
              >
                <span
                  className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${
                    i === 0 ? "bg-secondary text-on-secondary" : "bg-outline text-on-surface"
                  }`}
                >
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-on-surface">{t.name}</p>
                  <p className="text-[12px] text-on-surface-variant">
                    {t.sessions} sessions
                  </p>
                </div>
                <p className="font-display font-semibold text-on-surface">
                  {(t.revenue / 1000).toFixed(0)}K
                </p>
              </div>
            ))}
          </div>
        </Bento>

        {/* Usage distribution */}
        <Bento className="col-span-12 flex flex-col lg:col-span-5">
          <h4 className="mb-2 font-display text-[20px] font-semibold text-on-surface">
            Usage distribution
          </h4>
          <p className="mb-6 text-sm text-on-surface-variant">
            Activity density across Ethiopian cities.
          </p>
          <div className="relative flex-1 overflow-hidden rounded-2xl border border-outline-variant bg-surface-container-low">
            <div className="absolute inset-0 bg-[radial-gradient(#484555_1px,transparent_1px)] opacity-20 [background-size:20px_20px]" />
            <span className="absolute left-[24%] top-[35%] h-3 w-3 animate-ping rounded-full bg-primary" />
            <span className="absolute left-[24%] top-[35%] h-2 w-2 rounded-full bg-primary" />
            <span className="absolute left-[58%] top-[48%] h-3 w-3 animate-ping rounded-full bg-secondary [animation-delay:1s]" />
            <span className="absolute left-[58%] top-[48%] h-2 w-2 rounded-full bg-secondary" />
            <span className="absolute left-[40%] top-[65%] h-2 w-2 rounded-full bg-primary/60" />
            <div className="absolute bottom-4 left-4 rounded-xl border border-outline-variant bg-surface-container-highest/80 p-3 backdrop-blur-md">
              <Eyebrow>Peak region</Eyebrow>
              <p className="font-semibold text-on-surface">Addis Ababa</p>
              <p className="text-sm text-secondary">64% of activity</p>
            </div>
          </div>
        </Bento>

        {/* Recent activity */}
        <Bento className="col-span-12 lg:col-span-7">
          <h4 className="mb-6 font-display text-[20px] font-semibold text-on-surface">
            Recent activity
          </h4>
          <div className="space-y-2">
            {[
              { icon: "payments", ic: "bg-secondary-container/20 text-secondary", t: "Commission payout", s: "Trainer #CH-8821", v: "+1,450 ETB", vc: "text-secondary", w: "2 MIN AGO" },
              { icon: "person_add", ic: "bg-primary-container/20 text-primary", t: "New trainer verified", s: "Bruk Assefa", v: "Approved", vc: "text-on-surface", w: "15 MIN AGO" },
              { icon: "warning", ic: "bg-error-container/20 text-error", t: "High latency detected", s: "Addis edge node", v: "420ms", vc: "text-error", w: "1 HOUR AGO" },
            ].map((a) => (
              <div
                key={a.t}
                className="flex items-center justify-between rounded-2xl border border-outline-variant/30 bg-surface-container-low p-4 transition-all hover:border-outline-variant"
              >
                <div className="flex items-center gap-4">
                  <span className={`grid h-10 w-10 place-items-center rounded-full ${a.ic}`}>
                    <MIcon name={a.icon} className="text-[20px]" />
                  </span>
                  <div>
                    <p className="font-medium text-on-surface">{a.t}</p>
                    <p className="text-sm text-on-surface-variant">{a.s}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${a.vc}`}>{a.v}</p>
                  <p className="text-[10px] text-on-surface-variant">{a.w}</p>
                </div>
              </div>
            ))}
          </div>
        </Bento>
      </div>
    </div>
  );
}
