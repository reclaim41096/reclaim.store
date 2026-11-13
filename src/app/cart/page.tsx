'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useCart } from '@/components/CartProvider';
import { formatNaira } from '@/lib/format';

const DELIVERY_FEE = 1000;

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const delivery = subtotal === 0 ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  return (
    <>
      <Header />

      <div className="flex justify-center gap-7 px-6 pb-2 pt-7 text-[13px] font-semibold md:px-12">
        <span className="text-brand">1. Cart</span>
        <span className="text-ink-faint">—</span>
        <span className="text-ink-faint">2. Checkout</span>
        <span className="text-ink-faint">—</span>
        <span className="text-ink-faint">3. Confirmation</span>
      </div>

      <div className="px-6 pb-16 pt-4 md:px-12">
        <h1 className="mb-7 font-display text-[30px] font-bold">Your Cart ({items.length})</h1>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-brand-border bg-white p-12 text-center">
            <p className="mb-4 text-ink-muted">Your cart is empty.</p>
            <Link href="/shop" className="font-semibold text-brand">
              Continue shopping →
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap items-start gap-10">
            <div className="flex min-w-0 flex-1 basis-[560px] flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex items-center gap-4 rounded-2xl border border-brand-border bg-white p-5"
                >
                  <div className="flex-1">
                    <div className="text-[15px] font-bold">{item.productName}</div>
                    {item.variantLabel && (
                      <div className="mt-1 text-[13px] text-ink-light">{item.variantLabel}</div>
                    )}
                  </div>
                  <div className="flex items-center overflow-hidden rounded-full border border-brand-border">
                    <button
                      className="h-8 w-8 text-base"
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                    >
                      –
                    </button>
                    <span className="w-7 text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      className="h-8 w-8 text-base"
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <div className="w-20 text-right font-bold">
                    {formatNaira(item.unitPrice * item.quantity)}
                  </div>
                  <button
                    aria-label="Remove"
                    className="text-ink-faint hover:text-[#C13C3C]"
                    onClick={() => removeItem(item.variantId)}
                  >
                    ✕
                  </button>
                </div>
              ))}
              <Link href="/shop" className="mt-1 text-sm font-semibold">
                ← Continue shopping
              </Link>
            </div>

            <div className="flex-0 flex w-full basis-[360px] flex-col gap-4 rounded-2xl border border-brand-border bg-white p-6 md:w-[360px]">
              <h3 className="text-lg font-bold">Order Summary</h3>
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
              <Link
                href="/checkout"
                className="rounded-full bg-brand py-3.5 text-center text-[15px] font-semibold text-white hover:bg-brand-dark"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}
