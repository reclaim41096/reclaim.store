import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatNaira } from '@/lib/format';
import { ProductsTable, type ProductRow } from '@/components/admin/ProductsTable';
import { LuPlus } from 'react-icons/lu';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const supabase = createClient();
  const { data: products } = await supabase
    .from('products')
    .select(
      `id, name, status, created_at,
       category:categories(name, section:sections(name)),
       product_options(id),
       product_variants(price, stock)`,
    )
    .order('created_at', { ascending: false });

  const rows: ProductRow[] = (products ?? []).map((p: any) => {
    const prices = (p.product_variants ?? []).map((v: any) => Number(v.price));
    const priceLabel =
      prices.length === 0
        ? '—'
        : Math.min(...prices) === Math.max(...prices)
          ? formatNaira(prices[0])
          : `${formatNaira(Math.min(...prices))}–${formatNaira(Math.max(...prices))}`;
    return {
      id: p.id,
      name: p.name,
      status: p.status,
      categoryLabel: `${p.category?.section?.name ?? ''} / ${p.category?.name ?? ''}`,
      optionCount: (p.product_options ?? []).length,
      priceLabel,
      stock: (p.product_variants ?? []).reduce((sum: number, v: any) => sum + v.stock, 0),
      createdAt: p.created_at,
    };
  });

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 md:mb-6 md:gap-4">
        <div>
          <h1 className="font-display text-xl font-semibold md:text-2xl md:font-bold">Products</h1>
          <div className="mt-0.5 text-[12px] text-ink-faint md:mt-1 md:text-[13px]">{rows.length} products</div>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2.5 text-[13px] font-semibold text-white hover:bg-brand-dark md:gap-2 md:px-5 md:py-3 md:text-sm"
        >
          <LuPlus size={18} /> Add Product
        </Link>
      </div>

      <ProductsTable rows={rows} />
    </>
  );
}
