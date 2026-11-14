import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { WhatsAppResend } from '@/components/WhatsAppResend';
import { PaidWhatsApp } from '@/components/PaidWhatsApp';
import { CheckoutSteps } from '@/components/CheckoutSteps';
import { LuCheck, LuCircleAlert } from 'react-icons/lu';

export const dynamic = 'force-dynamic';

type Result = 'paid' | 'unpaid' | 'whatsapp' | 'placed';

type Paid = { amount: number; method: string; reference: string; name?: string; phone?: string };

const CHANNELS: Record<string, string> = {
  card: 'Card',
  bank: 'Bank',
  bank_transfer: 'Bank Transfer',
  ussd: 'USSD',
  qr: 'QR',
  mobile_money: 'Mobile Money',
  eft: 'EFT',
  apple_pay: 'Apple Pay',
};

/** Verifies a Paystack payment with Paystack itself (never trust the URL alone). */
async function verifyPaystack(reference: string, orderCode?: string): Promise<Paid | null> {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return null;
  try {
    const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret}` },
      cache: 'no-store',
    });
    const json = await res.json();
    const ok = json?.status && json.data?.status === 'success' && (!orderCode || json.data?.metadata?.order_code === orderCode);
    if (!ok) return null;
    if (orderCode && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      // Mark the order as processing (paid). Needs the service role key; skipped if not set.
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/orders?order_code=eq.${encodeURIComponent(orderCode)}&status=eq.pending`, {
        method: 'PATCH',
        headers: {
          apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'processing' }),
      });
    }
    const channel: string = json.data.channel ?? '';
    return {
      amount: Number(json.data.amount) / 100,
      method: CHANNELS[channel] ?? (channel ? channel.replace(/_/g, ' ') : 'Paystack'),
      reference: json.data.reference ?? reference,
      name: json.data.metadata?.customer_name,
      phone: json.data.metadata?.phone,
    };
  } catch {
    return null;
  }
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: { order?: string; via?: string; reference?: string; trxref?: string };
}) {
  const reference = searchParams.reference ?? searchParams.trxref;
  let result: Result = 'placed';
  let paid: Paid | null = null;
  if (reference) {
    paid = await verifyPaystack(reference, searchParams.order);
    result = paid ? 'paid' : 'unpaid';
  }
  else if (searchParams.via === 'whatsapp') result = 'whatsapp';

  const copy: Record<Result, { title: string; body: string }> = {
    paid: {
      title: 'Payment received',
      body: 'Thank you! Your payment was confirmed. We are taking you to WhatsApp so you can send your order and payment details to Reclaim straight away.',
    },
    unpaid: {
      title: 'We could not confirm your payment',
      body: 'If money left your account, please contact us with your order reference and we will sort it out right away.',
    },
    whatsapp: {
      title: 'Order sent to WhatsApp',
      body: 'Your order details are in a WhatsApp chat with Reclaim. Send the pre-filled message there and we will confirm availability and payment details.',
    },
    placed: {
      title: 'Order placed!',
      body: "Thanks for your order. We'll reach out on the phone number you provided to confirm delivery.",
    },
  };

  return (
    <>
      <Header />
      <CheckoutSteps current={3} />

      <div className="mx-auto max-w-lg px-6 py-16 text-center md:py-20">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-tint">
          {result === 'unpaid' ? (
            <LuCircleAlert size={32} className="text-brand" />
          ) : (
            <LuCheck size={32} className="text-brand" strokeWidth={3} />
          )}
        </div>
        <h1 className="mb-2.5 font-display text-xl font-semibold md:text-2xl md:font-bold">{copy[result].title}</h1>
        {searchParams.order && (
          <p className="mb-2 text-ink-muted">
            Order reference: <span className="font-bold text-ink">{searchParams.order}</span>
          </p>
        )}
        <p className="mb-8 text-sm text-ink-muted">
          {copy[result].body} For urgent enquiries, call +234 707 996 9990 or email reclaim41096@gmail.com.
        </p>
        {result === 'paid' && paid && searchParams.order && (
          <PaidWhatsApp
            orderCode={searchParams.order}
            amount={paid.amount}
            method={paid.method}
            reference={paid.reference}
            name={paid.name}
            phone={paid.phone}
          />
        )}
        {result === 'whatsapp' && searchParams.order && <WhatsAppResend orderCode={searchParams.order} />}
        <div>
          <Link href="/shop" className="inline-block rounded-full bg-brand px-6 py-3.5 text-[15px] font-semibold text-white hover:bg-brand-dark">
            Continue Shopping
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}
