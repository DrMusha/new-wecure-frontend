type SectionMessageProps = {
  title: string;
  description: string;
};

export function SectionMessage({ title, description }: SectionMessageProps) {
  return (
    <div className="rounded-[2rem] border border-dashed border-ink-900/10 bg-white p-8">
      <h2 className="text-xl font-semibold text-ink-950">{title}</h2>
      <p className="mt-2 text-sm leading-7 text-ink-900/65">{description}</p>
    </div>
  );
}
