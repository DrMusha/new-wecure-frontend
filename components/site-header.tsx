"use client";

import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { AuthStatus } from "@/components/auth-status";
import { CartLink } from "@/components/cart-link";
import { MobileNavigation } from "@/components/mobile-navigation";

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
    <header className="sticky top-0 z-50 border-b border-sand-200 bg-white/95 shadow-sm backdrop-blur">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
        <BrandMark href="/" compact className="min-w-0 shrink" />

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-2 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 ${pathname === link.href ? "bg-brand-50 text-brand-700" : "text-gray-700 hover:text-blue-500"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/search"
            className="hidden items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:border-blue-300 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 sm:inline-flex"
          >
            <Search className="h-4 w-4" /> Search
          </Link>
          <div className="hidden md:block">
            <CartLink />
          </div>
          <div className="md:hidden">
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
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white transition hover:border-blue-300 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 md:hidden"
          >
            {isMobileMenuOpen ? <X className="h-4 w-4 text-current" /> : <Menu className="h-4 w-4 text-current" />}
          </button>
        </div>
      </div>
      {isMobileMenuOpen ? (
        <div id="mobile-navigation" className="border-t border-gray-100 bg-gray-50 md:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="grid gap-2">
              <Link
                href="/search"
                onClick={closeMobileMenu}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-800 transition hover:border-blue-300 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
              >
                <Search className="h-4 w-4" /> Search medicines
              </Link>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                className={`rounded-2xl border px-4 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 ${pathname === link.href ? "border-brand-200 bg-brand-50 text-brand-700" : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:text-blue-600"}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-3">
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
