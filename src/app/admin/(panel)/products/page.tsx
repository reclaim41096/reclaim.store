import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatNaira } from '@/lib/format';
import { DeleteProductButton } from '@/components/admin/DeleteProductButton';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const supabase = createClient();
  const { data: products } = await supabase
    .from('products')
    .select(
      `id, name, status,
       category:categories(name, section:sections(name)),
       product_options(id),
       product_variants(price, stock)`,
    )
    .order('created_at', { ascending: false });

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Products</h1>
          <div className="mt-1 text-[13px] text-ink-faint">{products?.length ?? 0} products</div>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          + Add Product
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-brand-border bg-white">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-ink-faint">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Section / Category</th>
              <th className="px-4 py-3">Options</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(products ?? []).map((p: any) => {
              const prices = (p.product_variants ?? []).map((v: any) => Number(v.price));
              const stock = (p.product_variants ?? []).reduce((sum: number, v: any) => sum + v.stock, 0);
              const priceLabel =
                prices.length === 0
                  ? '—'
                  : Math.min(...prices) === Math.max(...prices)
                    ? formatNaira(prices[0])
                    : `${formatNaira(Math.min(...prices))}–${formatNaira(Math.max(...prices))}`;

              return (
                <tr key={p.id} className="border-t border-[#EEF2F0] text-sm">
                  <td className="px-4 py-3.5 font-semibold">{p.name}</td>
                  <td className="px-4 py-3.5 text-ink-light">
                    {p.category?.section?.name} / {p.category?.name}
                  </td>
                  <td className="px-4 py-3.5 text-ink-light">{(p.product_options ?? []).length || '—'}</td>
                  <td className="px-4 py-3.5 font-semibold">{priceLabel}</td>
                  <td className={stock < 10 ? 'px-4 py-3.5 font-semibold text-[#C13C3C]' : 'px-4 py-3.5'}>
                    {stock}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusPill status={p.status} />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex gap-1">
                      <Link
                        href={`/admin/products/${p.id}/edit`}
                        className="rounded-lg p-1.5 text-ink-light hover:bg-[#FBE8E6]"
                        aria-label="Edit"
                      >
                        ✏️
                      </Link>
                      <DeleteProductButton productId={p.id} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: 'bg-brand-tint text-brand',
    draft: 'bg-[#F1F0E8] text-ink-light',
    out_of_stock: 'bg-[#FDE4E4] text-[#C13C3C]',
  };
  const labels: Record<string, string> = { active: 'Active', draft: 'Draft', out_of_stock: 'Out of stock' };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status] ?? ''}`}>
      {labels[status] ?? status}
    </span>
  );
}
