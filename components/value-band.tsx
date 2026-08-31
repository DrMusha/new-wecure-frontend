const values = [
  "Medications",
  "Cosmetics",
  "Baby products",
  "AgroVet essentials",
];

export function ValueBand() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-[2rem] border border-ink-900/10 bg-ink-950 px-6 py-5 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm font-medium text-white/70">
            The original WeCare storefront spoke to every household need.
          </p>
          <div className="flex flex-wrap gap-2">
            {values.map((value) => (
              <span key={value} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-white/80">
                {value}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
