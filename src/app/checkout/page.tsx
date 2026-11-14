'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useCart } from '@/components/CartProvider';
import { createClient } from '@/lib/supabase/client';
import { formatNaira } from '@/lib/format';
import { LuArrowLeft } from 'react-icons/lu';

const DELIVERY_FEE = 1000;
const NIGERIAN_STATES = ['Lagos', 'Ogun', 'Oyo', 'Abuja (FCT)', 'Rivers', 'Kano', 'Other'];

function generateOrderCode() {
  const suffix = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `RC-${suffix}`;
}

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: 'Lagos',
    state: 'Lagos',
    paymentMethod: 'pay_on_delivery' as 'card' | 'bank_transfer' | 'pay_on_delivery',
  });

  const delivery = subtotal === 0 ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  const handleSubmit = async () => {
    if (items.length === 0) return;
    if (!form.name || !form.phone || !form.address) {
      setError('Please fill in your name, phone number and delivery address.');
      return;
    }
    setSubmitting(true);
    setError(null);

    const supabase = createClient();
    const orderCode = generateOrderCode();

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_code: orderCode,
        customer_name: form.name,
        email: form.email || null,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        payment_method: form.paymentMethod,
        subtotal,
        delivery_fee: delivery,
        total,
      })
      .select()
      .single();

    if (orderError || !order) {
      setError('Something went wrong placing your order. Please try again.');
      setSubmitting(false);
      return;
    }

    const { error: itemsError } = await supabase.from('order_items').insert(
      items.map((item) => ({
        order_id: order.id,
        variant_id: item.variantId,
        product_name: item.productName,
        variant_label: item.variantLabel,
        unit_price: item.unitPrice,
        quantity: item.quantity,
      })),
    );

    if (itemsError) {
      setError('Your order was started but items could not be saved. Please contact us.');
      setSubmitting(false);
      return;
    }

    clear();
    router.push(`/checkout/success?order=${orderCode}`);
  };

  return (
    <>
      <Header />

      <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 px-6 pb-2 pt-7 text-[13px] font-semibold md:px-12">
        <Link href="/cart" className="text-ink-faint">
          1. Cart
        </Link>
        <span className="text-ink-faint">—</span>
        <span className="text-brand">2. Checkout</span>
        <span className="text-ink-faint">—</span>
        <span className="text-ink-faint">3. Confirmation</span>
      </div>

      <div className="flex flex-wrap items-start gap-10 px-6 pb-16 pt-4 md:px-12">
        <div className="flex min-w-0 flex-1 basis-full md:basis-[560px] flex-col gap-7">
          <div className="rounded-2xl border border-brand-border bg-white p-6">
            <h3 className="mb-5 text-[17px] font-bold">Contact &amp; Delivery</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full name">
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Your full name"
                />
              </Field>
              <Field label="Phone number">
                <input
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  placeholder="080xxxxxxxx"
                />
              </Field>
              <div className="sm:col-span-2">
                <Field label="Email (optional)">
                  <input
                    value={form.email}
                    onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com"
                  />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Delivery address">
                  <input
                    value={form.address}
                    onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                    placeholder="Street address"
                  />
                </Field>
              </div>
              <Field label="City">
                <input
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                />
              </Field>
              <Field label="State">
                <select
                  value={form.state}
                  onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))}
                >
                  {NIGERIAN_STATES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          <div className="rounded-2xl border border-brand-border bg-white p-6">
            <h3 className="mb-5 text-[17px] font-bold">Payment Method</h3>
            <div className="flex flex-wrap gap-3">
              {(
                [
                  ['card', 'Card'],
                  ['bank_transfer', 'Bank Transfer'],
                  ['pay_on_delivery', 'Pay on Delivery'],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setForm((f) => ({ ...f, paymentMethod: value }))}
                  className={`flex-1 rounded-xl border px-4 py-3.5 text-center text-[13px] font-semibold ${
                    form.paymentMethod === value
                      ? 'border-brand bg-brand text-white'
                      : 'border-brand-border bg-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            {form.paymentMethod === 'card' && (
              <p className="mt-4 text-xs text-ink-faint">
                Card payment integration coming soon — select Pay on Delivery or Bank Transfer for now.
              </p>
            )}
          </div>

          <Link href="/cart" className="text-sm font-semibold">
            <LuArrowLeft size={16} className="mr-1 inline-block align-[-3px]" /> Back to cart
          </Link>
        </div>

        <div className="flex w-full flex-0 basis-full md:basis-[360px] flex-col gap-4 rounded-2xl border border-brand-border bg-white p-6 md:w-[360px]">
          <h3 className="text-lg font-bold">Order Summary</h3>
          <div className="flex flex-col gap-2.5">
            {items.map((item) => (
              <div key={item.variantId} className="flex justify-between text-[13px]">
                <span className="text-ink-light">
                  {item.productName} ×{item.quantity}
                </span>
                <span>{formatNaira(item.unitPrice * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="h-px bg-brand-border" />
          <div className="flex flex-col gap-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-light">Subtotal</span>
              <span>{formatNaira(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-light">Delivery</span>
              <span>{formatNaira(delivery)}</span>
            </div>
          </div>
          <div className="h-px bg-brand-border" />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>{formatNaira(total)}</span>
          </div>

          {error && <p className="text-sm text-[#C13C3C]">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={submitting || items.length === 0}
            className="rounded-full bg-brand py-3.5 text-[15px] font-semibold text-white hover:bg-brand-dark disabled:bg-ink-faint"
          >
            {submitting ? 'Placing order…' : 'Place Order'}
          </button>
          <div className="text-center text-xs text-ink-faint">
            By placing your order you agree to our Terms &amp; Returns Policy
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <label className="mb-1.5 text-[13px] font-semibold">{label}</label>
      {children && (
        <div className="[&>input]:w-full [&>input]:rounded-lg [&>input]:border [&>input]:border-brand-border [&>input]:px-3.5 [&>input]:py-3 [&>input]:text-sm [&>select]:w-full [&>select]:rounded-lg [&>select]:border [&>select]:border-brand-border [&>select]:px-3.5 [&>select]:py-3 [&>select]:text-sm">
          {children}
        </div>
      )}
    </div>
  );
}
