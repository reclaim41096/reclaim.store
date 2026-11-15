import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { CategoryIcon } from '@/components/CategoryIcon';
import { FullHero } from '@/components/FullHero';
import { Reveal } from '@/components/Reveal';
import { getSectionsWithCategories, getActiveProducts } from '@/lib/queries';
import { LuArrowRight } from 'react-icons/lu';

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
      <Link href="/contact" className="block bg-ink px-4 py-2 text-center text-[12px] font-medium text-white hover:bg-brand-darker md:py-2.5 md:text-[13px]">
        Nationwide delivery • Wholesale pricing for bulk orders: <span className="underline underline-offset-2">Enquire</span>
      </Link>
      <Header />

      <FullHero videoSrc="/videos/hero-wash.mp4" posterSrc="/images/hero-poster.jpg" />

      {/* Categories */}
      <section className="px-6 py-16 md:px-12">
        <span className="mb-2 inline-block rounded-full bg-brand-tint px-4 py-1.5 text-[13px] font-bold text-brand-dark">
          Products
        </span>
        <div className="mb-7 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-[22px] font-semibold md:text-[28px] md:font-bold">Shop by category</h2>
          <Link href="/shop" className="text-sm font-semibold">
            View all products <LuArrowRight size={16} className="ml-1 inline-block align-[-3px]" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3">
          {cleaningCategories.map((c, i) => (
            <Reveal key={c.id} delay={i * 70}>
              <CategoryCard href="/shop" slug={c.slug} name={c.name} description={c.description} />
            </Reveal>
          ))}
          {honey && (
            <Reveal delay={cleaningCategories.length * 70}>
              <CategoryCard
                href="/beverages"
                slug="honey"
                name="Beverages"
                description="Natural Tissa honey, from our beverages line"
              />
            </Reveal>
          )}
        </div>
      </section>

      {/* Best sellers */}
      <section className="bg-brand-surface px-6 py-16 md:px-12">
        <div className="mb-7 flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-[22px] font-semibold md:text-[28px] md:font-bold">Best sellers</h2>
          <Link href="/shop" className="text-sm font-semibold">
            View all <LuArrowRight size={16} className="ml-1 inline-block align-[-3px]" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-4">
          {bestSellers.map((p, i) => (
            <Reveal key={p.id} delay={i * 80}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* About Reclaim teaser */}
      <section className="mx-6 mb-12 flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-ink p-8 md:mx-12 md:p-12">
        <div className="max-w-[560px]">
          <h2 className="mb-2.5 font-display text-xl font-semibold text-white md:text-2xl md:font-bold">About Reclaim</h2>
          <p className="text-[15px] leading-relaxed text-white/75">
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

function CategoryCard({
  href,
  slug,
  name,
  description,
}: {
  href: string;
  slug: string;
  name: string;
  description: string | null;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-row items-center gap-4 rounded-2xl border border-brand-border bg-white p-4 md:flex-col md:items-stretch md:gap-3.5 md:p-6 hover:border-brand/40 hover:shadow-[0_18px_40px_-22px_rgba(227,30,36,0.45)]"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-tint transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
        <CategoryIcon slug={slug} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[15px] font-semibold md:text-[16px] md:font-bold">{name}</div>
        <div className="mt-0.5 text-[12px] text-ink-light md:mt-1 md:text-[13px]">{description}</div>
      </div>
      <LuArrowRight size={18} className="flex-none text-brand transition-transform duration-300 group-hover:translate-x-1.5" />
    </Link>
  );
}
