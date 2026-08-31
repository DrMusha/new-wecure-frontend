import { LoadingCard } from "@/components/loading-card";

export default function Loading() {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-16 sm:px-6 md:grid-cols-4 lg:px-8">
      <LoadingCard />
      <LoadingCard />
      <LoadingCard />
    </div>
  );
}
