import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "@/components/add-to-cart-button";
import type { Product } from "@/lib/backend";

type ProductCardProps = {
  product: Product;
  categoryName?: string;
};

export function ProductCard({ product, categoryName }: ProductCardProps) {
  const image = product.images?.[0] || "/assets/product-placeholder.svg";

  return (
    <article className="group relative flex min-w-0 h-full flex-col rounded-[1.25rem] border border-sand-200 bg-sand-50 p-2 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_24px_70px_-48px_rgba(15,23,42,0.55)] sm:rounded-[2rem] sm:p-4">
      {product.isPrescription ? (
        <div className="absolute left-3 top-3 z-10 rounded-full bg-coral-50 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.1em] text-red-700 ring-1 ring-inset ring-coral-200 sm:left-5 sm:top-5 sm:px-2.5 sm:text-[10px]">
          Prescription
        </div>
      ) : null}

      <Link
        href={`/products/${product.id}`}
        className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[1rem] bg-[linear-gradient(180deg,#f8fafc_0%,#eff6ff_100%)] sm:aspect-[4/3] sm:rounded-[1.5rem]"
        aria-label={`View ${product.name}`}
      >
        <Image
          src={image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover object-center transition duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="mt-2 flex min-w-0 flex-1 flex-col rounded-[1rem] border border-white/90 bg-white p-2.5 shadow-[0_18px_45px_-38px_rgba(15,23,42,0.65)] sm:mt-3 sm:rounded-[1.5rem] sm:p-5">
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="truncate text-[9px] font-bold uppercase tracking-[0.12em] text-brand-600 sm:text-[11px] sm:tracking-[0.2em]">
            {categoryName || "Product"}
          </p>
          <h3 className="mt-1.5 line-clamp-2 min-h-9 break-words text-[13px] font-bold leading-[1.15rem] text-ink-950 sm:mt-2 sm:min-h-12 sm:text-lg sm:leading-6">
            {product.name}
          </h3>
          {product.packSize ? <p className="mt-1.5 truncate text-[11px] font-medium text-ink-900/55 sm:mt-2 sm:text-xs">{product.packSize}</p> : <span className="mt-1.5 h-4 sm:mt-2" aria-hidden="true" />}
        </div>

        <div className="mt-3 grid gap-2 sm:mt-4 sm:gap-3">
          <p className="min-w-0 truncate text-lg font-bold leading-none text-brand-600 sm:text-2xl">
            ZMW {Number(product.price).toFixed(2)}
          </p>
          <AddToCartButton
            product={product}
            compact
            className="h-10 w-full min-w-0 rounded-full border border-ink-950 bg-white px-2 text-[11px] font-bold !text-black hover:border-brand-400 hover:bg-brand-50 hover:!text-black sm:h-11 sm:px-5 sm:text-sm"
          />
        </div>

        <Link
          href={`/products/${product.id}`}
          className="mt-3 hidden text-sm font-semibold text-ink-900/55 transition hover:text-brand-600 sm:inline-flex"
        >
          View details
        </Link>
      </div>
    </article>
  );
}

export function LoadingProductCard() {
  return (
    <div className="flex h-full min-w-0 flex-col rounded-[1.25rem] border border-sand-200 bg-sand-50 p-2 shadow-sm sm:rounded-[2rem] sm:p-4">
      <div className="aspect-square w-full animate-pulse rounded-[1rem] bg-sand-200 sm:aspect-[4/3] sm:rounded-[1.5rem]" />
      <div className="mt-2 flex flex-1 flex-col rounded-[1rem] border border-white/90 bg-white p-2.5 shadow-[0_18px_45px_-38px_rgba(15,23,42,0.65)] sm:mt-3 sm:rounded-[1.5rem] sm:p-5">
        <div className="h-3 w-1/3 animate-pulse rounded bg-sand-200" />
        <div className="mt-3 h-5 w-5/6 animate-pulse rounded bg-sand-200" />
        <div className="mt-5 grid gap-3">
          <div className="h-7 w-24 animate-pulse rounded bg-sand-200" />
          <div className="h-11 w-full animate-pulse rounded-full bg-sand-200" />
        </div>
        <div className="mt-3 h-4 w-20 animate-pulse rounded bg-sand-200" />
      </div>
    </div>
  );
}
