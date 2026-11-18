'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LuSearch, LuX } from 'react-icons/lu';
import { createClient } from '@/lib/supabase/client';
import { formatNaira } from '@/lib/format';

type Hit = {
  id: string;
  slug: string;
  name: string;
  base_price: number;
  cover_image_url: string | null;
};

/** Debounced live search against the products table only. */
function useProductSearch(query: string) {
  const [results, setResults] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const handle = setTimeout(async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('products')
        .select('id, slug, name, base_price, cover_image_url')
        .eq('status', 'active')
        .ilike('name', `%${q}%`)
        .limit(6);
      setResults((data as Hit[]) ?? []);
      setLoading(false);
    }, 250);
    return () => clearTimeout(handle);
  }, [query]);

  return { results, loading };
}

/** Real categories already on the site — doubles as quick filters and search shortcuts. */
const POPULAR_SEARCHES = [
  { name: 'Hand Wash', href: '/shop?category=hand-wash' },
  { name: 'Air Freshener', href: '/shop?category=air-freshener' },
  { name: 'Glass Cleaner', href: '/shop?category=glass-cleaner' },
  { name: 'Multipurpose Cleaner', href: '/shop?category=multipurpose-cleaner' },
  { name: 'Toilet & Bathroom', href: '/shop?category=toilet-bathroom' },
  { name: 'Beverages', href: '/beverages' },
];

function SuggestionsPanel({ onPick }: { onPick: () => void }) {
  return (
    <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-2xl border border-brand-border bg-white p-4 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.25)]">
      <div className="mb-2.5 text-[11px] font-bold uppercase tracking-wide text-ink-faint">Popular searches</div>
      <div className="flex flex-wrap gap-2">
        {POPULAR_SEARCHES.map((s) => (
          <Link
            key={s.name}
            href={s.href}
            onClick={onPick}
            className="rounded-full bg-ink-tint px-3.5 py-1.5 text-[13px] font-medium text-ink-muted hover:bg-brand-tint hover:text-brand-dark"
          >
            {s.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

function ResultsDropdown({
  query,
  results,
  loading,
  onPick,
}: {
  query: string;
  results: Hit[];
  loading: boolean;
  onPick: () => void;
}) {
  if (query.trim().length < 2 || loading) return null;
  return (
    <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[70vh] overflow-auto rounded-2xl border border-brand-border bg-white p-2 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.25)]">
      {results.length === 0 ? (
        <div className="px-3 py-4 text-sm text-ink-light">No products found for &ldquo;{query}&rdquo;.</div>
      ) : (
        results.map((p) => (
          <Link
            key={p.id}
            href={`/product/${p.slug}`}
            onClick={onPick}
            className="flex items-center gap-3 rounded-xl p-2 hover:bg-brand-tint"
          >
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-brand-tint">
              {p.cover_image_url && (
                <Image src={p.cover_image_url} alt={p.name} fill sizes="48px" className="object-contain p-1" />
              )}
            </div>
            <div className="min-w-0">
              <div className="truncate text-[14px] font-semibold text-ink">{p.name}</div>
              <div className="text-[13px] font-bold text-brand">{formatNaira(p.base_price)}</div>
            </div>
          </Link>
        ))
      )}
    </div>
  );
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const { results, loading } = useProductSearch(query);

  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);

  // Hide the dropdown when clicking outside either variant
  const [focusedVariant, setFocusedVariant] = useState<'desktop' | 'mobile' | null>(null);
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (desktopRef.current?.contains(t) || mobileRef.current?.contains(t)) return;
      setFocusedVariant(null);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    mobileInputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeMobile();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mobileOpen]);

  const closeMobile = () => {
    setMobileOpen(false);
    setQuery('');
    setFocusedVariant(null);
  };
  const pickResult = () => {
    setQuery('');
    setFocusedVariant(null);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Desktop / tablet: always-visible Jiji-style pill */}
      <div ref={desktopRef} className="relative hidden md:block">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setFocusedVariant('desktop');
          }}
          className="flex h-11 items-center rounded-full bg-ink-tint pl-4 pr-1"
        >
          <LuSearch size={17} className="shrink-0 text-ink-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocusedVariant('desktop')}
            placeholder="Search products"
            className="h-full w-[150px] bg-transparent px-2.5 text-[14px] outline-none placeholder:text-ink-faint lg:w-[210px]"
          />
          <button
            type="submit"
            className="flex h-9 shrink-0 items-center rounded-full bg-brand px-5 text-[14px] font-semibold text-white hover:bg-brand-dark"
          >
            Search
          </button>
        </form>
        {focusedVariant === 'desktop' &&
          (query.trim().length < 2 ? (
            <SuggestionsPanel onPick={pickResult} />
          ) : (
            <ResultsDropdown query={query} results={results} loading={loading} onPick={pickResult} />
          ))}
      </div>

      {/* Mobile: icon toggles a full-width search panel below the header */}
      <button
        type="button"
        aria-label="Search products"
        onClick={() => setMobileOpen(true)}
        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-brand-border bg-white text-ink hover:border-brand hover:bg-brand-tint md:hidden"
      >
        <LuSearch size={19} />
      </button>

      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-30 bg-ink/40 md:hidden" onClick={closeMobile} aria-hidden />
          <div
            ref={mobileRef}
            className="absolute inset-x-0 top-full z-40 border-b border-brand-border bg-white p-4 shadow-lg md:hidden"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setFocusedVariant('mobile');
              }}
              className="flex h-12 items-center rounded-full bg-ink-tint pl-4 pr-1"
            >
              <LuSearch size={18} className="shrink-0 text-ink-faint" />
              <input
                ref={mobileInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setFocusedVariant('mobile')}
                placeholder="Search products"
                className="h-full w-full bg-transparent px-2.5 text-[15px] outline-none placeholder:text-ink-faint"
              />
              <button
                type="submit"
                className="flex h-10 shrink-0 items-center rounded-full bg-brand px-5 text-[14px] font-semibold text-white hover:bg-brand-dark"
              >
                Search
              </button>
              <button
                type="button"
                aria-label="Close search"
                onClick={closeMobile}
                className="ml-1.5 flex h-10 w-10 shrink-0 items-center justify-center text-ink-faint hover:text-brand"
              >
                <LuX size={18} />
              </button>
            </form>
            {focusedVariant === 'mobile' && (
              <div className="relative">
                {query.trim().length < 2 ? (
                  <SuggestionsPanel onPick={pickResult} />
                ) : (
                  <ResultsDropdown query={query} results={results} loading={loading} onPick={pickResult} />
                )}
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
