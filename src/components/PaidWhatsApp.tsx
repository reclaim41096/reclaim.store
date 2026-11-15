'use client';

import { useEffect, useMemo, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa6';
import { buildOrderMessage, buildPaymentOnlyMessage, whatsappUrl, type OrderData } from '@/lib/whatsapp';

/** After a verified Paystack payment: sends the customer to Reclaim's WhatsApp with the order + payment details. */
export function PaidWhatsApp({
  orderCode,
  amount,
  method,
  reference,
  name,
  phone,
}: {
  orderCode: string;
  amount: number;
  method: string;
  reference: string;
  name?: string;
  phone?: string;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(4);

  const flagKey = useMemo(() => `reclaim-wa-sent-${orderCode}`, [orderCode]);

  useEffect(() => {
    let order: OrderData | null = null;
    try {
      const raw = window.sessionStorage.getItem(`reclaim-order-${orderCode}`);
      if (raw) order = JSON.parse(raw);
    } catch {
      /* ignore */
    }
    const payment = { amount, method, reference };
    const message = order ? buildOrderMessage(order, payment) : buildPaymentOnlyMessage({ orderCode, name, phone }, payment);
    setUrl(whatsappUrl(message));
  }, [orderCode, amount, method, reference, name, phone]);

  // Auto-redirect once (not again if the customer comes back to this page)
  useEffect(() => {
    if (!url) return;
    let already = false;
    try {
      already = window.sessionStorage.getItem(flagKey) === '1';
    } catch {
      /* ignore */
    }
    if (already) {
      setSeconds(0);
      return;
    }
    if (seconds <= 0) {
      try {
        window.sessionStorage.setItem(flagKey, '1');
      } catch {
        /* ignore */
      }
      window.location.href = url;
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [url, seconds, flagKey]);

  if (!url) return null;
  return (
    <div className="mb-6">
      <a
        href={url}
        onClick={() => {
          try {
            window.sessionStorage.setItem(flagKey, '1');
          } catch {
            /* ignore */
          }
        }}
        className="inline-flex items-center gap-2 rounded-full bg-whatsapp hover:bg-whatsapp-dark px-6 py-3.5 text-[15px] font-semibold text-white"
      >
        <FaWhatsapp size={20} /> Send order &amp; payment details on WhatsApp
      </a>
      {seconds > 0 && <p className="mt-3 text-xs text-ink-faint">Opening WhatsApp in {seconds}s…</p>}
    </div>
  );
}
