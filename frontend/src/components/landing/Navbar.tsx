"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { easeOutExpo } from "@/lib/motion";
import { useAuth } from "@/components/auth/AuthProvider";
import { Logo } from "@/components/Logo";

const links = [
  { label: "How it works", href: "/#how" },
  { label: "Find a trainer", href: "/#trainers" },
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/#pricing" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "You";
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: easeOutExpo }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="container-x">
        <div
          className={`mt-4 flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-500 ${
            scrolled ? "glass shadow-lg shadow-black/40" : "bg-transparent"
          }`}
        >
          <a href="/">
            <Logo />
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm text-muted transition-colors hover:text-fg"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <span className="flex items-center gap-2 text-sm">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-accent-strong text-xs font-bold text-white">
                    {initials}
                  </span>
                  <span className="hidden text-muted xl:inline">
                    Hi, {firstName}
                  </span>
                </span>
                <a
                  href={user.role === "trainer" ? "/trainer" : "/dashboard"}
                  className="rounded-full bg-fg px-5 py-2 text-sm font-medium text-ink transition-transform hover:scale-105"
                >
                  Dashboard
                </a>
                <button
                  onClick={logout}
                  className="rounded-full border border-border px-4 py-2 text-sm font-medium text-fg transition-colors hover:bg-surface"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className="text-sm text-muted transition-colors hover:text-fg"
                >
                  Log in
                </a>
                <a
                  href="/signup"
                  className="rounded-full bg-fg px-5 py-2 text-sm font-medium text-ink transition-transform hover:scale-105"
                >
                  Get started
                </a>
              </>
            )}
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border md:hidden"
            aria-label="Toggle menu"
          >
            <div className="space-y-1.5">
              <span
                className={`block h-0.5 w-5 bg-fg transition-transform ${
                  open ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-fg transition-opacity ${
                  open ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-5 bg-fg transition-transform ${
                  open ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </div>
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="glass mt-2 overflow-hidden rounded-2xl md:hidden"
            >
              <div className="flex flex-col p-4">
                {links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="rounded-lg px-3 py-3 text-sm text-muted hover:bg-surface-2 hover:text-fg"
                  >
                    {l.label}
                  </a>
                ))}
                <a
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-full bg-fg px-5 py-3 text-center text-sm font-medium text-ink"
                >
                  Get started
                </a>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
