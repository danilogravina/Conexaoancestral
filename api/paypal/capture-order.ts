import { paypalFetch } from '../_lib/paypal.js';
import { getSupabaseAdmin } from '../_lib/supabase-admin.js';

function send(res: any, status: number, payload: any) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

async function readJson(req: any): Promise<any> {
  if (req.body) return req.body;
  const chunks: Uint8Array[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf-8');
  return raw ? JSON.parse(raw) : {};
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { error: 'Method not allowed' });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const body = await readJson(req);
    const orderID = body?.orderID as string;

    if (!orderID) {
      return send(res, 400, { error: 'orderID is required' });
    }

    const captureResponse = await paypalFetch(`/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      body: {},
    });

    const captureId = captureResponse?.purchase_units?.[0]?.payments?.captures?.[0]?.id;
    const purchaseUnit = captureResponse?.purchase_units?.[0];
    const customDonationId = purchaseUnit?.custom_id as string | undefined;

    if (!captureId) {
      return send(res, 502, { error: 'Capture ID not found in PayPal response' });
    }

    const { data: existingDonation } = await supabaseAdmin
      .from('donations')
      .select('id, status, provider_capture_id')
      .eq('provider_order_id', orderID)
      .maybeSingle();

    // Idempotency: if already confirmed with same capture ID, just return success
    if (existingDonation && existingDonation.provider_capture_id === captureId) {
      return send(res, 200, { ok: true, status: existingDonation.status, captureId });
    }

    const targetFilter = existingDonation?.id
      ? { id: existingDonation.id }
      : customDonationId
        ? { id: customDonationId }
        : { provider_order_id: orderID };

    await supabaseAdmin
      .from('donations')
      .update({
        status: 'confirmed',
        provider_capture_id: captureId,
        confirmed_at: new Date().toISOString(),
      })
      .match(targetFilter as any);

    return send(res, 200, { ok: true, status: 'confirmed', captureId });
  } catch (error: any) {
    console.error('Error capturing PayPal order:', error);
    return send(res, 500, { error: error?.message || 'Internal error' });
  }
}
