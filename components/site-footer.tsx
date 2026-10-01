import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone, ShieldCheck, Sparkles } from "lucide-react";

const footerLinks = [
  { href: "/products", label: "Products" },
  { href: "/categories", label: "Categories" },
  { href: "/orders", label: "Orders" },
  { href: "/medical-card", label: "Medical Card" },
];

const supportLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-16 overflow-hidden border-t border-blue-100 bg-[linear-gradient(180deg,#eff6ff_0%,#ffffff_28%,#f8fbff_100%)] text-gray-900 sm:mt-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.1),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(191,219,254,0.26),transparent_28%)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid gap-5 sm:gap-6 lg:grid-cols-[1.2fr_0.75fr_0.75fr] lg:gap-8">
          <div className="rounded-[2rem] border border-white/80 bg-white/85 p-5 shadow-[0_24px_80px_-50px_rgba(15,23,42,0.45)] backdrop-blur sm:rounded-[2.25rem] sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-700 shadow-sm sm:px-4 sm:text-xs sm:tracking-[0.24em]">
              <Sparkles className="h-4 w-4" />
              WeCure Pharmacy
            </div>
            <h2 className="mt-4 max-w-xl text-2xl font-semibold tracking-tight text-gray-950 sm:mt-5 sm:text-4xl">
              A trusted way to shop health essentials in Zambia.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500 sm:mt-4 sm:text-base sm:leading-7">
              Order medicines, cosmetics, baby products, and AgroVet essentials with a shopping experience designed for speed, trust, and easier checkout.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:mt-6 sm:flex-row sm:flex-wrap">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
              >
                Shop products
              </Link>
              <a
                href="mailto:info@wecurepharmacy.com"
                className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
              >
                Email support
              </a>
            </div>

            <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-3">
              {[
                { title: "Genuine medicines", text: "Trusted pharmacy essentials" },
                { title: "Open 24/7", text: "Support when you need it" },
                { title: "Secure payments", text: "Checkout with confidence" },
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200/70 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-blue-600">
                    <ShieldCheck className="h-4 w-4" />
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      {item.title}
                    </p>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-gray-900">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white/85 p-5 shadow-sm backdrop-blur sm:rounded-[2.25rem] sm:p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">
              Explore
            </h3>
            <div className="mt-5 flex flex-col gap-3">
              {footerLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="inline-flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-blue-200 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
                >
                  <span>{link.label}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/80 bg-white/85 p-5 shadow-sm backdrop-blur sm:rounded-[2.25rem] sm:p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">
              Contact
            </h3>
            <div className="mt-5 space-y-4 text-sm text-gray-700">
              <p className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                <span>Avondale: Great East & Acacia Roads, Lusaka<br />Chalala: Joe Chibangu Road, next to Buffalo Park<br />Cairo Road: Provident House (collections only)</span>
              </p>
              <p className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                <a href="mailto:info@wecurepharmacy.com" className="hover:text-blue-700">info@wecurepharmacy.com</a>
              </p>
              <p className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                <a href="tel:+260771230217" className="hover:text-blue-700">+260 771 230 217</a>
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-blue-700">
                Operations
              </h3>
              <div className="mt-4 flex flex-col gap-3">
                {supportLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-3 text-sm font-medium text-gray-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
                  >
                    {link.label}
                  </Link>
                ))}
                <span className="rounded-2xl border border-slate-200/70 bg-slate-50 px-4 py-3 text-sm font-medium text-gray-700">Open 24/7</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-blue-100 pt-5 text-sm text-gray-500 sm:mt-8 sm:gap-3 sm:pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} WeCure Pharmacy. All rights reserved.</p>
          <p className="text-gray-400">
            Trusted health commerce, designed for clarity and speed.
          </p>
        </div>
      </div>
    </footer>
  );
}
