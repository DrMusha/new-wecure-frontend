"use client";

import { ErrorState } from "@/components/error-state";

export default function CategoriesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <ErrorState
        title="We could not load categories right now."
        description={error.message || "Something went wrong while loading categories."}
        retryHref="/categories"
      />
      <button onClick={reset} className="sr-only" type="button">
        Retry
      </button>
    </div>
  );
}
