import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ContactForm } from '@/components/ContactForm';

export const metadata = {
  title: 'Contact Reclaim',
};

export default function ContactPage() {
  return (
    <>
      <Header />

      <section className="bg-brand-tint px-6 py-16 md:px-12">
        <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[13px] font-semibold text-brand-dark">
          Contact
        </span>
        <h1 className="max-w-2xl font-display text-[34px] font-bold leading-[1.1]">
          Get in touch
        </h1>
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-muted">
          Questions about an order, wholesale pricing, or anything else? Send us a message and
          we&apos;ll respond as soon as we can.
        </p>
      </section>

      <section className="flex flex-wrap items-start gap-10 px-6 py-16 md:px-12">
        <div className="min-w-0 flex-1 basis-[500px]">
          <ContactForm />
        </div>

        <div className="flex w-full flex-none basis-[320px] flex-col gap-4 rounded-2xl border border-brand-border bg-white p-6 md:w-[320px]">
          <h3 className="text-lg font-bold">Contact Details</h3>
          <div className="flex flex-col gap-1">
            <span className="text-[13px] font-semibold text-ink-light">Email</span>
            <a href="mailto:hello@reclaim.store" className="text-sm font-medium text-brand">
              hello@reclaim.store
            </a>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[13px] font-semibold text-ink-light">Phone</span>
            <a href="tel:+2348000000000" className="text-sm font-medium">
              +234 800 000 0000
            </a>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[13px] font-semibold text-ink-light">Location</span>
            <span className="text-sm">Lagos, Nigeria</span>
          </div>
          <div className="h-px bg-brand-border" />
          <p className="text-[13px] leading-relaxed text-ink-light">
            For wholesale and bulk orders, let us know the products and quantities you need in
            your message and we&apos;ll send pricing.
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
