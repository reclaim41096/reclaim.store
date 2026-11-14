import crypto from 'crypto';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

/**
 * Paystack webhook: Paystack calls this itself when a payment succeeds, so orders are marked
 * paid even if the customer closes the tab before returning to the site.
 * Set the URL in Paystack: Settings → API Keys & Webhooks → https://<your-site>/api/paystack/webhook
 */
export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

  const raw = await req.text();
  const signature = req.headers.get('x-paystack-signature') ?? '';
  const expected = crypto.createHmac('sha512', secret).update(raw).digest('hex');
  const valid =
    signature.length === expected.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  if (!valid) return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });

  const event = JSON.parse(raw);
  if (event.event !== 'charge.success') return NextResponse.json({ received: true });

  const orderCode: string | undefined = event.data?.metadata?.order_code;
  const paidKobo: number = event.data?.amount ?? 0;
  if (!orderCode) return NextResponse.json({ received: true });

  // Only accept the payment if it matches what the order actually costs
  const supabase = createClient();
  const { data: order } = await supabase.from('orders').select('total').eq('order_code', orderCode).maybeSingle();
  if (!order || Math.round(Number(order.total) * 100) !== paidKobo) {
    return NextResponse.json({ received: true, matched: false });
  }

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceKey) {
    await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/orders?order_code=eq.${encodeURIComponent(orderCode)}&status=eq.pending`, {
      method: 'PATCH',
      headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'processing' }),
    });
  }
  return NextResponse.json({ received: true });
}
