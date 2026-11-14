import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { formatNaira } from '@/lib/format';
import type { IconType } from 'react-icons';
import { LuArrowRight, LuBanknote, LuPackage, LuPlus, LuReceipt, LuTriangleAlert } from 'react-icons/lu';

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
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 md:mb-7 md:gap-4">
        <div>
          <h1 className="font-display text-xl font-semibold md:text-2xl md:font-bold">Dashboard</h1>
          <div className="mt-0.5 text-[12px] text-ink-faint md:mt-1 md:text-[13px]">Welcome back — here&apos;s what&apos;s happening today.</div>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2.5 text-[13px] font-semibold text-white hover:bg-brand-dark md:gap-2 md:px-5 md:py-3 md:text-sm"
        >
          <LuPlus size={18} /> Add Product
        </Link>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 md:mb-7 md:gap-5 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={formatNaira(revenue)} Icon={LuBanknote} />
        <StatCard label="Orders" value={String((orders ?? []).length)} Icon={LuReceipt} />
        <StatCard label="Products" value={String(productCount ?? 0)} Icon={LuPackage} />
        <StatCard label="Low Stock Variants" value={String((lowStock ?? []).length)} Icon={LuTriangleAlert} warn />
      </div>

      <div className="flex flex-wrap gap-5">
        <div className="min-w-0 flex-1 basis-full rounded-2xl border border-brand-border bg-white p-4 sm:p-6 lg:basis-[560px]">
          <h3 className="mb-3 text-[15px] font-semibold md:mb-4 md:text-base md:font-bold">Recent Orders</h3>
          <div className="overflow-x-auto">
          <table className="w-full min-w-[460px] border-collapse text-[12px] md:text-sm">
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
                  <td className="py-2 font-semibold md:py-2.5">{o.order_code}</td>
                  <td className="py-2 md:py-2.5">{o.customer_name}</td>
                  <td className="py-2 md:py-2.5">{formatNaira(Number(o.total))}</td>
                  <td className="py-2.5">
                    <StatusPill status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>

        <div className="min-w-0 flex-1 basis-full rounded-2xl border border-brand-border bg-white p-4 sm:p-6 lg:basis-[320px]">
          <h3 className="mb-3 text-[15px] font-semibold md:mb-4 md:text-base md:font-bold">Low Stock Alerts</h3>
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
            Manage inventory <LuArrowRight size={16} className="ml-1 inline-block align-[-3px]" />
          </Link>
        </div>
      </div>
    </>
  );
}

function StatCard({ label, value, warn, Icon }: { label: string; value: string; warn?: boolean; Icon: IconType }) {
  return (
    <div className="rounded-2xl border border-brand-border bg-white p-3.5 md:p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="text-[11px] font-semibold leading-tight text-ink-faint md:text-[13px]">{label}</div>
        <span className={`flex h-7 w-7 flex-none items-center justify-center rounded-lg md:h-9 md:w-9 ${warn && value !== '0' ? 'bg-[#FDE4E4] text-[#C13C3C]' : 'bg-brand-tint text-brand'}`}>
          <Icon className="h-[15px] w-[15px] md:h-[18px] md:w-[18px]" />
        </span>
      </div>
      <div className={`mt-1.5 text-[19px] font-semibold md:mt-2 md:text-[26px] md:font-bold ${warn && value !== '0' ? 'text-[#C13C3C]' : ''}`}>{value}</div>
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
