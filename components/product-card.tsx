import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/backend";

type ProductCardProps = {
  product: Product;
  categoryName?: string;
};

export function ProductCard({ product, categoryName }: ProductCardProps) {
  const image = product.images?.[0] || "/assets/product-placeholder.svg";

  return (
    <div className="group overflow-hidden rounded-[1.5rem] border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg sm:rounded-[2rem]">
      {product.isPrescription ? (
        <div className="absolute right-0 top-0 z-10 rounded-bl-md bg-red-700 px-2 py-1 text-xs font-bold text-white">
          Prescription
        </div>
      ) : null}

      <div className="relative aspect-[1/1.05] overflow-hidden bg-gray-50 sm:aspect-[4/3]">
        <Image
          src={image}
          alt={product.name}
          fill
          className="object-cover object-center transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white to-transparent" />
      </div>

      <div className="space-y-3 p-3 sm:p-5">
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-500 sm:text-[11px] sm:tracking-[0.2em]">
              {categoryName || "Product"}
            </p>
            <h1 className="mt-2 line-clamp-2 text-sm font-semibold text-gray-900 lg:text-lg">
              {product.name}
            </h1>
          </div>
          <div className="flex justify-start">
            <h3 className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-bold text-blue-600 ring-1 ring-inset ring-blue-100 sm:px-3 sm:text-xs">
              ZMW {Number(product.price).toFixed(2)}
            </h3>
          </div>
        </div>

        <p className="hidden line-clamp-2 text-xs leading-5 text-gray-500 sm:block sm:text-sm sm:leading-6">
          {product.description || "Genuine product available from WeCure Pharmacy."}
        </p>

        <Link
          href={`/products/${product.id}`}
          className="inline-flex w-full items-center justify-center rounded-lg bg-blue-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-blue-600 sm:px-5 sm:py-3 sm:text-sm"
        >
          View
        </Link>
      </div>
    </div>
  );
}

export function LoadingProductCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-[1.5rem] border border-gray-200 bg-white shadow-sm sm:rounded-[2rem]">
      <div className="aspect-[1/1.05] w-full animate-pulse bg-gray-200 sm:aspect-[4/3]" />
      <div className="space-y-3 p-3 sm:p-5">
        <div className="h-4 w-1/3 animate-pulse rounded bg-gray-200" />
        <div className="h-5 w-5/6 animate-pulse rounded bg-gray-200" />
        <div className="h-3 w-full animate-pulse rounded bg-gray-200" />
        <div className="h-9 w-full animate-pulse rounded-lg bg-gray-200 sm:h-10" />
      </div>
    </div>
  );
}
