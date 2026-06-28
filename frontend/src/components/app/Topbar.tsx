"use client";

import { usePathname } from "next/navigation";
import { MIcon } from "@/components/ui/MIcon";
import { useAuth } from "@/components/auth/AuthProvider";
import { activeHref, type NavItem } from "@/lib/nav";

export function Topbar({
  items,
  onMenuClick,
}: {
  items: NavItem[];
  onMenuClick: () => void;
}) {
  const pathname = usePathname();
  const { user } = useAuth();
  const active = activeHref(pathname, items);
  const title = items.find((n) => n.href === active)?.label ?? "Dashboard";

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-outline-variant bg-background/80 px-6 backdrop-blur-md sm:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="grid h-9 w-9 place-items-center rounded-lg border border-outline-variant text-on-surface lg:hidden"
        >
          <MIcon name="menu" className="text-[20px]" />
        </button>
        <h1 className="font-display text-[24px] font-semibold text-on-surface">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          aria-label="Notifications"
          className="relative grid h-9 w-9 place-items-center rounded-lg text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
        >
          <MIcon name="notifications" className="text-[22px]" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-secondary" />
        </button>
        <span className="grid h-9 w-9 place-items-center rounded-full border border-outline-variant bg-surface-container-high text-xs font-bold text-on-surface">
          {initials}
        </span>
      </div>
    </header>
  );
}
