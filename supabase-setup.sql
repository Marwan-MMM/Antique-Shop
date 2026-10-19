-- ============================================================================
-- ANTIQUE KHAN — Supabase setup / migration
-- Project: https://vvwrexpwdmhvjsyyhnxn.supabase.co
--
-- RUN THIS ONCE in: Supabase Dashboard → SQL Editor → New query → paste → Run
--
-- WHAT THIS SCRIPT DOES
--   Your database already contains a public.products table (with your real
--   records). This script is therefore ADDITIVE and NON-DESTRUCTIVE:
--     · it NEVER drops or recreates existing tables
--     · it NEVER deletes or overwrites existing rows
--     · it only ADDS missing columns / tables / policies
--   It is idempotent — running it twice is safe.
--
-- BEFORE RUNNING — ONE EDIT:
--   In section 4 below, replace 'admin@example.com' with the email of the
--   admin account you will create in Supabase Auth (section 4 explains how).
--
-- ALREADY RAN AN EARLIER VERSION? Just run it again — every section is
-- idempotent, so existing tables/columns/policies are left untouched and
-- only what is missing gets created (e.g. the featured_pieces table from
-- section 7).
-- ============================================================================

-- ============================================================================
-- 1. PRODUCTS TABLE — additive alignment with the website
-- ============================================================================
-- Your existing columns (id uuid, title, category, price, status, image_url,
-- image_urls, caption, created_at) are PRESERVED exactly as they are.
-- The website needs a few optional columns added:

alter table public.products add column if not exists description text;
alter table public.products add column if not exists height        text;
alter table public.products add column if not exists length        text;
alter table public.products add column if not exists updated_at    timestamptz not null default now();

-- Height / Length are stored as text so you can write them the way you
-- present them ("62 cm", "H 42 cm", …). The website only shows them when
-- they are not empty.

-- ---- Fix the status column -------------------------------------------------
-- The table default was created as '''active''' which stores the string
-- 'active' WITH quote characters. Normalize any such values (this only
-- touches rows whose status contains quote characters or is not one of the
-- three known statuses) and set a clean default.

update public.products
   set status = lower(btrim(replace(status, '''', '')))
 where status is null
    or status like '%''%'
    or lower(btrim(replace(status, '''', ''))) not in ('active','sold','inactive');

update public.products set status = 'active' where status is null;

alter table public.products alter column status set default 'active';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'products_status_check'
  ) then
    alter table public.products
      add constraint products_status_check check (status in ('active','sold','inactive'));
  end if;
exception when others then
  raise notice 'products_status_check skipped: %', sqlerrm;
end $$;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'products_price_check'
  ) then
    alter table public.products
      add constraint products_price_check check (price is null or price >= 0);
  end if;
exception when others then
  raise notice 'products_price_check skipped: %', sqlerrm;
end $$;

-- About the image_urls column (text):
--   The website reads it defensively and understands ALL of these formats:
--     · a JSON array of URL strings            → ["https://…","https://…"]
--     · a JSON array of objects with url/src   → [{"url":"https://…"}, …]
--     · newline- or comma-separated URLs       → plain text
--     · a single URL
--   The admin panel always writes a JSON array of URL strings, and stores the
--   cover photo separately in image_url. Your existing values remain valid —
--   nothing needs to be converted.

-- ============================================================================
-- 2. ORDERS TABLE (new) — customer orders from checkout
--    Guests may INSERT orders; NO ONE (not even anonymously) can read them
--    through the API except the admin. Customer data is never public.
-- ============================================================================
create table if not exists public.orders (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  code           text not null unique,
  customer_name  text not null,
  phone          text not null,
  phone2         text,
  governorate    text not null,
  city_area      text not null,
  address        text not null,
  notes          text,
  payment_method text not null check (payment_method in ('cod','instapay')),
  items          jsonb not null,
  subtotal       numeric not null check (subtotal >= 0),
  delivery_fee   numeric check (delivery_fee is null or delivery_fee >= 0),
  total          numeric not null check (total >= 0),
  status         text not null default 'new' check (status in ('new','confirmed','delivered','cancelled'))
);

-- ============================================================================
-- 3. SETTINGS TABLE (new) — InstaPay details & delivery fee (Admin → Settings)
--    Public can READ (checkout shows these); only the admin can write.
-- ============================================================================
create table if not exists public.settings (
  key        text primary key,
  value      text not null default '',
  updated_at timestamptz not null default now()
);

insert into public.settings (key, value) values
  ('delivery_fee',     ''),
  ('delivery_note',    'Delivery fee will be confirmed by the shop'),
  ('instapay_number',  ''),
  ('instapay_handle',  ''),
  ('instapay_name',    '')
on conflict (key) do nothing;

-- ============================================================================
-- 4. ADMIN ALLOW-LIST + SECURITY-DEFINER CHECK
--    >>> EDIT THE EMAIL BELOW before running! <<<
--    Then create the matching user in:
--      Dashboard → Authentication → Users → "Add user"
--      → same email + a strong password (this is the Store Admin login)
--    Optionally also disable open signups:
--      Dashboard → Authentication → Sign In / Providers →
--      turn OFF "Allow new users to sign up" (recommended — the admin user
--      is created from the dashboard, visitors never need to sign up)
-- ============================================================================
create table if not exists public.admin_users (
  email text primary key
);

insert into public.admin_users (email)
values ('admin@example.com')          -- <<< EDIT: your admin email
on conflict (email) do nothing;

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_users
    where email = auth.email() and auth.email() is not null
  );
