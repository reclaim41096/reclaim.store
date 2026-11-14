import { formatNaira } from './format';

// Reclaim's WhatsApp number in international format, digits only (set NEXT_PUBLIC_WHATSAPP_NUMBER to override).
export const WHATSAPP_NUMBER = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '2347079969990').replace(/\D/g, '');

type Line = { productName: string; variantLabel: string | null; unitPrice: number; quantity: number };

export type OrderData = {
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
};

export type PaymentInfo = { amount: number; method: string; reference: string };

export function buildOrderMessage(o: OrderData, payment?: PaymentInfo) {
  const lines = o.items.map(
    (i, n) =>
      `${n + 1}. ${i.productName}${i.variantLabel ? ` (${i.variantLabel})` : ''}\n    ${i.quantity} × ${formatNaira(i.unitPrice)} = ${formatNaira(i.unitPrice * i.quantity)}`,
  );
  return [
    payment ? `*PAID ORDER: ${o.orderCode}*` : `*NEW ORDER: ${o.orderCode}*`,
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
    `Delivery: ${o.delivery > 0 ? formatNaira(o.delivery) : 'To be discussed on WhatsApp'}`,
    `*TOTAL: ${formatNaira(o.total)}*`,
    ...(payment
      ? [
          '',
          '*PAYMENT*',
          'Status: PAID (Paystack)',
          `Amount paid: ${formatNaira(payment.amount)}`,
          `Method: ${payment.method}`,
          `Reference: ${payment.reference}`,
          '',
          'Payment confirmed. Please process my order for delivery. Thank you!',
        ]
      : ['', 'Please confirm availability and send the payment details. Thank you!']),
  ].join('\n');
}

/** Used when the order details are not available in this browser (e.g. paid on another device). */
export function buildPaymentOnlyMessage(o: { orderCode: string; name?: string; phone?: string }, payment: PaymentInfo) {
  return [
    `*PAID ORDER: ${o.orderCode}*`,
    'Reclaim Cleaning Products & Beverages',
    '',
    ...(o.name ? [`Name: ${o.name}`] : []),
    ...(o.phone ? [`Phone: ${o.phone}`] : []),
    '',
    '*PAYMENT*',
    'Status: PAID (Paystack)',
    `Amount paid: ${formatNaira(payment.amount)}`,
    `Method: ${payment.method}`,
    `Reference: ${payment.reference}`,
    '',
    'Payment confirmed. Please process my order for delivery. Thank you!',
  ].join('\n');
}

export const whatsappUrl = (message: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
