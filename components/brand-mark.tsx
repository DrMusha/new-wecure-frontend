import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

type BrandMarkProps = {
  href?: string;
  compact?: boolean;
  className?: string;
};

export function BrandMark({ href = "/", compact = false, className }: BrandMarkProps) {
  const content = (
    <span className={cn("inline-flex items-center rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100", className)}>
      <Image
        src="/assets/wecure-logo.png"
        alt="WeCure Pharmacy"
        width={560}
        height={260}
        priority
        className={cn(
          "h-auto w-auto object-contain",
          compact ? "max-h-10 sm:max-h-11" : "max-h-14 sm:max-h-16",
        )}
      />
    </span>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className="inline-flex">
      {content}
    </Link>
  );
}
