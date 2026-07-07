import Link from "next/link";
import { LineChart } from "@/components/app/LineChart";
import { MIcon } from "@/components/ui/MIcon";
import { Bento, Eyebrow } from "@/components/app/kit";
import { mockAdminStats, mockVerifications, mockFlagged } from "@/lib/mock";

const activity = [
  { name: "Hanna Tesfaye", note: "Upgraded to Pro", val: "+499 ETB", tone: "text-secondary", when: "2 min ago", icon: "person", ic: "text-secondary bg-secondary/10" },
  { name: "Selam Bekele", note: "Completed 320th session", val: "Success", tone: "text-primary", when: "15 min ago", icon: "check_circle", ic: "text-primary bg-primary/10" },
  { name: "Bruk Assefa", note: "New certification submitted", val: "Verify", tone: "text-tertiary", when: "1 hour ago", icon: "verified_user", ic: "text-tertiary bg-tertiary-container/10" },
];

export default function AdminOverview() {
  const s = mockAdminStats;
  const kpis = [
    { label: "Platform revenue", value: `${(s.revenue / 1000).toFixed(0)}K`, delta: "+12.4%", icon: "payments", tone: "text-primary", up: true },
    { label: "Active coaches", value: s.trainers.toLocaleString(), delta: "+4.2%", icon: "verified", tone: "text-secondary", up: true },
    { label: "Total users", value: s.totalUsers.toLocaleString(), delta: "+8.1%", icon: "group", tone: "text-tertiary", up: true },
  ];

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="grid grid-cols-12 gap-6">
        {/* KPIs */}
        {kpis.map((k) => (
          <Bento key={k.label} className="col-span-12 flex min-h-[160px] flex-col justify-between md:col-span-4">
            <div className="flex items-center justify-between">
              <Eyebrow>{k.label}</Eyebrow>
              <MIcon name={k.icon} className={`text-[22px] ${k.tone}`} />
            </div>
            <p className="mt-2 font-display text-[32px] font-semibold text-on-surface">
              {k.value} <span className="text-base text-on-surface-variant">ETB</span>
            </p>
            <p className="flex items-center gap-1 text-sm font-bold text-secondary">
              <MIcon name="trending_up" className="text-[16px]" /> {k.delta}
              <span className="font-normal text-on-surface-variant">
                {" "}
                vs last month
              </span>
            </p>
          </Bento>
        ))}

        {/* Commission chart */}
        <Bento className="col-span-12 lg:col-span-8">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h4 className="font-display text-[20px] font-semibold text-on-surface">
                Commission revenue
              </h4>
              <p className="text-sm text-on-surface-variant">
                Platform earnings — last 6 months (000s ETB)
              </p>
            </div>
            <div className="flex gap-2">
              {["7D", "30D", "90D"].map((r, i) => (
                <button
                  key={r}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                    i === 1
                      ? "bg-primary text-on-primary"
                      : "border border-outline-variant bg-surface-container-high text-on-surface"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <LineChart data={s.revenueSeries} stroke="#b5e530" height={240} />
        </Bento>

        {/* Action queue */}
        <Bento className="col-span-12 lg:col-span-4">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-display text-[20px] font-semibold text-on-surface">
              Action queue
            </h4>
            <span className="rounded-full bg-error-container px-2 py-0.5 text-[10px] font-bold text-on-error-container">
              {mockVerifications.length + mockFlagged.length} OPEN
            </span>
          </div>
          <div className="space-y-3">
            <Link
              href="/admin/verifications"
              className="group flex items-start gap-3 rounded-xl border border-outline-variant bg-surface-container-low p-3 transition-colors hover:bg-surface-container"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-primary">
                <MIcon name="verified_user" className="text-[22px]" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-on-surface">
                  {mockVerifications.length} pending verifications
                </p>
                <p className="text-[12px] text-on-surface-variant">
                  Trainers awaiting review
                </p>
              </div>
              <MIcon name="chevron_right" className="text-[20px] text-on-surface-variant group-hover:text-primary" />
            </Link>
            <Link
              href="/admin/moderation"
              className="group flex items-start gap-3 rounded-xl border border-outline-variant bg-surface-container-low p-3 transition-colors hover:bg-surface-container"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-error/10 text-error">
                <MIcon name="flag" className="text-[22px]" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-on-surface">
                  {mockFlagged.length} flagged items
                </p>
                <p className="text-[12px] text-on-surface-variant">
                  Reviews & messages to moderate
                </p>
              </div>
              <MIcon name="chevron_right" className="text-[20px] text-on-surface-variant group-hover:text-primary" />
            </Link>
          </div>
        </Bento>

        {/* Recent activity */}
        <Bento className="col-span-12 lg:col-span-7">
          <h4 className="mb-6 font-display text-[20px] font-semibold text-on-surface">
            Recent activity
          </h4>
          <div>
            {activity.map((a, i) => (
              <div
                key={a.name}
                className={`flex items-center justify-between py-4 ${
                  i < activity.length - 1 ? "border-b border-outline-variant" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`grid h-10 w-10 place-items-center rounded-lg ${a.ic}`}>
                    <MIcon name={a.icon} className="text-[20px]" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">{a.name}</p>
                    <p className="text-xs text-on-surface-variant">{a.note}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${a.tone}`}>{a.val}</p>
                  <p className="text-[10px] text-on-surface-variant">{a.when}</p>
                </div>
              </div>
            ))}
          </div>
        </Bento>

        {/* Growth target */}
        <div className="relative col-span-12 overflow-hidden rounded-[24px] bento-card lg:col-span-5">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/10 blur-[80px]" />
          <div className="relative flex h-full flex-col justify-end p-6">
            <Eyebrow className="mb-2 text-primary">Growth target</Eyebrow>
            <h4 className="mb-4 font-display text-[28px] font-semibold leading-tight text-on-surface">
              You&apos;re 88% toward the Q3 milestone.
            </h4>
            <div className="mb-6 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[88%] bg-primary" />
            </div>
            <button className="w-fit rounded-xl bg-on-surface px-6 py-2 text-sm font-bold text-background hover:opacity-90">
              Optimize strategy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
