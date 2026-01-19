import { supabaseAdmin } from '../_lib/supabase-admin';

function send(res: any, status: number, payload: any) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return send(res, 405, { error: 'Method not allowed' });
  }

  try {
    const { data: campaigns, error: campaignsError } = await supabaseAdmin
      .from('campaigns')
      .select('id, slug, title, goal_amount, currency')
      .eq('active', true);

    if (campaignsError) {
      return send(res, 500, { error: 'Failed to load campaigns' });
    }

    const progressMap = new Map<string, { confirmed_total: number; confirmed_count: number }>();

    const { data: viewData, error: viewError } = await supabaseAdmin
      .from('campaign_progress')
      .select('campaign_id, confirmed_total, confirmed_count');

    if (!viewError && viewData) {
      for (const row of viewData) {
        progressMap.set(row.campaign_id, {
          confirmed_total: Number(row.confirmed_total || 0),
          confirmed_count: Number(row.confirmed_count || 0),
        });
      }
    } else {
      const { data: donations } = await supabaseAdmin
        .from('donations')
        .select('campaign_id, amount, status');

      if (donations) {
        for (const donation of donations) {
          if (!donation || !donation.campaign_id) continue;
          const isConfirmed = donation.status === 'confirmed' || donation.status === 'confirmado';
          if (!isConfirmed) continue;
          const entry = progressMap.get(donation.campaign_id) || { confirmed_total: 0, confirmed_count: 0 };
          entry.confirmed_total += Number(donation.amount) || 0;
          entry.confirmed_count += 1;
          progressMap.set(donation.campaign_id, entry);
        }
      }
    }

    const payload = (campaigns || []).map((campaign) => {
      const progress = progressMap.get(campaign.id) || { confirmed_total: 0, confirmed_count: 0 };
      const goal = Number(campaign.goal_amount) || 0;
      const ratio = goal > 0 ? Math.min(progress.confirmed_total / goal, 1) : 0;
      return {
        id: campaign.id,
        slug: campaign.slug,
        title: campaign.title,
        goal_amount: Number(campaign.goal_amount) || 0,
        currency: campaign.currency,
        confirmed_total: Number(progress.confirmed_total.toFixed(2)),
        confirmed_count: progress.confirmed_count,
        progress_ratio: Number(ratio.toFixed(4)),
      };
    });

    return send(res, 200, payload);
  } catch (error: any) {
    console.error('Error loading campaigns:', error);
    return send(res, 500, { error: error?.message || 'Internal error' });
  }
}
