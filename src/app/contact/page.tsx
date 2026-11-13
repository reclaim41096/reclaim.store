import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ContactForm } from '@/components/ContactForm';

export const metadata = {
  title: 'Contact Reclaim',
};

const SOCIALS = ['Instagram', 'Facebook', 'X', 'TikTok'];

export default function ContactPage() {
  return (
    <>
      <Header />

      <section className="flex flex-wrap items-stretch">
        {/* Left: headline + form */}
        <div className="min-w-0 flex-1 basis-[560px] px-6 py-16 md:px-12 lg:py-20">
          <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-tint px-3.5 py-1.5 text-[13px] font-semibold text-brand-dark">
            Get Started
          </span>
          <h1 className="max-w-xl font-display text-[38px] font-extrabold leading-[1.1] tracking-tight md:text-[46px]">
            Get in touch with us.
            <br />
            We&apos;re here to assist you.
          </h1>
          <div className="mt-10 max-w-xl">
            <ContactForm />
          </div>
        </div>

        {/* Right: dark contact info panel */}
        <div className="flex min-w-0 flex-1 basis-[380px] flex-col justify-between gap-10 bg-ink px-6 py-16 text-white md:px-12 lg:py-20">
          <div>
            <h2 className="font-display text-2xl font-bold leading-tight">
              We are always
              <br />
              happy to assist you
            </h2>

            <div className="mt-10 flex flex-col gap-7">
              <div>
                <div className="text-[13px] font-semibold uppercase tracking-wide text-white/50">
                  Email Address
                </div>
                <a href="mailto:reclaim41096@gmail.com" className="mt-1.5 block text-[17px] font-medium">
                  reclaim41096@gmail.com
                </a>
                <div className="mt-1.5 text-[13px] text-white/50">
                  Assistance hours: Monday – Friday, 9am to 6pm
                </div>
              </div>

              <div>
                <div className="text-[13px] font-semibold uppercase tracking-wide text-white/50">
                  Phone Number
                </div>
                <a href="tel:+2347079969990" className="mt-1.5 block text-[17px] font-medium">
                  +234 707 996 9990
                </a>
              </div>

              <div>
                <div className="text-[13px] font-semibold uppercase tracking-wide text-white/50">
                  Location
                </div>
                <div className="mt-1.5 text-[15px] leading-relaxed text-white/80">
                  4 Modupe Johnson Crescent, off Adeniran Ogunsanya, by Pollaris Bank, Surulere,
                  Lagos
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="mb-3.5 text-[13px] font-semibold uppercase tracking-wide text-white/50">
              Follow Reclaim
            </div>
            <div className="flex flex-wrap gap-3">
              {SOCIALS.map((s) => (
                <span
                  key={s}
                  title={`${s} — coming soon`}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 text-[13px] font-bold text-white/70"
                >
                  {s.charAt(0)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
