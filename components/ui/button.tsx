import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
};

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60";
  const styles = {
    primary: "bg-blue-400 text-white hover:bg-blue-500",
    secondary: "border border-gray-200 bg-white text-gray-900 hover:border-blue-300 hover:text-blue-600",
    ghost: "bg-transparent text-gray-900 hover:bg-gray-100",
  }[variant];

  return (
    <button className={cn(base, styles, className)} {...props}>
      {children}
    </button>
  );
}
