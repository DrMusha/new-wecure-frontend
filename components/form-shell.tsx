import { type ReactNode } from "react";

type FormShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
  topContent?: ReactNode;
};

export function FormShell({ eyebrow, title, description, children, topContent }: FormShellProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-ink-900/10 bg-white p-8 shadow-sm">
        {topContent ? <div className="mb-6">{topContent}</div> : null}
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-600">
          {eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink-950">{title}</h1>
        <p className="mt-3 text-sm leading-7 text-ink-900/70">{description}</p>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
