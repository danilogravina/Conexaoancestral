import { paypalFetch } from '../_lib/paypal';
import { supabaseAdmin } from '../_lib/supabase-admin';

interface CreateOrderBody {
  campaignSlug?: string;
  amount?: number | string;
  currency?: string;
  donor?: {
    name?: string;
    email?: string;
    isAnonymous?: boolean;
    message?: string;
  };
  userId?: string;
}

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
  try {
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    throw new Error('Invalid JSON body');
  }
}

async function getOrCreateCampaign(slug: string, currencyCode: string) {
  const { data: existing, error: existingError } = await supabaseAdmin
    .from('campaigns')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (existingError) throw existingError;
  if (existing && existing.active !== false) return existing;

  // Fallback: seed campaign from a project with the same id/slug
  const { data: project } = await supabaseAdmin
    .from('projects')
    .select('id, title, goal_amount')
    .eq('id', slug)
    .maybeSingle();

  if (!project) return null;

  const { data: upserted, error: upsertError } = await supabaseAdmin
    .from('campaigns')
    .upsert({
      slug,
      title: project.title || slug,
      goal_amount: project.goal_amount ?? 0,
      currency: currencyCode,
      active: true,
    }, { onConflict: 'slug' })
    .select()
    .maybeSingle();

  if (upsertError) throw upsertError;
  return upserted;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { error: 'Method not allowed' });
  }

  let pendingDonationId: string | null = null;

  try {
    const body = (await readJson(req)) as CreateOrderBody;
    const { campaignSlug, amount, currency = 'USD', donor, userId } = body || {};

    const numericAmount = Number(amount);
    if (!campaignSlug || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      return send(res, 400, { error: 'Invalid campaign or amount' });
    }

    const currencyCode = String(currency || 'USD').toUpperCase();

    const campaign = await getOrCreateCampaign(campaignSlug, currencyCode);
    if (!campaign) {
      return send(res, 404, { error: 'Campaign not found or inactive' });
    }

    const { data: donation, error: donationError } = await supabaseAdmin
      .from('donations')
      .insert({
        campaign_id: campaign.id,
        project_id: campaignSlug, // keep compatibility with existing UI
        user_id: userId || null,
        amount: numericAmount,
        currency: currencyCode,
        status: 'pending',
        provider: 'paypal',
        payment_method: 'paypal',
        donor_name: donor?.isAnonymous ? 'Anônimo' : donor?.name,
        donor_email: donor?.isAnonymous ? null : donor?.email,
        is_anonymous: donor?.isAnonymous ?? false,
        message: donor?.message,
      })
      .select('id')
      .single();

    if (donationError || !donation) {
      return send(res, 500, { error: 'Failed to create donation record' });
    }

    pendingDonationId = donation.id;

    const purchaseUnit = {
      amount: {
        currency_code: currencyCode,
        value: numericAmount.toFixed(2),
      },
      custom_id: donation.id,
      reference_id: campaignSlug,
    };

    const orderResponse = await paypalFetch('/v2/checkout/orders', {
      method: 'POST',
      body: {
        intent: 'CAPTURE',
        purchase_units: [purchaseUnit],
        application_context: {
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW',
        },
      },
    });

    const orderID = orderResponse?.id;
    if (!orderID) {
      return send(res, 502, { error: 'PayPal did not return an order ID' });
    }

    await supabaseAdmin
      .from('donations')
      .update({ provider_order_id: orderID })
      .eq('id', donation.id);

    return send(res, 200, { orderID, donationId: donation.id });
  } catch (error: any) {
    console.error('Error creating PayPal order:', error);
    if (pendingDonationId) {
      await supabaseAdmin
        .from('donations')
        .update({ status: 'failed' })
        .eq('id', pendingDonationId);
    }
    return send(res, 500, { error: error?.message || 'Internal error' });
  }
}
