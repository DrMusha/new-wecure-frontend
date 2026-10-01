"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/cart";
import type { Product } from "@/lib/backend";
import { cn } from "@/lib/utils";

type AddToCartButtonProps = {
  product: Product;
  className?: string;
  compact?: boolean;
  ariaLabel?: string;
};

export function AddToCartButton({ product, className, compact = false, ariaLabel }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = window.setTimeout(() => setAdded(false), 3000);
    return () => window.clearTimeout(timer);
  }, [added]);

  function handleAdd() {
    addToCart(product, 1);
    setAdded(true);
  }

  return <>
    <Button type="button" onClick={handleAdd} aria-label={ariaLabel} className={cn("gap-2 rounded-full", className)}>
      {added ? <Check className="h-4 w-4 shrink-0" /> : <ShoppingBag className="h-4 w-4 shrink-0" />}
      {compact ? (
        <>
          <span className="sm:hidden">{added ? "Added" : "Add"}</span>
          <span className="hidden sm:inline">{added ? "Added to bag" : "Add to bag"}</span>
        </>
      ) : (added ? "Added to bag" : "Add to bag")}
    </Button>
    {added ? (
      <div role="status" className="fixed inset-x-4 bottom-4 z-[70] mx-auto flex max-w-md items-center justify-between gap-3 rounded-2xl bg-ink-950 px-4 py-3 text-sm text-white shadow-2xl sm:bottom-6">
        <span className="min-w-0 truncate"><span className="font-semibold">Added to bag.</span> {product.name}</span>
        <Link href="/bag" className="shrink-0 rounded-full bg-white px-3 py-1.5 font-semibold text-ink-950 hover:bg-brand-50">View bag</Link>
      </div>
    ) : null}
  </>;
}
