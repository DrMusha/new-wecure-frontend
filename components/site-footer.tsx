import Link from "next/link";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";

const shopLinks = [
  { href: "/products", label: "Shop products" },
  { href: "/categories", label: "Browse categories" },
  { href: "/prescription", label: "Upload prescription" },
  { href: "/orders", label: "My orders" },
];

const companyLinks = [
  { href: "/about", label: "About WeCure" },
  { href: "/contact", label: "Contact us" },
  { href: "/terms", label: "Terms of use" },
  { href: "/privacy", label: "Privacy" },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-brand-100 bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_32%)] text-ink-950 sm:mt-20">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="grid gap-10 border-b border-sand-200 pb-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.8fr_1.25fr] lg:gap-8 lg:pb-12">
          <div className="max-w-sm">
            <BrandMark />
            <h2 className="mt-5 text-2xl font-bold tracking-tight text-ink-950">Health essentials, made easier.</h2>
            <p className="mt-3 text-sm leading-7 text-ink-900/65">Your online pharmacy for medicines, wellness, personal care, and everyday health essentials.</p>
            <div className="mt-5 flex items-center gap-4">
              <Link href="/products" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition hover:text-brand-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100">
                Shop products <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </Link>
              <span className="inline-flex items-center gap-2 text-xs font-semibold text-ink-900/60"><span className="h-2 w-2 rounded-full bg-emerald-500" />Open 24/7</span>
            </div>
          </div>

          <FooterLinks title="Shop" links={shopLinks} />
          <FooterLinks title="Company" links={companyLinks} />

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Find or contact us</h2>
            <div className="mt-5 space-y-5 text-sm leading-6 text-ink-900/70">
              <div className="flex gap-3"><span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600"><MapPin className="h-4 w-4" aria-hidden="true" /></span><ul className="space-y-1.5"><li><span className="font-semibold text-ink-900">Avondale</span> · Great East &amp; Acacia Roads, Lusaka</li><li><span className="font-semibold text-ink-900">Chalala</span> · Joe Chibangu Road, next to Buffalo Park</li><li><span className="font-semibold text-ink-900">Cairo Road</span> · Provident House, collections only</li></ul></div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                <a href="mailto:info@wecurepharmacy.com" className="group flex items-center gap-3 font-medium text-ink-900 transition hover:text-brand-700"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600"><Mail className="h-4 w-4" aria-hidden="true" /></span><span className="break-all">info@wecurepharmacy.com</span></a>
                <a href="tel:+260771230217" className="group flex items-center gap-3 font-medium text-ink-900 transition hover:text-brand-700"><span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600"><Phone className="h-4 w-4" aria-hidden="true" /></span>+260 771 230 217</a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-6 text-xs text-ink-900/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} WeCure Pharmacy. All rights reserved.</p>
          <p>Clear choices for everyday health.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">{title}</h2>
      <ul className="mt-5 space-y-3">
        {links.map((link) => <li key={link.href}><Link href={link.href} className="group inline-flex items-center gap-1 text-sm text-ink-900/70 transition hover:text-brand-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100">{link.label}<ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" aria-hidden="true" /></Link></li>)}
      </ul>
    </div>
  );
}
