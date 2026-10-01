"use client";

import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { AuthStatus } from "@/components/auth-status";
import { CartLink } from "@/components/cart-link";
import { MobileNavigation } from "@/components/mobile-navigation";
import { ProductSearch } from "@/components/product-search";

const links = [
  { href: "/products", label: "Shop" },
  { href: "/categories", label: "Categories" },
];

export function SiteHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  function toggleMobileMenu() {
    setIsMobileMenuOpen((current) => !current);
  }

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-sand-200 bg-white/95 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.5)] backdrop-blur">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <BrandMark href="/" compact className="min-w-0 shrink-0" />

        <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={`rounded-full px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 ${pathname === link.href ? "bg-brand-50 text-brand-700" : "text-ink-800 hover:bg-sand-50 hover:text-brand-700"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden min-w-0 flex-1 xl:block xl:max-w-sm">
          <ProductSearch compact id="header-product-search" />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2">
          <Link
            href="/search"
            aria-label="Search medicines"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sand-200 bg-white text-ink-800 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 xl:hidden"
          >
            <Search className="h-4 w-4" />
          </Link>
          <div className="hidden sm:block">
            <CartLink />
          </div>
          <div className="sm:hidden">
            <CartLink compact />
          </div>
          <div className="hidden lg:block">
            <AuthStatus />
          </div>
          <button
            type="button"
            onClick={toggleMobileMenu}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sand-200 bg-white text-ink-800 transition hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 lg:hidden"
          >
            {isMobileMenuOpen ? <X className="h-4 w-4 text-current" /> : <Menu className="h-4 w-4 text-current" />}
          </button>
        </div>
      </div>
      {isMobileMenuOpen ? (
        <div id="mobile-navigation" className="border-t border-sand-200 bg-sand-50/95 shadow-inner lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-900/50">Explore WeCure</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <Link
                href="/search"
                onClick={closeMobileMenu}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100"
              >
                <Search className="h-4 w-4" /> Search medicines
              </Link>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                className={`rounded-2xl border px-4 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100 ${pathname === link.href ? "border-brand-200 bg-brand-50 text-brand-700" : "border-sand-200 bg-white text-ink-800 hover:border-brand-200 hover:text-brand-700"}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-3 rounded-2xl border border-sand-200 bg-white p-3">
              <AuthStatus />
            </div>
          </div>
        </div>
      ) : null}
    </header>
    <MobileNavigation />
    </>
  );
}
