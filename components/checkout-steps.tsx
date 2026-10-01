import { Check, CreditCard, MapPin, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

type CheckoutStepsProps = {
  current: "bag" | "delivery" | "payment";
};

const steps = [
  { id: "bag", label: "Bag", mobileLabel: "Bag", icon: ShoppingBag },
  { id: "delivery", label: "Delivery", mobileLabel: "Delivery", icon: MapPin },
  { id: "payment", label: "Payment", mobileLabel: "Payment", icon: CreditCard },
  { id: "complete", label: "Order confirmed", mobileLabel: "Done", icon: Check },
] as const;

export function CheckoutSteps({ current }: CheckoutStepsProps) {
  const activeIndex = current === "bag" ? 0 : current === "delivery" ? 1 : 2;

  return (
    <ol className="flex items-center gap-1 rounded-full border border-ink-900/10 bg-white/85 p-2 shadow-sm sm:gap-3 sm:px-4">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index === activeIndex;
        const isComplete = index < activeIndex;

        return (
          <li key={step.id} className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2">
            <span
              className={cn(
                "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                isActive ? "bg-brand-600 text-white" : isComplete ? "bg-emerald-100 text-emerald-700" : "bg-sand-100 text-ink-900/45",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className={cn("truncate text-[9px] font-semibold sm:text-sm", isActive ? "text-ink-950" : "text-ink-900/55")}>
              <span className="sm:hidden">{step.mobileLabel}</span>
              <span className="hidden sm:inline">{step.label}</span>
            </span>
            {index < steps.length - 1 ? <span className="ml-auto h-px min-w-2 flex-1 bg-ink-900/10" /> : null}
          </li>
        );
      })}
    </ol>
  );
}
