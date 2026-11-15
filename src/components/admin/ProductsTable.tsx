'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { LuPencil, LuSearch, LuX } from 'react-icons/lu';
import { DeleteProductButton } from './DeleteProductButton';

export type ProductRow = {
  id: string;
  name: string;
  status: string;
  categoryLabel: string;
  optionCount: number;
  priceLabel: string;
  stock: number;
  createdAt: string; // ISO
};

type AddedFilter = 'all' | '1' | '7' | '30' | 'older';
type Sort = 'newest' | 'oldest';

const DAY = 24 * 60 * 60 * 1000;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Africa/Lagos' });

const selectCls =
  'w-full rounded-lg border border-brand-border bg-white px-3 py-2.5 text-[13px] font-medium text-ink md:text-sm';

export function ProductsTable({ rows }: { rows: ProductRow[] }) {
  const [query, setQuery] = useState('');
  const [added, setAdded] = useState<AddedFilter>('all');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState<Sort>('newest');

  const visible = useMemo(() => {
    const now = Date.now();
    const q = query.trim().toLowerCase();
    return rows
      .filter((r) => {
        if (q && !r.name.toLowerCase().includes(q) && !r.categoryLabel.toLowerCase().includes(q)) return false;
        if (status !== 'all' && r.status !== status) return false;
        const age = now - new Date(r.createdAt).getTime();
        if (added === '1') return age <= DAY;
        if (added === '7') return age <= 7 * DAY;
        if (added === '30') return age <= 30 * DAY;
        if (added === 'older') return age > 30 * DAY;
        return true;
      })
      .sort((a, b) => {
        const d = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        return sort === 'newest' ? -d : d;
      });
  }, [rows, query, added, status, sort]);

  const filtersActive = query !== '' || added !== 'all' || status !== 'all';
  const reset = () => {
    setQuery('');
    setAdded('all');
    setStatus('all');
  };

  return (
    <>
      {/* Filters */}
      <div className="mb-4 grid grid-cols-2 gap-2.5 md:grid-cols-[minmax(0,1.6fr)_1fr_1fr_1fr] md:gap-3">
        <div className="relative col-span-2 md:col-span-1">
          <LuSearch size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products"
            className="w-full rounded-lg border border-brand-border bg-white py-2.5 pl-9 pr-3 text-[13px] md:text-sm"
          />
        </div>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Date added</span>
          <select value={added} onChange={(e) => setAdded(e.target.value as AddedFilter)} className={selectCls}>
            <option value="all">All time</option>
            <option value="1">Last 24 hours</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="older">Older than 30 days</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Sort</span>
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={selectCls}>
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
        <label className="col-span-2 flex flex-col gap-1 md:col-span-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">Status</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectCls}>
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="out_of_stock">Out of stock</option>
          </select>
        </label>
      </div>

      <div className="mb-3 flex items-center justify-between text-[12px] text-ink-light md:text-[13px]">
        <span>
          Showing {visible.length} of {rows.length} products
        </span>
        {filtersActive && (
          <button type="button" onClick={reset} className="inline-flex items-center gap-1 font-semibold text-brand-dark">
            <LuX size={14} /> Clear filters
          </button>
        )}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-brand-border bg-white">
        <table className="w-full min-w-[820px] border-collapse">
          <thead>
            <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-ink-faint md:text-xs">
              <th className="px-3 py-2.5 md:px-4 md:py-3">Product</th>
              <th className="px-3 py-2.5 md:px-4 md:py-3">Section / Category</th>
              <th className="px-3 py-2.5 md:px-4 md:py-3">Added</th>
              <th className="px-3 py-2.5 md:px-4 md:py-3">Options</th>
              <th className="px-3 py-2.5 md:px-4 md:py-3">Price</th>
              <th className="px-3 py-2.5 md:px-4 md:py-3">Stock</th>
              <th className="px-3 py-2.5 md:px-4 md:py-3">Status</th>
              <th className="px-3 py-2.5 md:px-4 md:py-3" />
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-sm text-ink-faint">
                  No products match these filters.
                </td>
              </tr>
            )}
            {visible.map((p) => (
              <tr key={p.id} className="border-t border-brand-border text-[12px] md:text-sm">
                <td className="whitespace-nowrap px-3 py-2.5 font-semibold md:px-4 md:py-3.5">{p.name}</td>
                <td className="px-3 py-2.5 text-ink-light md:px-4 md:py-3.5">{p.categoryLabel}</td>
                <td className="whitespace-nowrap px-3 py-2.5 text-ink-light md:px-4 md:py-3.5">{formatDate(p.createdAt)}</td>
                <td className="px-3 py-2.5 text-ink-light md:px-4 md:py-3.5">{p.optionCount || '—'}</td>
                <td className="whitespace-nowrap px-3 py-2.5 font-semibold md:px-4 md:py-3.5">{p.priceLabel}</td>
                <td className={`px-3 py-2.5 md:px-4 md:py-3.5 ${p.stock < 10 ? 'font-semibold text-danger' : ''}`}>{p.stock}</td>
                <td className="px-3 py-2.5 md:px-4 md:py-3.5">
                  <StatusPill status={p.status} />
                </td>
                <td className="px-3 py-2.5 md:px-4 md:py-3.5">
                  <div className="flex gap-1">
                    <Link href={`/admin/products/${p.id}/edit`} className="rounded-lg p-1.5 text-ink-light hover:bg-brand-tint" aria-label="Edit">
                      <LuPencil size={18} />
                    </Link>
                    <DeleteProductButton productId={p.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: 'bg-success-tint text-success',
    draft: 'bg-ink-tint text-ink-light',
    out_of_stock: 'bg-danger-tint text-danger',
  };
  const labels: Record<string, string> = { active: 'Active', draft: 'Draft', out_of_stock: 'Out of stock' };
  return (
    <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status] ?? ''}`}>
      {labels[status] ?? status}
    </span>
  );
}
