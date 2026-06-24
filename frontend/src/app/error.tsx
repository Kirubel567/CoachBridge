"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // In production this is where you'd report to your error tracker.
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="max-w-md text-center">
        <p className="font-display text-6xl font-bold text-gradient">Oops</p>
        <h1 className="mt-4 font-display text-2xl font-semibold">
          Something went wrong
        </h1>
        <p className="mt-3 text-muted">
          An unexpected error occurred. You can try again, or head back home.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-full bg-accent-strong px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-105"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-full border border-border px-6 py-3 text-sm font-medium text-fg transition-colors hover:bg-surface"
          >
            Back home
          </Link>
        </div>
      </div>
    </main>
  );
}