$$;

-- ============================================================================
-- 5. ROW LEVEL SECURITY
-- ============================================================================
alter table public.products    enable row level security;
alter table public.orders      enable row level security;
alter table public.settings    enable row level security;
alter table public.admin_users enable row level security;

-- ---- products --------------------------------------------------------------
-- Visitors: read ONLY active (shop) and sold (Past Gems) pieces.
-- Inactive ("Hidden") pieces are invisible to the public — enforced here,
-- not just in the UI.
drop policy if exists "public read catalog" on public.products;
create policy "public read catalog" on public.products
  for select to anon, authenticated
  using (status in ('active','sold'));

-- Admin: full access (email must be listed in admin_users).
drop policy if exists "admin read all" on public.products;
create policy "admin read all" on public.products
  for select to authenticated
  using (public.is_admin());

drop policy if exists "admin insert" on public.products;
create policy "admin insert" on public.products
  for insert to authenticated
  with check (public.is_admin());

drop policy if exists "admin update" on public.products;
create policy "admin update" on public.products
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin delete" on public.products;
create policy "admin delete" on public.products
  for delete to authenticated
  using (public.is_admin());

-- ---- orders ----------------------------------------------------------------
-- Anyone (guest checkout) may place an order, but never read or change one.
drop policy if exists "anyone can order" on public.orders;
create policy "anyone can order" on public.orders
  for insert to anon, authenticated
  with check (true);

drop policy if exists "admin read orders" on public.orders;
create policy "admin read orders" on public.orders
  for select to authenticated
  using (public.is_admin());

drop policy if exists "admin update orders" on public.orders;
create policy "admin update orders" on public.orders
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- (no delete policy for orders — nothing deletes orders via the API)

-- ---- settings --------------------------------------------------------------
drop policy if exists "public read settings" on public.settings;
create policy "public read settings" on public.settings
  for select to anon, authenticated
  using (true);

drop policy if exists "admin write settings" on public.settings;
create policy "admin write settings" on public.settings
  for insert to authenticated
  with check (public.is_admin());

drop policy if exists "admin update settings" on public.settings;
create policy "admin update settings" on public.settings
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---- admin_users -----------------------------------------------------------
-- RLS is enabled and NO policy exists → the table is invisible through the
-- API. It is only read by the security-definer is_admin() function.

-- ============================================================================
-- 6. STORAGE BUCKET for product photos (public read, admin-only write)
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "public read product images" on storage.objects;
create policy "public read product images" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'product-images');

