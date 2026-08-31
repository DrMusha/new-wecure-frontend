export function LoadingCard() {
  return (
    <div className="animate-pulse rounded-3xl border border-ink-900/10 bg-white p-5">
      <div className="h-44 rounded-2xl bg-ink-900/5" />
      <div className="mt-4 h-4 w-2/3 rounded-full bg-ink-900/5" />
      <div className="mt-3 h-3 w-1/2 rounded-full bg-ink-900/5" />
    </div>
  );
}
