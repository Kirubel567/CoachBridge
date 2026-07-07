"use client";

import { AppFrame, AppLoading } from "@/components/app/AppFrame";
import { useRoleGuard } from "@/components/app/useRoleGuard";
import { adminNav } from "@/lib/nav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ready = useRoleGuard("admin");
  if (!ready) return <AppLoading />;

  return (
    <AppFrame items={adminNav} homeHref="/admin">
      {children}
    </AppFrame>
  );
}
