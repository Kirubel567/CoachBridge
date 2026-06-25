import { Suspense } from "react";
import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Sign up — CoachBridge",
  description: "Create your CoachBridge account as a trainee or a trainer.",
};

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="h-96 animate-pulse rounded-3xl border border-border bg-surface/40" />
      }
    >
      <SignupForm />
    </Suspense>
  );
}
