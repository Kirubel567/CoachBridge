"use client";

import { AppFrame, AppLoading } from "@/components/app/AppFrame";
import { useRoleGuard } from "@/components/app/useRoleGuard";
import { traineeNav } from "@/lib/nav";

export default function TraineeAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const ready = useRoleGuard("trainee");
  if (!ready) return <AppLoading />;

  return (
    <AppFrame items={traineeNav} homeHref="/dashboard">
      {children}
    </AppFrame>
  );
}
