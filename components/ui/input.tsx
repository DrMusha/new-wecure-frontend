import { cn } from "@/lib/utils";
import { type InputHTMLAttributes } from "react";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-2xl border border-ink-900/10 bg-white px-4 text-sm text-ink-950 outline-none transition placeholder:text-ink-900/35 focus:border-brand-300 focus:ring-4 focus:ring-brand-100",
        className,
      )}
      {...props}
    />
  );
}
