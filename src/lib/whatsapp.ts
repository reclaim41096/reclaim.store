import { formatNaira } from './format';

// Reclaim's WhatsApp number in international format, digits only (set NEXT_PUBLIC_WHATSAPP_NUMBER to override).
export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '2347079969990').replace(/\D/g, '');

type Line = { productName: string; variantLabel: string | null; unitPrice: number; quantity: number };

export function buildOrderMessage(o: {
  orderCode: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  items: Line[];
  subtotal: number;
  delivery: number;
  total: number;
}) {
  const lines = o.items.map(
    (i, n) =>
      `${n + 1}. ${i.productName}${i.variantLabel ? ` (${i.variantLabel})` : ''}\n    ${i.quantity} × ${formatNaira(i.unitPrice)} = ${formatNaira(i.unitPrice * i.quantity)}`,
  );
  return [
    `*NEW ORDER: ${o.orderCode}*`,
    'Reclaim Cleaning Products & Beverages',
    '',
    '*CUSTOMER*',
    `Name: ${o.name}`,
    `Phone: ${o.phone}`,
    ...(o.email ? [`Email: ${o.email}`] : []),
    '',
    '*DELIVERY ADDRESS*',
    o.address,
    `${o.city}, ${o.state}`,
    '',
    '*ITEMS*',
    ...lines,
    '',
    `Subtotal: ${formatNaira(o.subtotal)}`,
    `Delivery: ${formatNaira(o.delivery)}`,
    `*TOTAL: ${formatNaira(o.total)}*`,
    '',
    'Please confirm availability and send the payment details. Thank you!',
  ].join('\n');
}

export const whatsappUrl = (message: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
