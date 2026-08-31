import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeading({ eyebrow, title, description, className }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <div className="flex h-fit w-fit items-center gap-1 rounded-lg border p-1.5 shadow sm:p-2">
        <div className="h-5 w-1 rounded-full bg-blue-400 sm:h-6" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-800 sm:text-sm sm:tracking-[0.24em]">
          {eyebrow}
        </p>
      </div>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-sm leading-6 text-gray-500 sm:mt-4 sm:text-base sm:leading-7">
          {description}
        </p>
      ) : null}
    </div>
  );
}
