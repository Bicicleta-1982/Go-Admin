create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  full_name text not null,
  rut text,
  role text not null default 'lectura' check (role in ('admin','finanzas','ventas','lectura')),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.company_settings (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  rut text not null,
  address text,
  city text,
  email text,
  phone text,
  logo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text not null,
  description text,
  valid_from timestamptz not null default now(),
  valid_to timestamptz,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.audit_log (
  id uuid primary key default gen_random_uuid(),
  table_name text not null,
  record_id uuid,
  action text not null,
  user_id uuid references public.profiles(id),
  reason text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.attachments (
  id uuid primary key default gen_random_uuid(),
  entity_type text not null,
  entity_id uuid,
  file_name text not null,
  mime_type text,
  file_size bigint not null default 0,
  storage_path text not null,
  uploaded_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table if not exists public.tax_document_types (
  id uuid primary key default gen_random_uuid(),
  sii_code text unique not null,
  name text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists settings_key_idx on public.settings(key);
create index if not exists audit_log_table_record_idx on public.audit_log(table_name, record_id);

alter table public.profiles enable row level security;
alter table public.company_settings enable row level security;
alter table public.settings enable row level security;
alter table public.audit_log enable row level security;
alter table public.attachments enable row level security;
alter table public.tax_document_types enable row level security;

create policy "Users can read their own profile" on public.profiles for select using (auth.uid() = id or auth.role() = 'authenticated');
create policy "Admins manage profiles" on public.profiles for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')) with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Admins manage company settings" on public.company_settings for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')) with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Authenticated users can read settings" on public.settings for select using (auth.role() = 'authenticated');
create policy "Admins manage settings" on public.settings for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')) with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Admins read audit log" on public.audit_log for select using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Authenticated users can read attachments" on public.attachments for select using (auth.role() = 'authenticated');
create policy "Users manage their own attachments" on public.attachments for all using (uploaded_by = auth.uid() or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')) with check (uploaded_by = auth.uid() or exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));
create policy "Authenticated users read tax document types" on public.tax_document_types for select using (auth.role() = 'authenticated');
create policy "Admins manage tax document types" on public.tax_document_types for all using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')) with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

insert into public.tax_document_types (sii_code, name, description)
values
  ('33', 'Factura', 'Factura de venta'),
  ('34', 'Factura exenta', 'Factura exenta'),
  ('56', 'Nota de débito', 'Nota de débito'),
  ('61', 'Nota de crédito', 'Nota de crédito')
on conflict (sii_code) do nothing;
