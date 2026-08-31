"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  name: string;
};

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const safeImages = useMemo(() => (images.length > 0 ? images : ["/assets/product-placeholder.png"]), [images]);
  const [activeIndex, setActiveIndex] = useState(0);
  const currentImage = safeImages[activeIndex] || safeImages[0];
  const hasMultiple = safeImages.length > 1;

  function prevImage() {
    setActiveIndex((current) => (current - 1 + safeImages.length) % safeImages.length);
  }

  function nextImage() {
    setActiveIndex((current) => (current + 1) % safeImages.length);
  }

  return (
    <div className="relative overflow-hidden rounded-[1.6rem] bg-slate-100">
      <div className="relative aspect-[4/5] w-full">
        <Image src={currentImage} alt={name} fill priority className="object-cover" />
      </div>

      {hasMultiple ? (
        <>
          <button
            type="button"
            onClick={prevImage}
            className="absolute left-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-ink-900 shadow-sm backdrop-blur transition hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
            aria-label="Previous product image"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={nextImage}
            className="absolute right-3 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-white/90 text-ink-900 shadow-sm backdrop-blur transition hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
            aria-label="Next product image"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
            {safeImages.map((src, index) => (
              <button
                key={`${src}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={cn(
                  "h-2.5 rounded-full border border-white/60 bg-white/80 shadow-sm transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-100",
                  index === activeIndex ? "w-8 bg-blue-600" : "w-2.5 hover:bg-white",
                )}
                aria-label={`Show image ${index + 1} of ${safeImages.length}`}
                aria-pressed={index === activeIndex}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
