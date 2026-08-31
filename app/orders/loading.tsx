export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="h-20 animate-pulse rounded-[2rem] bg-white" />
      <div className="mt-8 space-y-4">
        <div className="h-28 animate-pulse rounded-[2rem] bg-white" />
        <div className="h-28 animate-pulse rounded-[2rem] bg-white" />
      </div>
    </div>
  );
}
