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
      <div className="flex items-center w-fit h-fit rounded-lg border gap-1 p-2 shadow">
        <div className="w-1 h-6 rounded-full bg-blue-400" />
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gray-800">
          {eyebrow}
        </p>
      </div>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-sm leading-7 text-gray-500 sm:text-base">
          {description}
        </p>
      ) : null}
    </div>
  );
}
