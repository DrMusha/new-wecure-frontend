"use client";

import Link from "next/link";
import { Search, ShoppingBag, Store, UserCircle2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/products", label: "Shop", icon: Store },
  { href: "/search", label: "Search", icon: Search },
  { href: "/bag", label: "Bag", icon: ShoppingBag },
  { href: "/account", label: "Account", icon: UserCircle2 },
];

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Quick navigation" className="fixed inset-x-0 bottom-0 z-30 border-t border-sand-200 bg-white/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-12px_36px_-28px_rgba(15,23,42,0.6)] backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-4 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href === "/products" && pathname?.startsWith("/products"));
          return (
            <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} className={cn("flex min-h-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-semibold transition", active ? "bg-brand-50 text-brand-700" : "text-ink-900/55 hover:bg-sand-50 hover:text-brand-700")}>
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
