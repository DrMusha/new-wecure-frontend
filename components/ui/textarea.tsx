import { cn } from "@/lib/utils";
import { type TextareaHTMLAttributes } from "react";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-28 w-full rounded-2xl border border-ink-900/10 bg-white px-4 py-3 text-sm text-ink-950 outline-none transition placeholder:text-ink-900/35 focus:border-brand-300 focus:ring-4 focus:ring-brand-100",
        className,
      )}
      {...props}
    />
  );
}
