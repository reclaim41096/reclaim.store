'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Reveal } from './Reveal';
import { ProductCard } from './ProductCard';
import type { ProductSummary } from '@/lib/queries';

/** Shared product listing for /shop and /beverages: breadcrumb, section tabs, category filter, grid. */
export function ProductListing({
  title,
  active,
  products,
}: {
  title: string;
  active: 'cleaning' | 'beverages';
  products: ProductSummary[];
}) {
  const categories = useMemo(() => {
    const seen = new Map<string, string>();
    products.forEach((p) => seen.set(p.category.slug, p.category.name));
    return Array.from(seen, ([slug, name]) => ({ slug, name }));
  }, [products]);
  const [filter, setFilter] = useState<string>('all');
  const visible = filter === 'all' ? products : products.filter((p) => p.category.slug === filter);

  const tab = (on: boolean) =>
    `rounded-full px-5 py-2.5 font-nav text-[15px] tracking-wide ${
      on ? 'bg-brand text-white' : 'bg-brand-tint text-brand-dark hover:bg-brand/10'
    }`;

  return (
    <>
      <div className="px-6 pt-10 md:px-12">
        <div className="mb-2.5 text-[13px] text-ink-faint">
          <Link href="/" className="text-ink-faint hover:text-brand">
            Home
          </Link>{' '}
          / {title}
        </div>
        <h1 className="mb-5 font-display text-[28px] font-bold md:text-[32px]">{title}</h1>
        <div className="flex flex-wrap gap-2.5 pb-4">
          {active === 'cleaning' ? <span className={tab(true)}>Cleaning Products</span> : <Link href="/shop" className={tab(false)}>Cleaning Products</Link>}
          {active === 'beverages' ? <span className={tab(true)}>Beverages</span> : <Link href="/beverages" className={tab(false)}>Beverages</Link>}
        </div>

        {categories.length > 1 && (
          <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-4 md:mx-0 md:flex-wrap md:px-0" role="tablist" aria-label="Filter by category">
            {[{ slug: 'all', name: 'All' }, ...categories].map((c) => (
              <button
                key={c.slug}
                role="tab"
                aria-selected={filter === c.slug}
                onClick={() => setFilter(c.slug)}
                className={`flex-none whitespace-nowrap rounded-full border px-4 py-2 text-[13px] font-semibold ${
                  filter === c.slug
                    ? 'border-ink bg-ink text-white'
                    : 'border-brand-border bg-white text-ink-muted hover:border-brand hover:text-brand'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-6 pb-16 md:px-12">
        <div className="mb-5 text-sm text-ink-light">
          {visible.length} {visible.length === 1 ? 'product' : 'products'}
        </div>
        <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3">
          {visible.map((p, i) => (
            <Reveal key={p.id} delay={Math.min(i, 6) * 60}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </>
  );
}
