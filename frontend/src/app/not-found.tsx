import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-6">
      <div className="text-center">
        <p className="font-display text-[8rem] font-bold leading-none text-gradient sm:text-[12rem]">
          404
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold">
          This page took a rest day
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-muted">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-accent-strong px-6 py-3 text-sm font-medium text-white transition-transform hover:scale-105"
          >
            Back home
          </Link>
          <Link
            href="/trainers"
            className="rounded-full border border-border px-6 py-3 text-sm font-medium text-fg transition-colors hover:bg-surface"
          >
            Find a trainer
          </Link>
        </div>
      </div>
    </main>
  );
}
