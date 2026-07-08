"use client";

import { useState } from "react";
import { MIcon } from "@/components/ui/MIcon";
import { Bento, Eyebrow } from "@/components/app/kit";
import { mockUsers, mockAdminStats } from "@/lib/mock";
import { cn } from "@/lib/cn";

const tabs = ["All users", "Trainers", "Trainees"];

export default function UsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [q, setQ] = useState("");
  const [tab, setTab] = useState(tabs[0]);

  const filtered = users.filter((u) => {
    const matchesQ =
      u.name.toLowerCase().includes(q.toLowerCase()) ||
      u.email.toLowerCase().includes(q.toLowerCase());
    const matchesTab =
      tab === "All users" ||
      (tab === "Trainers" && u.role === "trainer") ||
      (tab === "Trainees" && u.role === "trainee");
    return matchesQ && matchesTab;
  });

  const toggleStatus = (id: string) =>
    setUsers((p) =>
      p.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "active" ? "suspended" : "active" }
          : u
      )
    );
  const remove = (id: string) => {
    if (confirm("Delete this user?")) setUsers((p) => p.filter((u) => u.id !== id));
  };

  const stats = [
    { l: "Total users", v: mockAdminStats.totalUsers.toLocaleString(), d: "+12% this month", tone: "text-secondary", icon: "group" },
    { l: "Active trainers", v: mockAdminStats.trainers.toLocaleString(), d: "Global", tone: "text-on-surface-variant", icon: "fitness_center" },
    { l: "System load", v: "24%", d: "Optimal health", tone: "text-secondary", icon: "memory" },
    { l: "Pending invites", v: "43", d: "Action required", tone: "text-error", icon: "mail" },
  ];

  return (
    <div className="mx-auto max-w-[1300px] space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        {stats.map((s) => (
          <Bento key={s.l} className="relative overflow-hidden">
            <Eyebrow className="mb-2">{s.l}</Eyebrow>
            <p className="font-display text-[32px] font-semibold text-on-surface">
              {s.v}
            </p>
            <p className={`mt-2 flex items-center gap-1 text-[12px] ${s.tone}`}>
              {s.d}
            </p>
            <MIcon
              name={s.icon}
              className="pointer-events-none absolute -bottom-4 -right-2 text-[120px] text-on-surface/[0.04]"
            />
          </Bento>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
        <div className="relative w-full md:w-80">
          <MIcon
            name="search"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-on-surface-variant"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search users, roles, email…"
            className="w-full rounded-xl border border-outline-variant bg-surface-container-low py-2.5 pl-10 pr-4 text-sm text-on-surface outline-none focus:border-primary"
          />
        </div>
        <div className="flex rounded-xl border border-outline-variant bg-surface-container-low p-1">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-lg px-4 py-1.5 text-sm transition-colors",
                tab === t
                  ? "bg-primary/20 text-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-[24px] bento-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container/50">
                {["User", "Role", "Status", "Joined", "Engagement", ""].map((h) => (
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
              {filtered.map((u, i) => (
                <tr key={u.id} className="group transition-colors hover:bg-surface-container-high/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <span className="grid h-10 w-10 place-items-center rounded-xl border border-outline-variant bg-surface-container text-xs font-bold text-on-surface">
                        {u.name.split(" ").map((p) => p[0]).join("")}
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-on-surface">
                          {u.name}
                        </p>
                        <p className="text-[12px] text-on-surface-variant">
                          {u.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-wider",
                        u.role === "trainer"
                          ? "border-primary/20 bg-primary/10 text-primary"
                          : "border-outline-variant bg-surface-container-high text-on-surface-variant"
                      )}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          u.status === "active" ? "bg-secondary" : "bg-error"
                        )}
                      />
                      <span className="text-sm capitalize text-on-surface">
                        {u.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">
                    {new Date(u.joined).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-1 w-24 overflow-hidden rounded-full bg-outline-variant">
                      <div
                        className="h-full bg-secondary"
                        style={{ width: `${[85, 42, 98, 12, 66, 74][i % 6]}%` }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        onClick={() => toggleStatus(u.id)}
                        className="grid h-8 w-8 place-items-center rounded-lg text-on-surface-variant hover:text-primary"
                        title={u.status === "active" ? "Suspend" : "Activate"}
                      >
                        <MIcon
                          name={u.status === "active" ? "block" : "check_circle"}
                          className="text-[20px]"
                        />
                      </button>
                      <button
                        onClick={() => remove(u.id)}
                        className="grid h-8 w-8 place-items-center rounded-lg text-on-surface-variant hover:text-error"
                        title="Delete"
                      >
                        <MIcon name="delete" className="text-[20px]" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant">
                    No users match “{q}”.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-outline-variant/30 bg-surface-container/30 px-6 py-4">
          <p className="text-sm text-on-surface-variant">
            Showing {filtered.length} of{" "}
            {mockAdminStats.totalUsers.toLocaleString()} users
          </p>
          <div className="flex gap-2">
            <button className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-on-primary text-sm">
              1
            </button>
            <button className="grid h-8 w-8 place-items-center rounded-lg text-sm text-on-surface hover:bg-surface-container-high">
              2
            </button>
            <button className="grid h-8 w-8 place-items-center rounded-lg border border-outline-variant hover:bg-surface-container-high">
              <MIcon name="chevron_right" className="text-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
