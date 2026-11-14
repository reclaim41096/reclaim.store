import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { getActiveProducts } from '@/lib/queries';

export const revalidate = 60;

export const metadata = {
  title: 'Beverages — Reclaim',
};

export default async function BeveragesPage() {
  const products = await getActiveProducts();
  const beverages = products.filter((p) => p.category.section.slug === 'beverages');

  return (
    <>
      <Header />
      <div className="px-6 pt-10 md:px-12">
        <div className="mb-2.5 text-[13px] text-ink-faint">
          <Link href="/" className="text-ink-faint">
            Home
          </Link>{' '}
          / Beverages
        </div>
        <h1 className="mb-5 font-display text-[32px] font-bold">Beverages</h1>
        <div className="flex gap-2.5 pb-6">
          <Link href="/shop" className="rounded-full bg-brand-tint px-5 py-2.5 text-sm font-bold text-brand-dark hover:bg-brand/10">
            Cleaning Products
          </Link>
          <span className="rounded-full bg-gold-dark px-5 py-2.5 text-sm font-bold text-white">
            Beverages
          </span>
        </div>
      </div>

      <div className="px-6 pb-16 md:px-12">
        <div className="mb-5 text-sm text-ink-light">{beverages.length} product(s)</div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {beverages.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
}
