import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatNaira } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const supabase = createClient();

  const { data: orders } = await supabase
    .from('orders')
    .select('total, status, order_code, customer_name, created_at')
    .order('created_at', { ascending: false });

  const { count: productCount } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true });

  const { data: lowStock } = await supabase
    .from('product_variants')
    .select('sku, stock, products(name)')
    .lt('stock', 10)
    .order('stock', { ascending: true })
    .limit(5);

  const revenue = (orders ?? []).reduce((sum, o) => sum + Number(o.total), 0);
  const recentOrders = (orders ?? []).slice(0, 5);

  return (
    <>
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">Dashboard</h1>
          <div className="mt-1 text-[13px] text-ink-faint">Welcome back — here&apos;s what&apos;s happening today.</div>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          + Add Product
        </Link>
      </div>

      <div className="mb-7 grid grid-cols-2 gap-5 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={formatNaira(revenue)} />
        <StatCard label="Orders" value={String((orders ?? []).length)} />
        <StatCard label="Products" value={String(productCount ?? 0)} />
        <StatCard label="Low Stock Variants" value={String((lowStock ?? []).length)} warn />
      </div>

      <div className="flex flex-wrap gap-5">
        <div className="min-w-0 flex-1 basis-[560px] rounded-2xl border border-brand-border bg-white p-6">
          <h3 className="mb-4 text-base font-bold">Recent Orders</h3>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left text-ink-faint">
                <th className="py-2 font-semibold">Order</th>
                <th className="py-2 font-semibold">Customer</th>
                <th className="py-2 font-semibold">Total</th>
                <th className="py-2 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-ink-faint">
                    No orders yet.
                  </td>
                </tr>
              )}
              {recentOrders.map((o) => (
                <tr key={o.order_code} className="border-t border-[#EEF2F0]">
                  <td className="py-2.5 font-semibold">{o.order_code}</td>
                  <td className="py-2.5">{o.customer_name}</td>
                  <td className="py-2.5">{formatNaira(Number(o.total))}</td>
                  <td className="py-2.5">
                    <StatusPill status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="min-w-0 flex-1 basis-[320px] rounded-2xl border border-brand-border bg-white p-6">
          <h3 className="mb-4 text-base font-bold">Low Stock Alerts</h3>
          <div className="flex flex-col gap-3.5">
            {(lowStock ?? []).length === 0 && <p className="text-sm text-ink-faint">All stocked up.</p>}
            {(lowStock ?? []).map((v: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <div className="text-[13px] font-semibold">{v.products?.name}</div>
                  <div className="text-xs text-ink-faint">{v.stock} units left</div>
                </div>
                <span className="rounded-full bg-[#FDE4E4] px-2.5 py-1 text-[11px] font-bold text-[#C13C3C]">
                  Low
                </span>
              </div>
            ))}
          </div>
          <Link href="/admin/products" className="mt-4 block text-center text-sm font-semibold">
            Manage inventory →
          </Link>
        </div>
      </div>
    </>
  );
}

function StatCard({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="rounded-2xl border border-brand-border bg-white p-5">
      <div className="text-[13px] font-semibold text-ink-faint">{label}</div>
      <div className={`mt-2 text-[26px] font-bold ${warn && value !== '0' ? 'text-[#C13C3C]' : ''}`}>{value}</div>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-[#FDE4E4] text-[#C13C3C]',
    processing: 'bg-[#FFF4D6] text-[#A6760A]',
    delivered: 'bg-brand-tint text-brand',
    cancelled: 'bg-[#F1F0E8] text-ink-light',
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${styles[status] ?? ''}`}>
      {status}
    </span>
  );
}
