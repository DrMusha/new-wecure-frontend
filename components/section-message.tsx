import Link from "next/link";

type SectionMessageProps = {
  title: string;
  description: string;
  action?: { href: string; label: string };
};

export function SectionMessage({ title, description, action }: SectionMessageProps) {
  return (
    <div className="rounded-[2rem] border border-dashed border-ink-900/10 bg-white p-8">
      <h2 className="text-xl font-semibold text-ink-950">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-ink-900/65">{description}</p>
      {action ? <Link href={action.href} className="mt-5 inline-flex rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">{action.label}</Link> : null}
    </div>
  );
}
