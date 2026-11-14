import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/** Starts a Paystack transaction for an existing order. The amount always comes from our database. */
export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: 'Paystack is not configured yet.' }, { status: 503 });
  }

  const { orderCode } = (await req.json().catch(() => ({}))) as { orderCode?: string };
  if (!orderCode) return NextResponse.json({ error: 'Missing order.' }, { status: 400 });

  const supabase = createClient();
  const { data: order } = await supabase
    .from('orders')
    .select('order_code, total, email, customer_name, phone')
    .eq('order_code', orderCode)
    .maybeSingle();
  if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });

  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
  const reference = `${order.order_code}-${Date.now().toString(36)}`;

  const res = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: order.email || `${order.order_code.toLowerCase()}@orders.reclaim.store`,
      amount: Math.round(Number(order.total) * 100), // kobo
      currency: 'NGN',
      reference,
      callback_url: `${origin}/checkout/success?order=${order.order_code}`,
      metadata: { order_code: order.order_code, customer_name: order.customer_name, phone: order.phone },
    }),
  });
  const json = await res.json();
  if (!res.ok || !json.status) {
    return NextResponse.json({ error: json.message ?? 'Could not start payment.' }, { status: 502 });
  }
  return NextResponse.json({ url: json.data.authorization_url as string });
}
