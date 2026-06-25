"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

export default function VerifyEmailPage() {
  const [resent, setResent] = useState(false);

  return (
    <div className="rounded-3xl border border-border bg-surface/60 p-8 text-center backdrop-blur-xl">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-accent-strong/15 text-accent ring-1 ring-accent-strong/25">
        <Icon name="chat" className="h-8 w-8" />
      </div>
      <h1 className="mt-6 font-display text-2xl font-semibold">
        Verify your email
      </h1>
      <p className="mt-2 text-muted">
        We&apos;ve sent a confirmation link to your inbox. Click it to activate
        your account.
      </p>

      <div className="mt-6 flex flex-col items-center gap-3">
        <Button
          variant="outline"
          onClick={() => setResent(true)}
          disabled={resent}
        >
          {resent ? "Link resent ✓" : "Resend link"}
        </Button>
        <Link href="/login" className="text-sm text-muted hover:text-fg">
          Back to login
        </Link>
      </div>
    </div>
  );
}
