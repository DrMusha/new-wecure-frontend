"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const accountLinks = [
  { href: "/account", label: "Profile" },
  { href: "/orders", label: "Orders" },
  { href: "/medical-card", label: "Medical Card" },
  { href: "/bag", label: "Bag" },
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
          const active = currentPath === link.href || currentPath.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100",
                active
                  ? "bg-blue-500 text-white shadow-sm"
                  : "border border-slate-200/70 bg-slate-50 text-gray-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700",
              )}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
