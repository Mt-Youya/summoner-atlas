create table public.resg_cache (
  cache_key text primary key,
  payload jsonb not null,
  expires_at timestamptz not null,
  updated_at timestamptz not null default now()
);

create index resg_cache_expires_at_idx on public.resg_cache (expires_at);

alter table public.resg_cache enable row level security;