drop policy if exists "admin upload product images" on storage.objects;
create policy "admin upload product images" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "admin update product images" on storage.objects;
create policy "admin update product images" on storage.objects
  for update to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "admin delete product images" on storage.objects;
create policy "admin delete product images" on storage.objects
  for delete to authenticated
  using (bucket_id = 'product-images' and public.is_admin());

-- ============================================================================
-- 7. FEATURED PIECES (new) — the homepage "Featured Pieces" showcase,
--    managed in Admin → Featured Pieces. It is a SELECTOR over the products
--    you already have — NOT a second product/image manager:
--      · each row picks ONE existing product (product_id, required, unique —
--        a product can be featured only once) and stores only its
--        display_order and active (published/hidden) flag
--      · the homepage card uses the product's OWN image, title and caption —
--        nothing is uploaded, duplicated or copied
--      · Available AND Sold products are both selectable; selling a featured
--        product does NOT remove or hide its entry — it stays in the
--        showcase until you hide or remove the entry yourself
--      · hiding/deleting an entry never touches the product, its status or
--        its photos (deleting the PRODUCT in Products removes its entry —
--        ON DELETE CASCADE — the product's photos are unaffected)
--    Photos stay in the existing product-images Storage bucket exactly as
--    the Products manager uploaded them; this table adds no images.
-- ============================================================================
create table if not exists public.featured_pieces (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  product_id    uuid not null references public.products (id) on delete cascade,
  display_order integer not null default 0,
  active        boolean not null default true
);

-- Running an EARLIER version of this script? It created the table with a
-- required image_url column (the old standalone-image design). Relax it and
-- add the product link so the new product-based rows work. Nothing is
-- deleted — legacy rows simply stay until you remove them in the manager.
alter table public.featured_pieces
  add column if not exists product_id uuid references public.products (id) on delete cascade;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'featured_pieces'
      and column_name = 'image_url'
  ) then
    alter table public.featured_pieces alter column image_url drop not null;
  end if;
exception when others then
  raise notice 'featured_pieces image_url relax skipped: %', sqlerrm;
end $$;

create index if not exists featured_pieces_display_order_idx
  on public.featured_pieces (display_order);

-- one featured entry per product (a product can be featured only once)
do $$
begin
  if not exists (
    select 1 from pg_indexes
    where schemaname = 'public' and indexname = 'featured_pieces_product_id_key'
  ) then
    create unique index featured_pieces_product_id_key
      on public.featured_pieces (product_id);
  end if;
exception when others then
  raise notice 'featured_pieces_product_id_key skipped: %', sqlerrm;
end $$;

alter table public.featured_pieces enable row level security;

-- Visitors: read ONLY published (active) entries, and only the homepage
-- needs them. Hidden entries stay invisible to the public — enforced here,
-- not just in the UI.
drop policy if exists "public read active featured" on public.featured_pieces;
create policy "public read active featured" on public.featured_pieces
  for select to anon, authenticated
  using (active = true);

-- Admin: full access (email must be listed in admin_users).
drop policy if exists "admin read all featured" on public.featured_pieces;
create policy "admin read all featured" on public.featured_pieces
  for select to authenticated
  using (public.is_admin());

drop policy if exists "admin insert featured" on public.featured_pieces;
create policy "admin insert featured" on public.featured_pieces
  for insert to authenticated
  with check (public.is_admin());

drop policy if exists "admin update featured" on public.featured_pieces;
create policy "admin update featured" on public.featured_pieces
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin delete featured" on public.featured_pieces;
create policy "admin delete featured" on public.featured_pieces
  for delete to authenticated
  using (public.is_admin());

-- ============================================================================
-- DONE. Next steps (see README.md):
--   1. Dashboard → Authentication → Users → Add user (admin email + password)
--   2. Paste the anon/publishable key into config.js
--   3. Optional: upload the old project's photos with migrate-images.mjs
--   4. Sign in at admin.html → Settings → add InstaPay details + delivery fee
--      whenever you are ready (leave empty until then — nothing is invented)
--   5. Admin → Featured Pieces → pick the products to showcase
--      (Available and Sold both work; each product once)
-- ============================================================================
