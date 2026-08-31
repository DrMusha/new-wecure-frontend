import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

type ErrorStateProps = {
  title: string;
  description: string;
  retryHref?: string;
};

export function ErrorState({ title, description, retryHref = "/" }: ErrorStateProps) {
  return (
    <div className="rounded-[2rem] border border-coral-200 bg-coral-50 p-8">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-coral-300 shadow-sm">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-ink-950">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-ink-900/70">{description}</p>
          <Link
            href={retryHref}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-800"
          >
            <RotateCcw className="h-4 w-4" />
            Try again
          </Link>
        </div>
      </div>
    </div>
  );
}
