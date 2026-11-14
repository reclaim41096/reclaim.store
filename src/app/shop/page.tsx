import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { getActiveProducts } from '@/lib/queries';

export const revalidate = 60;

export const metadata = {
  title: 'Cleaning Products — Reclaim',
};

export default async function ShopPage() {
  const products = await getActiveProducts();
  const cleaning = products.filter((p) => p.category.section.slug === 'cleaning');

  return (
    <>
      <Header />
      <div className="px-6 pt-10 md:px-12">
        <div className="mb-2.5 text-[13px] text-ink-faint">
          <Link href="/" className="text-ink-faint">
            Home
          </Link>{' '}
          / Cleaning Products
        </div>
        <h1 className="mb-5 font-display text-[32px] font-bold">Cleaning Products</h1>
        <div className="flex gap-2.5 pb-6">
          <span className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white">
            Cleaning Products
          </span>
          <Link href="/beverages" className="rounded-full bg-gold-tint px-5 py-2.5 text-sm font-bold text-gold-dark hover:bg-gold/20">
            Beverages
          </Link>
        </div>
      </div>

      <div className="px-6 pb-16 md:px-12">
        <div className="mb-5 text-sm text-ink-light">{cleaning.length} cleaning products</div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cleaning.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
