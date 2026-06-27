"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { TraineeOnboarding } from "@/components/onboarding/TraineeOnboarding";
import { TrainerOnboarding } from "@/components/onboarding/TrainerOnboarding";

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/signup");
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="h-96 w-full max-w-xl animate-pulse rounded-3xl border border-border bg-surface/40" />
    );
  }

  return user.role === "trainer" ? (
    <TrainerOnboarding />
  ) : (
    <TraineeOnboarding />
  );
}
