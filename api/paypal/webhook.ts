import { PAYPAL_WEBHOOK_ID, paypalFetch } from '../_lib/paypal.js';
import { getSupabaseAdmin } from '../_lib/supabase-admin.js';

function send(res: any, status: number, payload: any) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

async function readRawBody(req: any): Promise<{ raw: string; json: any }> {
  const chunks: Uint8Array[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf-8');
  const json = raw ? JSON.parse(raw) : {};
  return { raw, json };
}

async function updateDonationStatus(
  supabaseAdmin: ReturnType<typeof getSupabaseAdmin>,
  filters: any,
  updates: Record<string, any>
) {
  await supabaseAdmin.from('donations').update(updates).match(filters as any);
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { error: 'Method not allowed' });
  }

  if (!PAYPAL_WEBHOOK_ID) {
    return send(res, 500, { error: 'PAYPAL_WEBHOOK_ID not configured' });
  }

  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { json: event } = await readRawBody(req);

    const headers = req.headers || {};
    const requiredHeaders = [
      'paypal-auth-algo',
      'paypal-cert-url',
      'paypal-transmission-id',
      'paypal-transmission-sig',
      'paypal-transmission-time',
    ];

    const missingHeaders = requiredHeaders.filter((key) => !headers[key]);
    if (missingHeaders.length > 0) {
      return send(res, 400, { error: 'Missing PayPal signature headers' });
    }

    const verification = await paypalFetch('/v1/notifications/verify-webhook-signature', {
      method: 'POST',
      body: {
        auth_algo: headers['paypal-auth-algo'],
        cert_url: headers['paypal-cert-url'],
        transmission_id: headers['paypal-transmission-id'],
        transmission_sig: headers['paypal-transmission-sig'],
        transmission_time: headers['paypal-transmission-time'],
        webhook_id: PAYPAL_WEBHOOK_ID,
        webhook_event: event,
      },
    });

    if (verification?.verification_status !== 'SUCCESS') {
      return send(res, 400, { error: 'Invalid webhook signature' });
    }

    const eventType = event?.event_type;
    const resource = event?.resource || {};

    if (eventType === 'CHECKOUT.ORDER.APPROVED') {
      const orderId = resource?.id || resource?.supplementary_data?.related_ids?.order_id;
      if (orderId) {
        await updateDonationStatus(supabaseAdmin, { provider_order_id: orderId }, { status: 'approved' });
      }
    }

    if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
      const captureId = resource?.id;
      const orderId = resource?.supplementary_data?.related_ids?.order_id;
      const customId = resource?.custom_id;

      const filterList = [
        orderId ? `provider_order_id.eq.${orderId}` : undefined,
        captureId ? `provider_capture_id.eq.${captureId}` : undefined,
        customId ? `id.eq.${customId}` : undefined,
      ].filter(Boolean);

      if (filterList.length === 0) {
        return send(res, 200, { ok: true });
      }

      const { data: donation } = await supabaseAdmin
        .from('donations')
        .select('id, status, provider_capture_id')
        .or(filterList.join(','))
        .maybeSingle();

      if (donation && donation.provider_capture_id === captureId && donation.status === 'confirmed') {
        return send(res, 200, { ok: true });
      }

      const matchFilter = donation?.id
        ? { id: donation.id }
        : captureId
          ? { provider_capture_id: captureId }
          : orderId
            ? { provider_order_id: orderId }
            : customId
              ? { id: customId }
              : {};

      if (Object.keys(matchFilter).length > 0) {
        await updateDonationStatus(supabaseAdmin, matchFilter, {
          status: 'confirmed',
          provider_capture_id: captureId ?? donation?.provider_capture_id,
          confirmed_at: new Date().toISOString(),
        });
      } else {
        return send(res, 200, { ok: true });
      }
    }

    if (eventType === 'PAYMENT.CAPTURE.REFUNDED') {
      const captureId = resource?.id;
      if (captureId) {
        await updateDonationStatus(supabaseAdmin, { provider_capture_id: captureId }, { status: 'refunded' });
      }
    }

    if (eventType === 'PAYMENT.CAPTURE.DENIED' || eventType === 'PAYMENT.CAPTURE.FAILED') {
      const captureId = resource?.id;
      if (captureId) {
        await updateDonationStatus(supabaseAdmin, { provider_capture_id: captureId }, { status: 'failed' });
      }
    }

    return send(res, 200, { ok: true });
  } catch (error: any) {
    console.error('Error processing PayPal webhook:', error);
    return send(res, 500, { error: error?.message || 'Internal error' });
  }
}
