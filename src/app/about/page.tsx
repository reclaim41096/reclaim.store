import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CategoryIcon } from '@/components/CategoryIcon';

export const metadata = {
  title: 'About Reclaim',
};

const CLEANING_LINES = [
  { slug: 'hand-wash', name: 'Hand Wash' },
  { slug: 'air-freshener', name: 'Air Freshener' },
  { slug: 'glass-cleaner', name: 'Glass Cleaner' },
  { slug: 'multipurpose-cleaner', name: 'Multipurpose Cleaner' },
  { slug: 'toilet-bathroom', name: 'Toilet & Bathroom' },
  { slug: 'other-household', name: 'Car Care & Laundry' },
];

export default function AboutPage() {
  return (
    <>
      <Header />

      <section className="bg-brand-tint px-6 py-16 md:px-12">
        <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[13px] font-semibold text-brand-dark">
          About Reclaim
        </span>
        <h1 className="max-w-2xl font-display text-[34px] font-bold leading-[1.1]">
          Cleaner spaces. Fresher living. Better environments.
        </h1>
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-muted">
          Reclaim is a Lagos-based brand built across two business lines: a full range of
          household and business cleaning products, and Tissa, our natural honey line. Every
          product is made to be reliable, affordable and genuinely effective — for homes, offices
          and businesses across Nigeria.
        </p>
      </section>

      <section className="px-6 py-16 md:px-12">
        <h2 className="mb-7 font-display text-2xl font-bold">What we make</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CLEANING_LINES.map((c) => (
            <div key={c.slug} className="flex items-center gap-4 rounded-2xl border border-brand-border bg-white p-5">
              <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-brand-tint">
                <CategoryIcon slug={c.slug} />
              </div>
              <div className="text-[15px] font-bold">{c.name}</div>
            </div>
          ))}
          <div className="flex items-center gap-4 rounded-2xl border border-[#F3E6C2] bg-[#FFF9EC] p-5">
            <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-gold-tint">
              <CategoryIcon slug="honey" color="#A6760A" />
            </div>
            <div className="text-[15px] font-bold">Tissa Organic Honey</div>
          </div>
        </div>
      </section>

      <section className="mx-6 mb-16 flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-ink p-12 md:mx-12">
        <div className="max-w-[560px]">
          <h2 className="mb-2.5 font-display text-2xl font-bold text-white">
            Buying for your business?
          </h2>
          <p className="text-[15px] leading-relaxed text-[#B9C7BF]">
            Get wholesale pricing on bulk orders for offices, hotels, schools and distributors.
          </p>
        </div>
        <Link href="/contact" className="rounded-full bg-brand px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-brand-dark">
          Request Wholesale Pricing
        </Link>
      </section>

      <Footer />
    </>
  );
}
