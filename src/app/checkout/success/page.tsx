import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string };
}) {
  return (
    <>
      <Header />
      <div className="flex justify-center gap-7 px-6 pb-2 pt-7 text-[13px] font-semibold md:px-12">
        <span className="text-ink-faint">1. Cart</span>
        <span className="text-ink-faint">—</span>
        <span className="text-ink-faint">2. Checkout</span>
        <span className="text-ink-faint">—</span>
        <span className="text-brand">3. Confirmation</span>
      </div>

      <div className="mx-auto max-w-lg px-6 py-20 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-tint">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="m5 13 5 5L20 7" stroke="#E31E24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
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
