'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { LuSearch, LuX, LuLoaderCircle } from 'react-icons/lu';
import { createClient } from '@/lib/supabase/client';
import { formatNaira } from '@/lib/format';

type Hit = {
  id: string;
  slug: string;
  name: string;
  base_price: number;
  cover_image_url: string | null;
};

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Debounced live search against Supabase as the user types
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

  const close = () => {
    setOpen(false);
    setQuery('');
    setResults([]);
  };

  return (
    <div ref={containerRef} className="relative">
      {!open ? (
        <button
          type="button"
          aria-label="Search products"
          onClick={() => setOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-brand-border bg-white text-ink hover:border-brand hover:bg-brand-tint"
        >
          <LuSearch size={19} />
        </button>
      ) : (
        <div className="flex h-11 w-[190px] items-center gap-2 rounded-2xl border border-brand bg-white px-3.5 sm:w-[260px]">
          <LuSearch size={17} className="shrink-0 text-ink-faint" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full bg-transparent text-[14px] outline-none placeholder:text-ink-faint"
          />
          {loading ? (
            <LuLoaderCircle size={16} className="shrink-0 animate-spin text-ink-faint" />
          ) : (
            <button type="button" aria-label="Close search" onClick={close} className="shrink-0 text-ink-faint hover:text-brand">
              <LuX size={17} />
            </button>
          )}
        </div>
      )}

      {open && query.trim().length >= 2 && (
        <div className="absolute right-0 top-full z-50 mt-2 max-h-[70vh] w-[280px] overflow-auto rounded-2xl border border-brand-border bg-white p-2 shadow-[0_18px_40px_-16px_rgba(0,0,0,0.25)] sm:w-[340px]">
          {!loading && results.length === 0 && (
            <div className="px-3 py-4 text-sm text-ink-light">No products found for &ldquo;{query}&rdquo;.</div>
          )}
          {results.map((p) => (
            <Link
              key={p.id}
              href={`/product/${p.slug}`}
              onClick={close}
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
          ))}
        </div>
      )}
    </div>
  );
}
