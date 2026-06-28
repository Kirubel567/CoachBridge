"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import type { NavItem } from "@/lib/nav";

export function AppFrame({
  items,
  homeHref,
  children,
}: {
  items: NavItem[];
  homeHref: string;
  children: ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-on-surface">
      <Sidebar
        items={items}
        homeHref={homeHref}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div className="flex min-h-screen flex-col lg:pl-[248px]">
        <Topbar items={items} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 px-6 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  );
}

export function AppLoading() {
  return (
    <div className="grid min-h-screen place-items-center bg-background">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-outline-variant border-t-primary" />
    </div>
  );
}
