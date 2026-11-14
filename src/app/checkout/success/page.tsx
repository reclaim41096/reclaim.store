import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LuCheck } from 'react-icons/lu';
import { CheckoutSteps } from '@/components/CheckoutSteps';

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  return (
    <>
      <Header />
      <CheckoutSteps current={3} />

      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-tint">
          <LuCheck size={32} className="text-brand" strokeWidth={3} />
        </div>
        <h1 className="mb-2.5 font-display text-2xl font-bold">Order placed!</h1>
        {searchParams.order && (
          <p className="mb-2 text-ink-muted">
            Order reference: <span className="font-bold text-ink">{searchParams.order}</span>
          </p>
        )}
        <p className="mb-8 text-sm text-ink-muted">
          Thanks for your order — we&apos;ll reach out on the phone number you provided to confirm
          delivery. For urgent enquiries, call +234 707 996 9990 or email reclaim41096@gmail.com.
        </p>
        <Link href="/shop" className="rounded-full bg-brand px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-brand-dark">
          Continue Shopping
        </Link>
      </div>
      <Footer />
    </>
  );
}
