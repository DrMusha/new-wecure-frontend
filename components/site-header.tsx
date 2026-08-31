import Link from "next/link";
import { Menu } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { AuthStatus } from "@/components/auth-status";
import { CartLink } from "@/components/cart-link";

const links = [
  { href: "/categories", label: "Categories" },
  { href: "/products", label: "Products" },
  { href: "/orders", label: "Orders" },
  { href: "/medical-card", label: "Medical Card" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <BrandMark href="/" />

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full text-sm font-medium text-gray-700 transition hover:text-blue-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/search"
            className="hidden rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:border-blue-300 hover:text-blue-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 sm:inline-flex"
          >
            Search
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
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white md:hidden"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5 text-gray-900" />
          </button>
        </div>
      </div>
      <div className="border-t border-gray-100 bg-gray-50 md:hidden">
        <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-4 py-3 sm:px-6 lg:px-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
