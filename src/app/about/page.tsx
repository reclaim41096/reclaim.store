import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CategoryIcon } from '@/components/CategoryIcon';

export const metadata = {
  title: 'About Reclaim',
};

const PRODUCT_LINES = [
  { slug: 'hand-wash', name: 'Hand Wash' },
  { slug: 'air-freshener', name: 'Air Freshener' },
  { slug: 'glass-cleaner', name: 'Glass Cleaner' },
  { slug: 'multipurpose-cleaner', name: 'Multipurpose Cleaner' },
  { slug: 'toilet-bathroom', name: 'Toilet & Bathroom Cleaning Products' },
  { slug: 'other-household', name: 'Other Household Cleaning Solutions' },
];

export default function AboutPage() {
  return (
    <>
      <Header />

      <section className="bg-brand-tint px-6 py-16 md:px-12">
        <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-semibold text-brand-dark">
          🟢 Introducing Reclaim Cleaning Products
        </span>
        <h1 className="max-w-3xl font-shout text-[28px] font-extrabold uppercase leading-[1.18] tracking-tight text-ink md:text-[42px]">
          Cleaner spaces. Fresher living.
          <br />
          Better environments.
        </h1>
        <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-ink-muted">
          Looking for reliable and affordable cleaning solutions for your home, office or
          business? RECLAIM is here to make your cleaning routine easier!
        </p>
      </section>

      <section className="px-6 py-16 md:px-12">
        <h2 className="mb-7 font-display text-2xl font-bold">Our product range includes</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCT_LINES.map((c) => (
            <div key={c.slug} className="flex items-center gap-4 rounded-2xl border border-brand-border bg-white p-5">
              <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-brand-tint">
                <CategoryIcon slug={c.slug} />
              </div>
              <div className="text-[15px] font-bold">
                <span className="mr-1.5 text-brand">✅</span>
                {c.name}
              </div>
            </div>
          ))}
          <div className="flex items-center gap-4 rounded-2xl border border-[#F3E6C2] bg-[#FFF9EC] p-5">
            <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-gold-tint">
              <CategoryIcon slug="honey" color="#A6760A" />
            </div>
            <div className="text-[15px] font-bold">
              <span className="mr-1.5 text-gold-dark">✅</span>
              Tissa Organic Honey
            </div>
          </div>
        </div>

        <p className="mt-10 max-w-2xl text-[17px] leading-relaxed text-ink-muted">
          Whether you are buying for personal use, your business or wholesale distribution,
          RECLAIM has cleaning solutions to meet your everyday needs.
        </p>
        <p className="mt-4 max-w-2xl font-display text-xl font-bold text-ink">
          RECLAIM — Your Trusted Partner in Cleanliness and Freshness!
        </p>
      </section>

      <section className="mx-6 mb-10 flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-ink p-12 md:mx-12">
        <div className="max-w-[560px]">
          <h2 className="mb-2.5 font-display text-2xl font-bold text-white">
            📞 Contact us today
          </h2>
          <p className="text-[15px] leading-relaxed text-[#B9C7BF]">
            For enquiries, orders and wholesale supplies — reach out and we&apos;ll be happy to
            help.
          </p>
        </div>
        <Link href="/contact" className="rounded-full bg-brand px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-brand-dark">
          Contact Reclaim
        </Link>
      </section>

      <section className="mb-16 px-6 py-10 text-center md:px-12">
        <h2 className="font-shout text-2xl font-extrabold uppercase tracking-tight text-brand md:text-4xl">
          Reclaim: Experience the Difference!
        </h2>
      </section>

      <Footer />
    </>
  );
}
