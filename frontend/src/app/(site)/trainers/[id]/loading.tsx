export default function Loading() {
  return (
    <main className="pt-28 pb-24">
      <div className="container-x">
        <div className="mb-8 h-4 w-32 animate-pulse rounded bg-surface-2" />
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div>
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 animate-pulse rounded-3xl bg-surface-2" />
              <div className="space-y-2">
                <div className="h-8 w-48 animate-pulse rounded bg-surface-2" />
                <div className="h-4 w-32 animate-pulse rounded bg-surface-2" />
              </div>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 animate-pulse rounded-2xl bg-surface-2"
                />
              ))}
            </div>
            <div className="mt-10 h-24 animate-pulse rounded-2xl bg-surface-2" />
          </div>
          <div className="h-96 animate-pulse rounded-3xl bg-surface-2" />
        </div>
      </div>
    </main>
  );
}
