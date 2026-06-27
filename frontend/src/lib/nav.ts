import type { Role } from "./types";

// `icon` values are Material Symbols Outlined names (the Stitch icon set).
export type NavItem = { label: string; href: string; icon: string };

/** The landing route for each role's authed area. */
export function homeForRole(role: Role) {
  if (role === "admin") return "/admin";
  if (role === "trainer") return "/trainer";
  return "/dashboard";
}

export const traineeNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Find trainers", href: "/dashboard/trainers", icon: "search" },
  { label: "My bookings", href: "/dashboard/bookings", icon: "calendar_month" },
  { label: "Messages", href: "/dashboard/messages", icon: "forum" },
  { label: "My plans", href: "/dashboard/plans", icon: "fitness_center" },
  { label: "Progress", href: "/dashboard/progress", icon: "monitoring" },
  { label: "Payments", href: "/dashboard/payments", icon: "payments" },
  { label: "Settings", href: "/dashboard/settings", icon: "settings" },
];

export const trainerNav: NavItem[] = [
  { label: "Dashboard", href: "/trainer", icon: "dashboard" },
  { label: "Requests", href: "/trainer/requests", icon: "how_to_reg" },
  { label: "Clients", href: "/trainer/clients", icon: "group" },
  { label: "Schedule", href: "/trainer/schedule", icon: "calendar_month" },
  { label: "Programs", href: "/trainer/programs", icon: "fitness_center" },
  { label: "Messages", href: "/trainer/messages", icon: "forum" },
  { label: "Earnings", href: "/trainer/earnings", icon: "payments" },
  { label: "Reviews", href: "/trainer/reviews", icon: "reviews" },
  { label: "Profile", href: "/trainer/profile", icon: "manage_accounts" },
];

export const adminNav: NavItem[] = [
  { label: "Overview", href: "/admin", icon: "dashboard" },
  { label: "Verifications", href: "/admin/verifications", icon: "verified_user" },
  { label: "Users", href: "/admin/users", icon: "group" },
  { label: "Moderation", href: "/admin/moderation", icon: "gavel" },
  { label: "Reports", href: "/admin/reports", icon: "insights" },
];

/** Longest-prefix match so nested routes highlight the right item. */
export function activeHref(pathname: string, items: NavItem[]) {
  return [...items]
    .sort((a, b) => b.href.length - a.href.length)
    .find((n) => pathname === n.href || pathname.startsWith(n.href + "/"))?.href;
}
