"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { getProductSuggestions, type ProductSuggestion } from "@/lib/backend";

const MIN_SEARCH_LENGTH = 2;
const MAX_SUGGESTIONS = 10;

export function HomepageProductSearch() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const term = query.trim();
    if (term.length < MIN_SEARCH_LENGTH) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    let isCurrent = true;
    const timeout = window.setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await getProductSuggestions(term, MAX_SUGGESTIONS);
        if (isCurrent) setSuggestions(results);
      } catch {
        if (isCurrent) setSuggestions([]);
      } finally {
        if (isCurrent) setIsLoading(false);
      }
    }, 200);

    return () => {
      isCurrent = false;
      window.clearTimeout(timeout);
    };
  }, [query]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!query.trim()) event.preventDefault();
  }

  return (
    <form action="/products" onSubmit={handleSubmit} className="relative mt-6 sm:mt-8">
      <label htmlFor="homepage-product-search" className="sr-only">Search products</label>
      <div className="flex rounded-xl border border-blue-100 bg-white p-1.5 shadow-sm transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100 sm:rounded-2xl sm:p-2">
        <Search aria-hidden="true" className="ml-2 h-5 w-5 shrink-0 self-center text-blue-500 sm:ml-3" />
        <input id="homepage-product-search" name="search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} autoComplete="off" placeholder="Search medicines, cosmetics and more" aria-autocomplete="list" aria-expanded={suggestions.length > 0} aria-controls="homepage-search-suggestions" className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400 sm:px-4 sm:text-base" />
        <button type="submit" className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:rounded-xl sm:px-5">Search</button>
      </div>
      {query.trim().length >= MIN_SEARCH_LENGTH ? (
        <div id="homepage-search-suggestions" role="listbox" className="absolute z-20 mt-2 max-h-80 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white p-1.5 shadow-xl sm:rounded-2xl">
          {isLoading ? <p className="px-3 py-2 text-sm text-gray-500">Searching products...</p> : null}
          {!isLoading && suggestions.length === 0 ? <p className="px-3 py-2 text-sm text-gray-500">No matching products found.</p> : null}
          {!isLoading ? suggestions.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} role="option" className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-800 transition hover:bg-blue-50 hover:text-blue-700 sm:rounded-xl">
              <span className="truncate">{product.name}</span>
              {product.isFeatured ? <span className="shrink-0 text-xs font-semibold text-blue-500">Featured</span> : null}
            </Link>
          )) : null}
        </div>
      ) : null}
    </form>
  );
}