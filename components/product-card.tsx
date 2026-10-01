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
    <article className="group relative flex h-full flex-col rounded-[1.5rem] border border-sand-200 bg-sand-50 p-2.5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_24px_70px_-48px_rgba(15,23,42,0.55)] sm:rounded-[2rem] sm:p-4">
      {product.isPrescription ? (
        <div className="absolute left-4 top-4 z-10 rounded-full bg-coral-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-red-700 ring-1 ring-inset ring-coral-200 sm:left-5 sm:top-5 sm:text-[10px]">
          Prescription
        </div>
      ) : null}

      <Link
        href={`/products/${product.id}`}
        className="relative flex aspect-[1/1.02] items-center justify-center overflow-hidden rounded-[1.25rem] bg-[linear-gradient(180deg,#f8fafc_0%,#eff6ff_100%)] sm:aspect-[4/3] sm:rounded-[1.5rem]"
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

      <div className="mt-2 flex flex-1 flex-col rounded-[1.25rem] border border-white/90 bg-white p-3 shadow-[0_18px_45px_-38px_rgba(15,23,42,0.65)] sm:mt-3 sm:rounded-[1.5rem] sm:p-5">
        <div className="flex flex-1 flex-col">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-600 sm:text-[11px] sm:tracking-[0.2em]">
            {categoryName || "Product"}
          </p>
          <h1 className="mt-2 line-clamp-2 min-h-10 text-sm font-bold leading-5 text-ink-950 sm:min-h-12 sm:text-lg sm:leading-6">
            {product.name}
          </h1>
        </div>

        <div className="mt-4 grid gap-3">
          <p className="min-w-0 break-words text-2xl font-bold leading-none text-brand-600 sm:text-2xl">
            ZMW {Number(product.price).toFixed(2)}
          </p>
          <AddToCartButton
            product={product}
            className="h-11 w-full rounded-full border border-ink-950 bg-white px-3 text-xs font-bold !text-black hover:border-brand-400 hover:bg-brand-50 hover:!text-black sm:px-5 sm:text-sm"
          />
        </div>

        <Link
          href={`/products/${product.id}`}
          className="mt-3 inline-flex text-xs font-semibold text-ink-900/55 transition hover:text-brand-600 sm:text-sm"
        >
          View details
        </Link>
      </div>
    </article>
  );
}

export function LoadingProductCard() {
  return (
    <div className="flex h-full flex-col rounded-[1.5rem] border border-sand-200 bg-sand-50 p-2.5 shadow-sm sm:rounded-[2rem] sm:p-4">
      <div className="aspect-[1/1.02] w-full animate-pulse rounded-[1.25rem] bg-sand-200 sm:aspect-[4/3] sm:rounded-[1.5rem]" />
      <div className="mt-2 flex flex-1 flex-col rounded-[1.25rem] border border-white/90 bg-white p-3 shadow-[0_18px_45px_-38px_rgba(15,23,42,0.65)] sm:mt-3 sm:rounded-[1.5rem] sm:p-5">
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
