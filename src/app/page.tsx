import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { CategoryIcon } from '@/components/CategoryIcon';
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

  return (
    <>
      <div className="bg-ink py-2.5 text-center text-[13px] font-medium text-white">
        Free delivery on orders over ₦15,000 within Lagos • Wholesale pricing available for bulk orders
      </div>
      <Header />

      {/* Hero */}
      <section className="flex flex-wrap items-center gap-12 bg-brand-tint px-6 py-16 md:px-12">
        <div className="flex min-w-0 flex-1 basis-[440px] flex-col gap-5">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[13px] font-semibold text-brand-dark">
            New • Nationwide delivery
          </span>
          <h1 className="text-5xl font-display font-bold leading-[1.08]">
            Cleaner spaces.
            <br />
            Fresher living.
            <br />
            Better environments.
          </h1>
          <p className="max-w-[480px] text-[17px] leading-relaxed text-ink-muted">
            Reliable, affordable cleaning solutions for your home, office or business — from hand
            wash to air fresheners, glass cleaners and more. Plus pure, natural honey from
            Reclaim&apos;s beverages line.
          </p>
          <div className="flex flex-wrap gap-3.5">
            <Link href="/shop" className="rounded-full bg-brand px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-brand-dark">
              Shop Products
            </Link>
            <Link href="#wholesale" className="rounded-full border border-brand-border px-6 py-3.5 text-[15px] font-semibold hover:border-brand hover:text-brand">
              Wholesale Enquiries
            </Link>
          </div>
        </div>
        <div className="grid min-w-0 flex-1 basis-[380px] grid-cols-2 gap-5">
          <div className="flex aspect-square items-center justify-center rounded-2xl border border-brand-border bg-white">
            <CategoryIcon slug="hand-wash" size={48} />
          </div>
          <div className="mt-7 flex aspect-square items-center justify-center rounded-2xl bg-brand">
            <CategoryIcon slug="glass-cleaner" size={48} color="#fff" />
          </div>
          <div className="flex aspect-square items-center justify-center rounded-2xl bg-gold">
            <CategoryIcon slug="other-household" size={48} color="#221211" />
          </div>
          <div className="-mt-7 flex aspect-square items-center justify-center rounded-2xl border border-brand-border bg-white">
            <CategoryIcon slug="air-freshener" size={48} />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 py-16 md:px-12">
        <span className="mb-2 inline-block rounded-full bg-brand-tint px-4 py-1.5 text-[13px] font-bold text-brand">
          Cleaning Products
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
        </div>
      </section>

      {/* Beverages */}
      {honey && (
        <section id="beverages" className="px-6 pb-16 md:px-12">
          <span className="mb-2 inline-block rounded-full bg-gold-tint px-4 py-1.5 text-[13px] font-bold text-gold-dark">
            Beverages
          </span>
          <div className="mb-7 flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="font-display text-[28px] font-bold">From our beverages line</h2>
            <Link href="/shop#beverages" className="text-sm font-semibold">
              View all →
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-7 rounded-2xl border border-[#F3E6C2] bg-[#FFF9EC] p-8">
            <div className="flex h-[140px] w-[140px] flex-none items-center justify-center rounded-2xl bg-gold-tint">
              <CategoryIcon slug="honey" size={64} color="#A6760A" />
            </div>
            <div className="min-w-0 flex-1 basis-[300px]">
              <div className="mb-1.5 text-[19px] font-bold">Pure Honey</div>
              <p className="max-w-[480px] text-sm leading-relaxed text-ink-muted">
                Natural, unprocessed honey — sourced and bottled with the same care Reclaim puts
                into every cleaning product.
              </p>
            </div>
            <Link href="/shop#beverages" className="rounded-full bg-gold-dark px-6 py-3.5 text-[15px] font-semibold text-white">
              Explore Beverages
            </Link>
          </div>
        </section>
      )}

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

      {/* Wholesale CTA */}
      <section id="wholesale" className="mx-6 mb-16 flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-ink p-12 md:mx-12">
        <div className="max-w-[560px]">
          <h2 className="mb-2.5 font-display text-2xl font-bold text-white">
            Buying for your business?
          </h2>
          <p className="text-[15px] leading-relaxed text-[#B9C7BF]">
            Get wholesale pricing on bulk orders for offices, hotels, schools and distributors.
          </p>
        </div>
        <a href="mailto:reclaim41096@gmail.com" className="rounded-full bg-brand px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-brand-dark">
          Request Wholesale Pricing
        </a>
      </section>

      <Footer />
    </>
  );
}
