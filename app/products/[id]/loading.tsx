export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="aspect-square animate-pulse rounded-[2rem] bg-white" />
        <div className="animate-pulse rounded-[2rem] bg-white p-8">
          <div className="h-4 w-40 rounded-full bg-ink-900/5" />
          <div className="mt-4 h-12 w-3/4 rounded-full bg-ink-900/5" />
          <div className="mt-6 h-8 w-1/3 rounded-full bg-ink-900/5" />
        </div>
      </div>
    </div>
  );
}
