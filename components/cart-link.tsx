"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { getCart } from "@/lib/cart";

type CartLinkProps = {
  compact?: boolean;
};

export function CartLink({ compact = false }: CartLinkProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const cart = getCart();
      setCount(cart.reduce((sum, item) => sum + item.quantity, 0));
    };

    updateCount();

    window.addEventListener("storage", updateCount);
    window.addEventListener("cart-updated", updateCount as EventListener);

    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("cart-updated", updateCount as EventListener);
    };
  }, []);

  return (
    <Link
      href="/bag"
      className={
        compact
          ? "relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-blue-500 text-white shadow-sm transition hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
          : "relative inline-flex items-center gap-2 rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
      }
      aria-label={`Cart${count > 0 ? `, ${count} items` : ""}`}
    >
      <ShoppingBag className="h-4 w-4" />
      {compact ? <span className="sr-only">Cart</span> : "Cart"}
      {count > 0 ? (
        <span className="absolute -right-2 -top-2 inline-flex min-w-6 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1.5 py-0.5 text-[11px] font-bold leading-none text-white shadow-sm">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
