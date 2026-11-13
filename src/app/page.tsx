import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { CategoryIcon } from '@/components/CategoryIcon';
import { FullHero } from '@/components/FullHero';
import { getSectionsWithCategories, getActiveProducts } from '@/lib/queries';

export const revalidate = 60;

export default async function HomePage() {
  const sections = await getSectionsWithCategories();
  const products = await getActiveProducts();

  const cleaningCategories = sections.find((s) => s.slug === 'cleaning')?.categories ?? [];
  const bestSellers = products
    .filter((p) => p.category.section.slug === 'cleaning' && p.status === 'active')
    .slice(0, 4);
  const honey = products.find((p) => p.category.slug === 'honey');

  const heroSlides = products
    .filter((p) => p.cover_image_url)
    .slice(0, 6)
    .map((p) => ({ src: p.cover_image_url as string, name: p.name }));

  return (
    <>
      <div className="bg-ink py-2.5 text-center text-[13px] font-medium text-white">
        Nationwide delivery • Wholesale pricing available for bulk orders
      </div>
      <Header />

      <FullHero slides={heroSlides} />

      {/* Categories */}
      <section className="px-6 py-16 md:px-12">
        <span className="mb-2 inline-block rounded-full bg-brand-tint px-4 py-1.5 text-[13px] font-bold text-brand">
          Products
        </span>
        <div className="mb-7 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-[28px] font-bold">Shop by category</h2>
          <Link href="/shop" className="text-sm font-semibold">
            View all products →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cleaningCategories.map((c) => (
            <Link
              key={c.id}
              href="/shop"
              className="flex flex-col gap-3.5 rounded-2xl border border-brand-border bg-white p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-tint">
                <CategoryIcon slug={c.slug} />
              </div>
              <div>
                <div className="text-[16px] font-bold">{c.name}</div>
                <div className="mt-1 text-[13px] text-ink-light">{c.description}</div>
              </div>
            </Link>
          ))}
          {honey && (
            <Link
              href="/shop#beverages"
              className="flex flex-col gap-3.5 rounded-2xl border border-[#F3E6C2] bg-[#FFF9EC] p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-tint">
                <CategoryIcon slug="honey" color="#A6760A" />
              </div>
              <div>
                <div className="text-[16px] font-bold">Beverages</div>
                <div className="mt-1 text-[13px] text-ink-light">
                  Natural Tissa honey, from our beverages line
                </div>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* Best sellers */}
      <section className="bg-[#FCF7F6] px-6 py-16 md:px-12">
        <div className="mb-7 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-[28px] font-bold">Best sellers</h2>
          <Link href="/shop" className="text-sm font-semibold">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {bestSellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* About Reclaim teaser */}
      <section className="mx-6 mb-16 flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-ink p-12 md:mx-12">
        <div className="max-w-[560px]">
          <h2 className="mb-2.5 font-display text-2xl font-bold text-white">About Reclaim</h2>
          <p className="text-[15px] leading-relaxed text-[#B9C7BF]">
            A Lagos-based brand across two lines: cleaning products for home and business, and
            natural Tissa honey. Wholesale pricing available on bulk orders.
          </p>
        </div>
        <Link href="/about" className="rounded-full bg-brand px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-brand-dark">
          Learn More
        </Link>
      </section>

      <Footer />
    </>
  );
}
