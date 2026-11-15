'use client';

import { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa6';
import { whatsappUrl } from '@/lib/whatsapp';

/** Re-opens the pre-filled WhatsApp chat for this order (message is kept in sessionStorage). */
export function WhatsAppResend({ orderCode }: { orderCode: string }) {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    try {
      setMsg(window.sessionStorage.getItem(`reclaim-wa-${orderCode}`));
    } catch {
      /* ignore */
    }
  }, [orderCode]);
  if (!msg) return null;
  return (
    <a
      href={whatsappUrl(msg)}
      target="_blank"
      rel="noopener noreferrer"
      className="mb-4 inline-flex items-center gap-2 rounded-full bg-whatsapp hover:bg-whatsapp-dark px-6 py-3.5 text-[15px] font-semibold text-white"
    >
      <FaWhatsapp size={20} /> Open WhatsApp chat
    </a>
  );
}
