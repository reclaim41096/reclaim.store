'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useCart } from '@/components/CartProvider';
import { createClient } from '@/lib/supabase/client';
import { formatNaira } from '@/lib/format';
import { LuArrowLeft, LuCreditCard, LuLoader } from 'react-icons/lu';
import { FaWhatsapp } from 'react-icons/fa6';
import { NIGERIA_LOCATIONS, OTHER_CITY, STATES } from '@/lib/nigeria-locations';
import { buildOrderMessage, whatsappUrl } from '@/lib/whatsapp';
import { CheckoutSteps } from '@/components/CheckoutSteps';

const DELIVERY_FEE = 1000;

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
    state: '',
    city: '',
    cityOther: '',
    paymentMethod: 'paystack' as 'paystack' | 'whatsapp',
  });

  const cities = form.state ? [...NIGERIA_LOCATIONS[form.state], OTHER_CITY] : [];
  const finalCity = form.city === OTHER_CITY ? form.cityOther.trim() : form.city;

  const delivery = subtotal === 0 ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  const handleSubmit = async () => {
    if (items.length === 0) return;
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim() || !form.state || !finalCity) {
      setError('Please fill in your name, phone number, state, city and delivery address.');
      return;
    }
    setSubmitting(true);
    setError(null);

    // For WhatsApp, open the tab right now (inside the click) so mobile browsers don't block it
    const waWindow = form.paymentMethod === 'whatsapp' ? window.open('', '_blank') : null;

    const supabase = createClient();
    const orderCode = generateOrderCode();

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_code: orderCode,
        customer_name: form.name.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim(),
        address: form.address.trim(),
        city: finalCity,
        state: form.state,
        payment_method: form.paymentMethod,
        subtotal,
        delivery_fee: delivery,
        total,
      })
      .select()
      .single();

    if (orderError || !order) {
      waWindow?.close();
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
      waWindow?.close();
      setError('Your order was started but items could not be saved. Please contact us.');
      setSubmitting(false);
      return;
    }

    const orderData = {
      orderCode,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      city: finalCity,
      state: form.state,
      items,
      subtotal,
      delivery,
      total,
    };
    try {
      window.sessionStorage.setItem(`reclaim-order-${orderCode}`, JSON.stringify(orderData));
    } catch {
      /* ignore */
    }

    if (form.paymentMethod === 'whatsapp') {
      const message = buildOrderMessage({
        orderCode,
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        address: form.address.trim(),
        city: finalCity,
        state: form.state,
        items,
        subtotal,
        delivery,
        total,
      });
      try {
        window.sessionStorage.setItem(`reclaim-wa-${orderCode}`, message);
      } catch {
        /* ignore */
      }
      const url = whatsappUrl(message);
      if (waWindow) waWindow.location.href = url;
      else window.open(url, '_blank');
      clear();
      router.push(`/checkout/success?order=${orderCode}&via=whatsapp`);
      return;
    }

    // Paystack
    try {
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderCode }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) throw new Error(json.error ?? 'Could not start payment.');
      clear();
      window.location.href = json.url;
    } catch (e: any) {
      setError(`${e?.message ?? 'Could not start payment.'} Your order ${orderCode} is saved; you can pay via WhatsApp instead.`);
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />

      <CheckoutSteps current={2} />

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
              <Field label="State">
                <select
                  value={form.state}
                  onChange={(e) => setForm((f) => ({ ...f, state: e.target.value, city: '', cityOther: '' }))}
                >
                  <option value="">Select state</option>
                  {STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="City / Area">
                <select
                  value={form.city}
                  disabled={!form.state}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                  className="disabled:bg-[#FBF7F6] disabled:text-ink-faint"
                >
                  <option value="">{form.state ? 'Select city' : 'Select a state first'}</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>
              {form.city === OTHER_CITY && (
                <div className="sm:col-span-2">
                  <Field label="Your city / area">
                    <input
                      value={form.cityOther}
                      onChange={(e) => setForm((f) => ({ ...f, cityOther: e.target.value }))}
                      placeholder="Type your city or area"
                    />
                  </Field>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-brand-border bg-white p-6">
            <h3 className="mb-5 text-[17px] font-bold">Payment Method</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(
                [
                  ['paystack', 'Pay with Paystack', 'Card, bank or USSD, securely online', LuCreditCard],
                  ['whatsapp', 'Pay via WhatsApp chat', 'Send your order to us on WhatsApp', FaWhatsapp],
                ] as const
              ).map(([value, label, sub, Icon]) => {
                const on = form.paymentMethod === value;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, paymentMethod: value }))}
                    aria-pressed={on}
                    className={`flex items-center gap-3.5 rounded-xl border px-4 py-4 text-left ${
                      on ? 'border-brand bg-brand-tint ring-1 ring-brand' : 'border-brand-border bg-white hover:border-brand/50'
                    }`}
                  >
                    <span className={`flex h-11 w-11 flex-none items-center justify-center rounded-xl ${on ? 'bg-brand text-white' : 'bg-brand-tint text-brand'}`}>
                      <Icon size={22} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[14px] font-bold">{label}</span>
                      <span className="block text-xs text-ink-light">{sub}</span>
                    </span>
                  </button>
                );
              })}
            </div>
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
            {submitting ? (
              <span className="inline-flex items-center justify-center gap-2"><LuLoader size={18} className="animate-spin" /> Processing…</span>
            ) : form.paymentMethod === 'whatsapp' ? (
              'Send Order on WhatsApp'
            ) : (
              'Pay with Paystack'
            )}
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
