import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ContactForm } from '@/components/ContactForm';
import { SocialLinks } from '@/components/SocialLinks';
import { LuMail, LuMapPin, LuPhone } from 'react-icons/lu';

export const metadata = {
  title: 'Contact Reclaim',
};

export default function ContactPage() {
  return (
    <>
      <Header />

      <section className="flex flex-wrap items-stretch">
        {/* Left: headline + form */}
        <div className="min-w-0 flex-1 basis-full md:basis-[560px] px-6 py-12 md:px-12 md:py-16 lg:py-20">
          <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-tint px-3.5 py-1.5 text-[13px] font-semibold text-brand-dark">
            Get Started
          </span>
          <h1 className="max-w-xl font-display text-[30px] font-bold leading-[1.1] tracking-tight md:text-[46px] md:font-extrabold">
            Get in touch with us.
            <br />
            We&apos;re here to assist you.
          </h1>
          <div className="mt-10 max-w-xl">
            <ContactForm />
          </div>
        </div>

        {/* Right: dark contact info panel */}
        <div className="flex min-w-0 flex-1 basis-full md:basis-[380px] flex-col justify-between gap-10 bg-ink px-6 py-12 text-white md:px-12 md:py-16 lg:py-20">
          <div>
            <h2 className="font-display text-xl font-semibold leading-tight md:text-2xl md:font-bold">
              We are always
              <br />
              happy to assist you
            </h2>

            <div className="mt-10 flex flex-col gap-7">
              <div>
                <div className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wide text-white/50">
                  <LuMail size={15} /> Email Address
                </div>
                <a href="mailto:reclaim41096@gmail.com" className="mt-1.5 block break-all text-[17px] font-medium">
                  reclaim41096@gmail.com
                </a>
                <div className="mt-1.5 text-[13px] text-white/50">
                  Assistance hours: Monday – Friday, 9am to 6pm
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wide text-white/50">
                  <LuPhone size={15} /> Phone Number
                </div>
                <a href="tel:+2347079969990" className="mt-1.5 block text-[17px] font-medium">
                  +234 707 996 9990
                </a>
              </div>

              <div>
                <div className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wide text-white/50">
                  <LuMapPin size={15} /> Location
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
            <SocialLinks />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
