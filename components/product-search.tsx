"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { getProductSuggestions, type ProductSuggestion } from "@/lib/backend";

type ProductSearchProps = {
  defaultValue?: string;
  compact?: boolean;
};

const MIN_SEARCH_LENGTH = 2;

export function ProductSearch({ defaultValue = "", compact = false }: ProductSearchProps) {
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const term = query.trim();
    if (term.length < MIN_SEARCH_LENGTH) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    let current = true;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const results = await getProductSuggestions(term, 8);
        if (current) setSuggestions(results);
      } catch {
        if (current) setSuggestions([]);
      } finally {
        if (current) setLoading(false);
      }
    }, 180);

    return () => {
      current = false;
      window.clearTimeout(timer);
    };
  }, [query]);

  function submit(event: FormEvent<HTMLFormElement>) {
    if (!query.trim()) event.preventDefault();
  }

  return (
    <form action="/products" onSubmit={submit} className="relative">
      <label htmlFor="product-search" className="sr-only">Search medicines and products</label>
      <div className="flex items-center rounded-2xl border border-ink-900/10 bg-white p-1.5 shadow-sm transition focus-within:border-brand-300 focus-within:ring-4 focus-within:ring-brand-100">
        <Search className="ml-2 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
        <input
          id="product-search"
          name="search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search medicines"
          autoComplete="off"
          className={compact ? "min-w-0 flex-1 bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-ink-900/40" : "min-w-0 flex-1 bg-transparent px-3 py-2.5 text-base outline-none placeholder:text-ink-900/40"}
        />
        {query ? (
          <button type="button" onClick={() => setQuery("")} className="rounded-full p-1 text-ink-900/45 hover:bg-sand-100" aria-label="Clear search">
            <X className="h-4 w-4" />
          </button>
        ) : null}
        {!compact ? <button type="submit" className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">Search</button> : null}
      </div>
      {query.trim().length >= MIN_SEARCH_LENGTH ? (
        <div className="absolute z-50 mt-2 max-h-80 w-full overflow-y-auto rounded-2xl border border-ink-900/10 bg-white p-1.5 shadow-xl">
          {loading ? <p className="px-3 py-3 text-sm text-ink-900/55">Finding products…</p> : null}
          {!loading && suggestions.length === 0 ? <p className="px-3 py-3 text-sm text-ink-900/55">No matches yet. Search the full catalog instead.</p> : null}
          {!loading && suggestions.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`} className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 text-sm font-medium text-ink-900 hover:bg-brand-50 hover:text-brand-700">
              <span className="truncate">{product.name}</span>
              <span className="shrink-0 text-xs text-ink-900/50">View product</span>
            </Link>
          ))}
          {!loading && query.trim() ? <button type="submit" className="w-full rounded-xl px-3 py-3 text-left text-sm font-semibold text-brand-700 hover:bg-brand-50">See all results for “{query.trim()}”</button> : null}
        </div>
      ) : null}
    </form>
  );
}
