"use client";

import { useState } from "react";
import { MIcon } from "@/components/ui/MIcon";
import { Bento, Eyebrow } from "@/components/app/kit";
import { mockEarnings } from "@/lib/mock";

export default function EarningsPage() {
  const [requested, setRequested] = useState(false);
  const growth = Math.round(
    ((mockEarnings.thisMonth - mockEarnings.lastMonth) / mockEarnings.lastMonth) *
      100
  );

  return (
    <div className="mx-auto max-w-[1200px]">
      <div className="grid grid-cols-12 gap-6">
        {/* Balance card */}
        <div className="group relative col-span-12 lg:col-span-8">
          <div className="absolute -inset-1 rounded-[26px] bg-gradient-to-r from-primary/20 to-secondary/20 opacity-25 blur transition duration-1000 group-hover:opacity-40" />
          <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[24px] border border-outline-variant bg-surface-container p-6 inner-glow">
            <div>
              <div className="mb-10 flex items-start justify-between">
                <div>
                  <Eyebrow>Total balance</Eyebrow>
                  <p className="mt-2 font-display text-[48px] font-semibold leading-none tracking-tight text-on-surface">
                    {mockEarnings.balance.toLocaleString()}
                    <span className="text-lg text-on-surface-variant"> ETB</span>
                  </p>
                </div>
                <span className="flex items-center gap-1 rounded-full bg-secondary-container/20 px-3 py-1 text-xs font-bold text-secondary">
                  <MIcon name="trending_up" className="text-[16px]" /> +{growth}%
                </span>
              </div>
              <div className="flex gap-12">
                <div>
                  <Eyebrow>Available for payout</Eyebrow>
                  <p className="font-display text-[20px] font-semibold text-on-surface">
                    {(mockEarnings.balance - mockEarnings.pendingPayout).toLocaleString()} ETB
                  </p>
                </div>
                <div>
                  <Eyebrow>Pending clearance</Eyebrow>
                  <p className="font-display text-[20px] font-semibold text-on-surface">
                    {mockEarnings.pendingPayout.toLocaleString()} ETB
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setRequested(true)}
                disabled={requested}
                className="flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-bold text-on-primary transition-all hover:scale-[1.02] disabled:opacity-60"
              >
                <MIcon name="payments" className="text-[20px]" />
                {requested ? "Payout requested" : "Request payout"}
              </button>
              <button className="flex items-center gap-2 rounded-xl border border-outline-variant bg-surface-container-high/50 px-8 py-4 font-bold text-on-surface hover:bg-surface-container-high">
                <MIcon name="receipt_long" className="text-[20px]" />
                Statements
              </button>
            </div>
          </div>
        </div>

        {/* MoM tiles */}
        <div className="col-span-12 grid grid-rows-2 gap-6 lg:col-span-4">
          <Bento className="flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <Eyebrow>Monthly goal</Eyebrow>
              <MIcon name="target" className="text-[20px] text-primary" />
            </div>
            <div>
              <div className="mb-2 flex items-end justify-between">
                <p className="font-display text-[32px] font-semibold text-on-surface">
                  84%
                </p>
                <p className="text-sm text-on-surface-variant">
                  {mockEarnings.thisMonth.toLocaleString()} / 22,000
                </p>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container-highest">
                <div className="h-full w-[84%] rounded-full bg-primary" />
              </div>
            </div>
          </Bento>
          <Bento className="flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <Eyebrow>Conversion rate</Eyebrow>
              <MIcon name="autorenew" className="text-[20px] text-secondary" />
            </div>
            <div className="flex items-end justify-between">
              <p className="font-display text-[32px] font-semibold text-on-surface">
                22.4%
              </p>
              <span className="flex items-center gap-1 text-sm text-secondary">
                <MIcon name="arrow_upward" className="text-[16px]" /> 3.2%
              </span>
            </div>
          </Bento>
        </div>

        {/* Secondary tiles */}
        {[
          { icon: "groups", tone: "text-tertiary bg-tertiary-container/10", label: "Active clients", value: "3 elite", sub: "Retention 94.2%", w: 94, bar: "bg-tertiary" },
          { icon: "timer", tone: "text-secondary bg-secondary-container/10", label: "Coaching hours", value: "124.5 hrs", sub: "Avg rate 700 ETB", w: 70, bar: "bg-secondary" },
        ].map((t) => (
          <Bento key={t.label} className="col-span-12 md:col-span-6 lg:col-span-4">
            <div className="mb-6 flex items-center gap-4">
              <span className={`grid h-12 w-12 place-items-center rounded-2xl ${t.tone}`}>
                <MIcon name={t.icon} className="text-[24px]" />
              </span>
              <div>
                <Eyebrow>{t.label}</Eyebrow>
                <p className="font-display text-[20px] font-semibold text-on-surface">
                  {t.value}
                </p>
              </div>
            </div>
            <p className="mb-2 text-sm text-on-surface-variant">{t.sub}</p>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container-highest">
              <div className={`h-full rounded-full ${t.bar}`} style={{ width: `${t.w}%` }} />
            </div>
          </Bento>
        ))}
        <Bento className="col-span-12 flex items-center justify-between md:col-span-6 lg:col-span-4">
          <div>
            <Eyebrow>Next payout</Eyebrow>
            <p className="mt-1 font-display text-[20px] font-semibold text-on-surface">
              Jul 24
            </p>
            <p className="mt-1 text-sm text-on-surface-variant">Telebirr deposit</p>
          </div>
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-outline-variant border-t-primary [animation-duration:3s]" />
        </Bento>

        {/* Transactions */}
        <div className="col-span-12 overflow-hidden rounded-[24px] bento-card">
          <div className="flex items-center justify-between border-b border-outline-variant p-6">
            <h4 className="font-display text-[20px] font-semibold text-on-surface">
              Transaction history
            </h4>
            <button className="rounded-xl bg-surface-container-high px-4 py-2 text-sm text-on-surface hover:bg-surface-container-highest">
              Export CSV
            </button>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-outline-variant/30">
                {["Client", "Date", "Status", "Amount"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {mockEarnings.transactions.map((t) => (
                <tr key={t.id} className="transition-colors hover:bg-surface-container/30">
                  <td className="px-6 py-5 font-semibold text-on-surface">
                    {t.client}
                  </td>
                  <td className="px-6 py-5 text-sm text-on-surface-variant">
                    {new Date(t.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        t.status === "paid"
                          ? "border-secondary/20 bg-secondary/10 text-secondary"
                          : "border-primary/20 bg-primary/10 text-primary"
                      }`}
                    >
                      {t.status === "paid" ? "Completed" : "Processing"}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-bold text-on-surface">
                    +{t.amount.toLocaleString()} ETB
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
