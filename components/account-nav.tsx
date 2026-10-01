"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ClipboardList, HeartPulse, ShoppingBag, UserCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const accountLinks = [
  { href: "/account", label: "Profile", icon: UserCircle2 },
  { href: "/orders", label: "Orders", icon: ClipboardList },
  { href: "/medical-card", label: "Medical Card", icon: HeartPulse },
  { href: "/bag", label: "Bag", icon: ShoppingBag },
];

export function AccountNav() {
  const pathname = usePathname();
  const currentPath = pathname || "";

  return (
    <nav
      aria-label="Account navigation"
      className="rounded-[2rem] border border-white/80 bg-white/90 p-3 shadow-sm ring-1 ring-slate-200/70 backdrop-blur"
    >
      <div className="flex flex-wrap gap-2">
        {accountLinks.map((link) => {
          const Icon = link.icon;
          const active = currentPath === link.href || currentPath.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-100",
                active
                  ? "bg-brand-600 text-white shadow-sm"
                  : "border border-sand-200 bg-sand-50 text-ink-800 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
