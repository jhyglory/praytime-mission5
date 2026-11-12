-- Apply ONLY to the dedicated, non-production prayer CMS demo project.
-- Existing beta_signups, native JSON and unrelated tables/storage are untouched.
create table public.prayers (
  id uuid primary key default gen_random_uuid(),
  source_key text unique,
  title text not null check (char_length(title) between 1 and 300 and title ~ '[^[:space:]]'),
  content text not null check (char_length(content) between 1 and 20000 and content ~ '[^[:space:]]'),
  category text check (category is null or char_length(category) between 1 and 80),
  category_full text check (category_full is null or char_length(category_full) between 1 and 200),
  keyword text check (keyword is null or char_length(keyword) between 1 and 100),
  scripture_ref text check (scripture_ref is null or char_length(scripture_ref) between 1 and 200),
  scripture_text text check (scripture_text is null or char_length(scripture_text) between 1 and 2000),
  language text not null default 'ko' check (char_length(language) between 2 and 16 and language ~ '^[a-z]{2,3}(-[A-Z]{2})?$'),
  image_path text check (image_path is null or image_path ~ '^prayers/[0-9a-f-]{36}/[0-9a-f-]{36}\.(jpg|jpeg|png|webp)$'),
  source_payload jsonb check (source_payload is null or jsonb_typeof(source_payload) = 'object'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint prayers_source_key_format check (source_key is null or source_key ~ '^praytime:ko:[A-Za-z0-9_-]{1,120}$')
);

create index prayers_updated_id_idx on public.prayers (updated_at desc, id desc);
create index prayers_category_updated_id_idx on public.prayers (category, updated_at desc, id desc);

-- No anonymous/authenticated policies: all application access goes via Next.js.
alter table public.prayers enable row level security;
revoke all on table public.prayers from public, anon, authenticated;
grant select, insert, update, delete on table public.prayers to service_role;

create function public.prayers_touch_updated_at()
returns trigger language plpgsql security invoker set search_path = '' as $$
begin
  new.id := old.id;
  new.created_at := old.created_at;
  new.source_key := old.source_key;
  new.source_payload := old.source_payload;
  new.updated_at := now();
  return new;
end;
$$;
revoke all on function public.prayers_touch_updated_at() from public, anon, authenticated;
grant execute on function public.prayers_touch_updated_at() to service_role;
create trigger prayers_updated_at before update on public.prayers
for each row execute function public.prayers_touch_updated_at();

-- The server uses signed reads/proxy responses; no public Storage write policy.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('prayer-covers', 'prayer-covers', false, 2097152, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;
-- Fail safely if a prior bucket with this name has unrelated/incompatible settings.
do $$
begin
  if not exists (
    select 1 from storage.buckets where id = 'prayer-covers' and public = false
      and file_size_limit = 2097152
      and allowed_mime_types @> array['image/jpeg','image/png','image/webp']::text[]
      and allowed_mime_types <@ array['image/jpeg','image/png','image/webp']::text[]
  ) then raise exception 'Existing prayer-covers bucket settings differ; inspect before applying.';
  end if;
end;
$$;
