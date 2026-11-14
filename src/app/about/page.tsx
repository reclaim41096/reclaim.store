import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { CategoryIcon } from '@/components/CategoryIcon';
import { Reveal } from '@/components/Reveal';
import { LuBadgeCheck, LuCircleCheck, LuPhoneCall } from 'react-icons/lu';

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

      <section className="bg-brand-tint px-6 py-12 md:px-12 md:py-16">
        <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-semibold text-brand-dark">
          <LuBadgeCheck size={16} className="text-brand" /> Introducing Reclaim Cleaning Products
        </span>
        <h1 className="max-w-3xl font-shout text-[28px] font-extrabold uppercase leading-[1.18] tracking-tight text-ink md:text-[42px]">
          Cleaner spaces. Fresher living.
          <br />
          Better environments.
        </h1>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink-muted md:text-[17px]">
          Looking for reliable and affordable cleaning solutions for your home, office or
          business? RECLAIM is here to make your cleaning routine easier!
        </p>
      </section>

      <section className="px-6 py-16 md:px-12">
        <h2 className="mb-5 font-display text-xl font-semibold md:mb-7 md:text-2xl md:font-bold">Our product range includes</h2>
        <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3">
          {PRODUCT_LINES.map((c, i) => (
            <Reveal key={c.slug} delay={i * 60}>
              <LineCard slug={c.slug} name={c.name} />
            </Reveal>
          ))}
          <Reveal delay={PRODUCT_LINES.length * 60}>
            <LineCard slug="honey" name="Tissa Organic Honey" />
          </Reveal>
        </div>

        <p className="mt-10 max-w-2xl text-[15px] leading-relaxed text-ink-muted md:text-[17px]">
          Whether you are buying for personal use, your business or wholesale distribution,
          RECLAIM has cleaning solutions to meet your everyday needs.
        </p>
        <p className="mt-4 max-w-2xl font-display text-base font-semibold text-ink md:text-xl md:font-bold">
          RECLAIM — Your Trusted Partner in Cleanliness and Freshness!
        </p>
      </section>

      <section className="mx-6 mb-10 flex flex-wrap items-center justify-between gap-6 rounded-3xl bg-ink p-8 md:mx-12 md:p-12">
        <div className="max-w-[560px]">
          <h2 className="mb-2.5 flex items-center gap-3 font-display text-xl font-semibold text-white md:text-2xl md:font-bold">
            <LuPhoneCall size={24} className="flex-none text-brand" /> Contact us today
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

function LineCard({ slug, name }: { slug: string; name: string }) {
  return (
    <div className="group flex h-full items-center gap-4 rounded-2xl border border-brand-border bg-white p-5 hover:border-brand/40 hover:shadow-[0_18px_40px_-22px_rgba(227,30,36,0.45)]">
      <div className="flex h-12 w-12 flex-none items-center justify-center rounded-xl bg-brand-tint transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110">
        <CategoryIcon slug={slug} />
      </div>
      <div className="flex items-center gap-2 text-[15px] font-bold">
        <LuCircleCheck size={18} className="flex-none text-brand" />
        {name}
      </div>
    </div>
  );
}
