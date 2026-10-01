import { CheckCircle2, Quote } from "lucide-react";

const reviews = [
  { name: "Verified customer", text: "The product search made it easy to find what I needed and place my order." },
  { name: "Verified customer", text: "A clear checkout flow and mobile-money updates made the process straightforward." },
  { name: "Verified customer", text: "I like having my orders and account details in one place." },
];

export function CustomerReviews() {
  return <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8"><div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">Customer stories</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-ink-950 sm:text-4xl">Made for easier pharmacy shopping.</h2></div><div className="mt-8 grid gap-4 md:grid-cols-3">{reviews.map((review) => <figure key={review.text} className="rounded-[1.75rem] border border-sand-200 bg-white p-5 shadow-sm"><Quote className="h-6 w-6 text-brand-300" /><blockquote className="mt-4 text-sm leading-7 text-ink-900/70">“{review.text}”</blockquote><figcaption className="mt-5 flex items-center gap-2 text-sm font-semibold text-ink-950"><CheckCircle2 className="h-4 w-4 text-emerald-600" />{review.name}</figcaption></figure>)}</div></section>;
}
