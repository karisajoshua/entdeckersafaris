-- Destination profiles are reusable across tour itineraries.
create table if not exists public.destinations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  country text not null default 'Kenya',
  region text not null default '',
  description text not null default '',
  highlights text[] not null default '{}',
  latitude double precision,
  longitude double precision,
  hero_image text not null default '',
  gallery_images text[] not null default '{}',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint destination_coordinates_pair check ((latitude is null) = (longitude is null)),
  constraint destination_latitude_range check (latitude between -90 and 90),
  constraint destination_longitude_range check (longitude between -180 and 180)
);
alter table public.destinations enable row level security;
grant select on public.destinations to anon, authenticated;
grant insert, update, delete on public.destinations to authenticated;
create policy "Public can read published destinations" on public.destinations
for select to anon, authenticated using (published or public.has_role(auth.uid(), 'admin'));
create policy "Admins can insert destinations" on public.destinations
for insert to authenticated with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins can update destinations" on public.destinations
for update to authenticated using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));
create policy "Admins can delete destinations" on public.destinations
for delete to authenticated using (public.has_role(auth.uid(), 'admin'));
