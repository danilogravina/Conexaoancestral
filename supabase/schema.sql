-- ==========================================
-- CONEXÃO ANCESTRAL - SUPABASE SCHEMA
-- ==========================================

-- 1. PERFIS DE USUÁRIOS (Extensão do Auth)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  role text default 'user', -- 'user', 'admin', 'editor'
  cpf text,
  phone text,
  address jsonb default '{}',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. CATEGORIAS DE PROJETOS (Opcional, mas útil para normalização)
create table categories (
  id uuid default gen_random_uuid() primary key,
  name text not null unique,
  slug text not null unique
);

-- 3. PROJETOS
create table projects (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  category text references categories(name), -- Ou texto direto para simplificar
  description text,
  full_description text,
  image_url text,
  goal_amount numeric not null default 0,
  raised_amount numeric not null default 0,
  status text not null default 'Novo', -- 'Novo', 'Em Andamento', 'Quase Lá', 'Concluído'
  beneficiaries_count integer,
  year integer,
  impact_data jsonb default '{}', -- Dados extras como 'power' (5kW)
  gallery text[] default '{}',
  created_at timestamp with time zone default now()
);

-- 4. BLOG POSTS
create table blog_posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  image_url text,
  category text,
  author_id uuid references profiles(id),
  read_time text,
  featured boolean default false,
  published_at timestamp with time zone default now()
);

-- 5. DOAÇÕES / TRANSPARÊNCIA
create table donations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id),
  project_id uuid references projects(id),
  amount numeric not null,
  donor_name text default 'Anônimo',
  payment_method text,
  transaction_id text,
  status text default 'confirmado',
  created_at timestamp with time zone default now()
);

-- 6. DADOS DE IMPACTO GERAL (Estatísticas para a Home/Transparência)
create table impact_stats (
  id uuid default gen_random_uuid() primary key,
  label text not null unique,
  value text not null,
  description text,
  icon text,
  suffix text
);

-- ==========================================
-- SEGURANÇA (RLS - ROW LEVEL SECURITY)
-- ==========================================

-- Ativar RLS em tudo
alter table profiles enable row level security;
alter table projects enable row level security;
alter table blog_posts enable row level security;
alter table donations enable row level security;
alter table impact_stats enable row level security;

-- Políticas de Profiles
create policy "Users can view their own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);

-- Políticas de Leitura Pública (Qualquer um pode ver o site)
create policy "Public can view read-only data" on projects for select using (true);
create policy "Public can view blog posts" on blog_posts for select using (true);
create policy "Public can view statistics" on impact_stats for select using (true);

-- Políticas de Doações
create policy "Donors can view their own donations" on donations for select using (auth.uid() = user_id);
create policy "Anyone can insert a donation" on donations for insert with check (true);

-- Políticas de Admin
create policy "Admins can manage everything" on projects for all using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- ==========================================
-- PayPal / Campaigns additions
-- ==========================================

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

-- Donations enhancements for PayPal tracking
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
-- ensure status constraint exists (drop previous constraint if present)
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
