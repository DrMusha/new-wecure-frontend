"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/cart";
import type { Product } from "@/lib/backend";
import { cn } from "@/lib/utils";

type AddToCartButtonProps = {
  product: Product;
  className?: string;
};

export function AddToCartButton({ product, className }: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart(product, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  }

  return (
    <Button type="button" onClick={handleAdd} className={cn("gap-2", className)}>
      <ShoppingBag className="h-4 w-4" />
      {added ? "Added to bag" : "Add to bag"}
    </Button>
  );
}
