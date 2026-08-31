type AuthMessageProps = {
  tone?: "success" | "error" | "neutral";
  children: string;
};

export function AuthMessage({ tone = "neutral", children }: AuthMessageProps) {
  const classes = {
    success: "border-brand-200 bg-brand-50 text-brand-700",
    error: "border-coral-200 bg-coral-50 text-coral-300",
    neutral: "border-ink-900/10 bg-sand-50 text-ink-800",
  }[tone];

  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm ${classes}`}>
      {children}
    </div>
  );
}
