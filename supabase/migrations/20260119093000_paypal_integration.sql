-- PayPal integration schema additions
-- Campaigns table
create table if not exists public.campaigns (
  id uuid default gen_random_uuid() primary key,
  slug text not null unique,
  title text not null,
  goal_amount numeric(12,2) not null default 0,
  currency text not null default 'USD',
  active boolean not null default true,
  created_at timestamp with time zone default now()
);

-- Donations columns for PayPal tracking
alter table public.donations add column if not exists campaign_id uuid references public.campaigns(id) on delete set null;
alter table public.donations add column if not exists currency text not null default 'USD';
alter table public.donations add column if not exists provider text not null default 'paypal';
alter table public.donations add column if not exists provider_order_id text;
alter table public.donations add column if not exists provider_capture_id text;
alter table public.donations add column if not exists donor_email text;
alter table public.donations add column if not exists is_anonymous boolean not null default false;
alter table public.donations add column if not exists message text;
alter table public.donations add column if not exists confirmed_at timestamp with time zone;

-- Align status domain and default
alter table public.donations alter column status set default 'pending';
alter table public.donations drop constraint if exists donations_status_check;
alter table public.donations add constraint donations_status_check check (status in (
  'pending', 'approved', 'confirmed', 'failed', 'refunded', 'canceled', 'confirmado'
));

-- Indexes for fast lookups and idempotency
create index if not exists donations_campaign_id_idx on public.donations(campaign_id);
create index if not exists donations_status_idx on public.donations(status);
create unique index if not exists donations_provider_order_id_key on public.donations(provider_order_id) where provider_order_id is not null;
create unique index if not exists donations_provider_capture_id_key on public.donations(provider_capture_id) where provider_capture_id is not null;

-- Campaign progress view (confirmed only)
create or replace view public.campaign_progress as
select
  c.id as campaign_id,
  coalesce(sum(d.amount) filter (where d.status = 'confirmed' or d.status = 'confirmado'), 0)::numeric(12,2) as confirmed_total,
  coalesce(count(*) filter (where d.status = 'confirmed' or d.status = 'confirmado'), 0)::bigint as confirmed_count
from public.campaigns c
left join public.donations d on d.campaign_id = c.id
group by c.id;
