import { SectionHeading } from "@/components/section-heading";

type PageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageShell({ eyebrow, title, description }: PageShellProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-10 rounded-[2rem] border border-ink-900/10 bg-white p-8 shadow-sm">
        <p className="text-sm leading-7 text-ink-900/70">
          This route is scaffolded now and will be connected to the backend in the next phase.
        </p>
      </div>
    </section>
  );
}
