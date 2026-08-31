export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="h-72 animate-pulse rounded-[2rem] bg-white" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="h-80 animate-pulse rounded-[2rem] bg-white" />
        <div className="h-80 animate-pulse rounded-[2rem] bg-white" />
        <div className="h-80 animate-pulse rounded-[2rem] bg-white" />
      </div>
    </div>
  );
}
