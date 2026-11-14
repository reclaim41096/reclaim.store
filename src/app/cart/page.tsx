'use client';

import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useCart } from '@/components/CartProvider';
import { formatNaira } from '@/lib/format';
import { LuArrowLeft, LuArrowRight, LuMinus, LuPlus, LuX } from 'react-icons/lu';
import { CheckoutSteps } from '@/components/CheckoutSteps';
import Image from 'next/image';
import { BackBar } from '@/components/BackBar';

// Delivery is not charged on the site: cost is agreed with the customer on WhatsApp.
const DELIVERY_FEE = 0;

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart();
  const delivery = subtotal === 0 ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  return (
    <>
      <Header />
      <BackBar fallback="/shop" />

      <CheckoutSteps current={1} />

      <div className="px-6 pb-16 pt-4 md:px-12">
        <h1 className="mb-5 font-display text-[22px] font-semibold md:mb-7 md:text-[30px] md:font-bold">Your Cart ({items.length})</h1>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-brand-border bg-white p-12 text-center">
            <p className="mb-4 text-ink-muted">Your cart is empty.</p>
            <Link href="/shop" className="font-semibold text-brand">
              Continue shopping <LuArrowRight size={16} className="ml-1 inline-block align-[-3px]" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-wrap items-start gap-10">
            <div className="flex min-w-0 flex-1 basis-full md:basis-[560px] flex-col gap-4">
              {items.map((item) => (
                <div
                  key={item.variantId}
                  className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-2xl border border-brand-border bg-white p-4 sm:p-5"
                >
                  <div className="flex min-w-0 flex-1 basis-full items-center gap-3.5 sm:basis-0">
                    {item.imageUrl && (
                      <div className="relative h-16 w-16 flex-none overflow-hidden rounded-xl border border-brand-border bg-white">
                        <Image src={item.imageUrl} alt={item.productName} fill sizes="64px" className="object-contain p-1" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <div className="text-[14px] font-semibold sm:text-[15px] sm:font-bold">{item.productName}</div>
                      {item.variantLabel && (
                        <div className="mt-1 text-[13px] text-ink-light">{item.variantLabel}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center overflow-hidden rounded-full border border-brand-border">
                    <button
                      className="h-8 w-8 text-base"
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <LuMinus size={14} className="mx-auto" />
                    </button>
                    <span className="w-7 text-center text-sm font-bold">{item.quantity}</span>
                    <button
                      className="h-8 w-8 text-base"
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <LuPlus size={14} className="mx-auto" />
                    </button>
                  </div>
                  <div className="ml-auto w-24 text-right text-[15px] font-semibold sm:ml-0 sm:w-20 sm:text-base sm:font-bold">
                    {formatNaira(item.unitPrice * item.quantity)}
                  </div>
                  <button
                    aria-label="Remove"
                    className="text-ink-faint hover:text-[#C13C3C]"
                    onClick={() => removeItem(item.variantId)}
                  >
                    <LuX size={18} />
                  </button>
                </div>
              ))}
              <Link href="/shop" className="mt-1 text-sm font-semibold">
                <LuArrowLeft size={16} className="mr-1 inline-block align-[-3px]" /> Continue shopping
              </Link>
            </div>

            <div className="flex-0 flex w-full basis-full md:basis-[360px] flex-col gap-4 rounded-2xl border border-brand-border bg-white p-6 md:w-[360px]">
              <h3 className="text-base font-semibold md:text-lg md:font-bold">Order Summary</h3>
              <div className="flex flex-col gap-2.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-light">Subtotal</span>
                  <span>{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-light">Delivery</span>
                  <span className={delivery > 0 ? '' : 'text-[13px] text-ink-muted'}>
                {delivery > 0 ? formatNaira(delivery) : 'Agreed on WhatsApp'}
              </span>
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
