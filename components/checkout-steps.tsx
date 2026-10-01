import { Check, CreditCard, MapPin, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

type CheckoutStepsProps = {
  current: "bag" | "payment";
};

const steps = [
  { id: "bag", label: "Bag & delivery", icon: ShoppingBag },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "complete", label: "Order confirmed", icon: Check },
] as const;

export function CheckoutSteps({ current }: CheckoutStepsProps) {
  const activeIndex = current === "bag" ? 0 : 1;

  return (
    <ol className="grid gap-2 rounded-2xl border border-ink-900/10 bg-white/85 p-3 shadow-sm sm:flex sm:items-center sm:gap-3 sm:rounded-full sm:px-4">
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index === activeIndex;
        const isComplete = index < activeIndex;

        return (
          <li key={step.id} className="flex min-w-0 flex-1 items-center gap-2">
            <span
              className={cn(
                "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                isActive ? "bg-brand-600 text-white" : isComplete ? "bg-emerald-100 text-emerald-700" : "bg-sand-100 text-ink-900/45",
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className={cn("truncate text-xs font-semibold sm:text-sm", isActive ? "text-ink-950" : "text-ink-900/55")}>
              {step.label}
            </span>
            {index < steps.length - 1 ? <span className="ml-auto hidden h-px flex-1 bg-ink-900/10 sm:block" /> : null}
          </li>
        );
      })}
    </ol>
  );
}
