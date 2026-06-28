"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MIcon } from "@/components/ui/MIcon";
import { Brand } from "@/components/app/Brand";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/cn";
import { activeHref, type NavItem } from "@/lib/nav";

function NavContent({
  items,
  onNavigate,
}: {
  items: NavItem[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const active = activeHref(pathname, items);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="flex h-full flex-col">
      <div className="px-3">
        <Brand />
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1 px-3">
        {items.map((item) => {
          const isActive = active === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors",
                isActive
                  ? "nav-active bg-primary-container/10 font-medium text-primary"
                  : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
              )}
            >
              <MIcon
                name={item.icon}
                filled={isActive}
                className="text-[20px]"
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 border-t border-outline-variant/40 px-3 pt-4">
        <div className="mb-2 flex items-center gap-3 rounded-xl px-2 py-2">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-surface-container-high text-xs font-bold text-on-surface">
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-on-surface">
              {user?.name}
            </p>
            <p className="truncate text-xs capitalize text-on-surface-variant">
              {user?.role}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            logout();
            onNavigate?.();
          }}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
        >
          <MIcon name="logout" className="text-[20px]" />
          Sign out
        </button>
      </div>
    </div>
  );
}

export function Sidebar({
  items,
  mobileOpen,
  onClose,
}: {
  items: NavItem[];
  homeHref?: string;
  mobileOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] border-r border-outline-variant bg-background py-6 lg:block">
        <NavContent items={items} />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] border-r border-outline-variant bg-background py-6 lg:hidden"
            >
              <NavContent items={items} onNavigate={onClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
