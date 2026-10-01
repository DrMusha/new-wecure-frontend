import Link from "next/link";
import { FileUp, MessageCircle, PackageSearch, Phone, Send } from "lucide-react";

const actions = [
  { label: "Shop now", href: "/products", icon: PackageSearch },
  { label: "Upload prescription", href: "/prescription", icon: FileUp },
  { label: "Call now", href: "tel:+260771230217", icon: Phone },
  { label: "WhatsApp", href: "https://wa.me/260771230217", icon: MessageCircle },
  { label: "Bulk order quote", href: "mailto:info@wecurepharmacy.com?subject=Bulk%20order%20quotation", icon: Send },
];

export function HomeActions() {
  return <section className="mx-auto -mt-2 max-w-7xl px-4 sm:px-6 lg:px-8">
    <div className="grid gap-2 rounded-[1.5rem] border border-sand-200 bg-white p-3 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.45)] sm:grid-cols-5">
      {actions.map((action) => { const Icon = action.icon; return <Link key={action.label} href={action.href} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-ink-900 transition hover:bg-brand-50 hover:text-brand-700"><Icon className="h-4 w-4 text-brand-600" />{action.label}</Link>; })}
    </div>
  </section>;
}
