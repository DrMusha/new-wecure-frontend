export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="h-9 w-36 animate-pulse rounded-full bg-sand-200" />
      <div className="mt-6 rounded-[2rem] border border-brand-100 bg-white p-6 sm:rounded-[2.5rem] sm:p-9">
        <div className="h-3 w-32 animate-pulse rounded bg-sand-200" />
        <div className="mt-4 h-10 w-3/4 max-w-xl animate-pulse rounded bg-sand-200" />
        <div className="mt-4 h-5 w-full max-w-2xl animate-pulse rounded bg-sand-100" />
      </div>
      <div className="mt-12 h-9 w-56 animate-pulse rounded bg-sand-200" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-[2rem] border border-sand-200 bg-white p-3">
            <div className="aspect-[16/10] animate-pulse rounded-[1.5rem] bg-sand-200" />
            <div className="p-3">
              <div className="h-3 w-20 animate-pulse rounded bg-sand-200" />
              <div className="mt-3 h-6 w-2/3 animate-pulse rounded bg-sand-200" />
              <div className="mt-3 h-4 w-full animate-pulse rounded bg-sand-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
