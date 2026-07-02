"use client";

import { AppFrame, AppLoading } from "@/components/app/AppFrame";
import { useRoleGuard } from "@/components/app/useRoleGuard";
import { trainerNav } from "@/lib/nav";

export default function TrainerAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ready = useRoleGuard("trainer");
  if (!ready) return <AppLoading />;

  return (
    <AppFrame items={trainerNav} homeHref="/trainer">
      {children}
    </AppFrame>
  );
}
