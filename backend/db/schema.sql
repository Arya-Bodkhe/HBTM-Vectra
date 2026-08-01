create table users (
id uuid primary key default gen_random_uuid(),
display_name text,
created_at timestamptz default now()
);

create table future_selves (
id uuid primary key default gen_random_uuid(),
user_id uuid references users(id),
statement text not null
);

create table pillars (
id uuid primary key default gen_random_uuid(),
future_self_id uuid references future_selves(id),
name text not null,
mastery_score int default 20,
priority_weight int default 2
);

create table content_log (
id uuid primary key default gen_random_uuid(),
user_id uuid references users(id),
pillar_id uuid references pillars(id),
content_id text,
logged_at timestamptz default now()
);

create table journal_entries (
id uuid primary key default gen_random_uuid(),
user_id uuid references users(id),
text text,
created_at timestamptz default now()
);

create table mastery_history (
id uuid primary key default gen_random_uuid(),
pillar_id uuid references pillars(id),
score int not null,
recorded_at timestamptz default now()
);