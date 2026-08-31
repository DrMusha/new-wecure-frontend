export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="h-20 animate-pulse rounded-[2rem] bg-white" />
      <div className="mt-8 space-y-6">
        <div className="h-[40rem] animate-pulse rounded-[2rem] bg-white" />
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-72 animate-pulse rounded-[2rem] bg-white" />
          <div className="h-72 animate-pulse rounded-[2rem] bg-white" />
        </div>
      </div>
    </div>
  );
}
