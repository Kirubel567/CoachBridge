import { MIcon } from "@/components/ui/MIcon";
import { Bento, Eyebrow } from "@/components/app/kit";
import { mockPayments } from "@/lib/mock";

export default function PaymentsPage() {
  const paid = mockPayments.filter((p) => p.status === "paid");
  const totalPaid = paid.reduce((s, p) => s + p.amount, 0);
  const upcoming = mockPayments
    .filter((p) => p.status === "upcoming")
    .reduce((s, p) => s + p.amount, 0);

  return (
    <div className="mx-auto max-w-[1200px] space-y-8">
      {/* Summary strip */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Bento className="relative col-span-1 flex min-h-[180px] flex-col justify-between overflow-hidden md:col-span-2">
          <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />
          <div className="relative">
            <Eyebrow>Total spent this year</Eyebrow>
            <p className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-[48px] font-semibold tracking-tight text-on-surface">
                {totalPaid.toLocaleString()}
              </span>
              <span className="text-on-surface-variant">ETB</span>
            </p>
          </div>
          <div className="relative mt-4 flex gap-3">
            <span className="flex items-center gap-2 rounded-xl bg-surface-container-high px-4 py-2.5 text-sm">
              <MIcon name="account_balance_wallet" className="text-[18px] text-primary" />
              Telebirr · CBE
            </span>
          </div>
        </Bento>

        <Bento className="flex flex-col justify-between">
          <div>
            <Eyebrow>Upcoming</Eyebrow>
            <p className="mt-2 font-display text-[32px] font-semibold text-on-surface">
              {upcoming.toLocaleString()}
            </p>
          </div>
          <p className="mt-2 text-sm text-on-surface-variant">Due this week</p>
        </Bento>

        <Bento className="flex flex-col justify-between">
          <div>
            <Eyebrow>Transactions</Eyebrow>
            <p className="mt-2 font-display text-[32px] font-semibold text-on-surface">
              {paid.length}
            </p>
          </div>
          <p className="mt-2 flex items-center gap-1 text-sm text-on-surface-variant">
            <MIcon name="schedule" className="text-[16px]" /> Lifetime
          </p>
        </Bento>
      </section>

      {/* Billing history */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-display text-[20px] font-semibold text-on-surface">
            Billing history
          </h2>
          <div className="flex gap-2">
            <button className="grid h-9 w-9 place-items-center rounded-lg border border-outline-variant text-on-surface-variant hover:text-on-surface">
              <MIcon name="filter_list" className="text-[20px]" />
            </button>
            <button className="grid h-9 w-9 place-items-center rounded-lg border border-outline-variant text-on-surface-variant hover:text-on-surface">
              <MIcon name="download" className="text-[20px]" />
            </button>
          </div>
        </div>
        <div className="overflow-hidden rounded-[24px] bento-card">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-outline-variant/30">
                {["Description", "Date", "Method", "Amount", "Status"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {mockPayments.map((p) => (
                <tr
                  key={p.id}
                  className="transition-colors hover:bg-surface-container-low"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                        <MIcon name="fitness_center" className="text-[20px]" />
                      </span>
                      <span className="text-sm font-semibold text-on-surface">
                        {p.description}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm text-on-surface-variant">
                    {new Date(p.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-5 text-sm text-on-surface-variant">
                    {p.method}
                  </td>
                  <td className="px-6 py-5 text-sm font-semibold text-on-surface">
                    {p.amount.toLocaleString()} ETB
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                        p.status === "paid"
                          ? "border-secondary/20 bg-secondary/10 text-secondary"
                          : "border-on-surface-variant/20 bg-on-surface-variant/10 text-on-surface-variant"
                      }`}
                    >
                      {p.status === "paid" ? "Completed" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Payment method */}
      <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Bento className="flex items-center gap-6">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-secondary/10 text-secondary">
            <MIcon name="account_balance" className="text-[28px]" />
          </span>
          <div className="flex-1">
            <h4 className="font-display text-[20px] font-semibold text-on-surface">
              Payment method
            </h4>
            <p className="text-sm text-on-surface-variant">Telebirr •••• 4829</p>
          </div>
          <button className="text-sm font-semibold text-primary hover:underline">
            Change
          </button>
        </Bento>
        <button className="flex items-center justify-center gap-3 rounded-[24px] border border-dashed border-outline-variant bg-surface-container-low p-6 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-on-surface">
          <MIcon name="add_circle" className="text-[24px]" />
          Add another payment method
        </button>
      </section>

      <p className="text-center text-xs text-on-surface-variant">
        Payments are processed securely via Chapa (Telebirr, CBE Birr, card).
      </p>
    </div>
  );
}
