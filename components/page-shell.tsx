import { SectionHeading } from "@/components/section-heading";

type PageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function PageShell({ eyebrow, title, description }: PageShellProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <div className="mt-8 rounded-[2rem] border border-ink-900/10 bg-white p-5 shadow-sm sm:mt-10 sm:p-8">
        <p className="text-sm leading-6 text-ink-900/70 sm:leading-7">
          This route is scaffolded now and will be connected to the backend in the next phase.
        </p>
      </div>
    </section>
  );
}
