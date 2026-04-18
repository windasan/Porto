-- ============================================================================
-- PORTFOLIO — SUPABASE COMPLETE SETUP
-- ============================================================================
-- Run this entire file in the Supabase SQL Editor:
--   Dashboard → SQL Editor → New Query → paste → Run
--
-- Order of execution:
--   1. Extensions
--   2. Tables + indexes
--   3. Updated_at trigger function
--   4. Triggers per table
--   5. Row Level Security (RLS) enable + policies
--   6. Storage buckets
--   7. Seed sample data (optional — comment out if not wanted)
-- ============================================================================


-- ── 1. EXTENSIONS ────────────────────────────────────────────────────────────

-- pgcrypto gives us gen_random_uuid() on older Supabase instances
-- (on Postgres 14+ it is built-in, but enabling it is harmless)
create extension if not exists "pgcrypto";


-- ── 2. TABLES ────────────────────────────────────────────────────────────────

-- ----------------------------------------------------------------------------
-- experiences
-- ----------------------------------------------------------------------------
create table if not exists public.experiences (
  id           uuid        primary key default gen_random_uuid(),
  company      text        not null,
  role         text        not null,
  description  text        not null,
  start_date   date        not null,
  end_date     date,
  is_current   boolean     not null default false,
  location     text,
  company_url  text,
  tags         text[]      not null default '{}',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  -- Guards
  constraint experiences_company_not_empty  check (char_length(company)     > 0),
  constraint experiences_role_not_empty     check (char_length(role)        > 0),
  constraint experiences_description_not_empty check (char_length(description) > 0),
  -- end_date must be after start_date when both are set
  constraint experiences_dates_order check (
    end_date is null or end_date >= start_date
  )
);

-- Index for the public timeline query (sorted by start_date desc)
create index if not exists idx_experiences_start_date
  on public.experiences (start_date desc);


-- ----------------------------------------------------------------------------
-- projects
-- ----------------------------------------------------------------------------
create table if not exists public.projects (
  id           uuid        primary key default gen_random_uuid(),
  slug         text        not null unique,
  title        text        not null,
  description  text        not null,
  url          text,
  repo_url     text,
  image_url    text,
  tags         text[]      not null default '{}',
  featured     boolean     not null default false,
  year         text        not null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  constraint projects_slug_format     check (slug ~ '^[a-z0-9-]+$'),
  constraint projects_title_not_empty check (char_length(title)       > 0),
  constraint projects_desc_not_empty  check (char_length(description) > 0),
  constraint projects_year_format     check (year ~ '^\d{4}$')
);

create index if not exists idx_projects_featured
  on public.projects (featured desc, year desc);

create index if not exists idx_projects_year
  on public.projects (year desc, created_at desc);


-- ----------------------------------------------------------------------------
-- posts
-- ----------------------------------------------------------------------------
create table if not exists public.posts (
  id           uuid        primary key default gen_random_uuid(),
  slug         text        not null unique,
  title        text        not null,
  excerpt      text        not null,
  content      text        not null,
  cover_url    text,
  tags         text[]      not null default '{}',
  published    boolean     not null default false,
  published_at timestamptz,
  reading_time int         not null default 1,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),

  constraint posts_slug_format       check (slug ~ '^[a-z0-9-]+$'),
  constraint posts_title_not_empty   check (char_length(title)   > 0),
  constraint posts_excerpt_not_empty check (char_length(excerpt) > 0),
  constraint posts_reading_time_pos  check (reading_time >= 1),
  -- published_at must be set when published = true
  constraint posts_published_at_required check (
    published = false or published_at is not null
  )
);

create index if not exists idx_posts_published
  on public.posts (published, published_at desc);

create index if not exists idx_posts_slug
  on public.posts (slug)
  where published = true;


-- ── 3. UPDATED_AT TRIGGER FUNCTION ───────────────────────────────────────────

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;


-- ── 4. TRIGGERS ──────────────────────────────────────────────────────────────

-- experiences
drop trigger if exists trg_experiences_updated_at on public.experiences;
create trigger trg_experiences_updated_at
  before update on public.experiences
  for each row execute function public.set_updated_at();

-- projects
drop trigger if exists trg_projects_updated_at on public.projects;
create trigger trg_projects_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- posts
drop trigger if exists trg_posts_updated_at on public.posts;
create trigger trg_posts_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();


-- ── 5. ROW LEVEL SECURITY ─────────────────────────────────────────────────────

-- Enable RLS on all tables
alter table public.experiences enable row level security;
alter table public.projects    enable row level security;
alter table public.posts       enable row level security;


-- ── experiences policies ──────────────────────────────────────────────────────

-- Anyone (including unauthenticated visitors) can read experiences
create policy "Public can read experiences"
  on public.experiences
  for select
  to anon, authenticated
  using (true);

-- Only authenticated users (your admin account) can insert
create policy "Authenticated can insert experiences"
  on public.experiences
  for insert
  to authenticated
  with check (true);

-- Only authenticated users can update
create policy "Authenticated can update experiences"
  on public.experiences
  for update
  to authenticated
  using (true)
  with check (true);

-- Only authenticated users can delete
create policy "Authenticated can delete experiences"
  on public.experiences
  for delete
  to authenticated
  using (true);


-- ── projects policies ─────────────────────────────────────────────────────────

create policy "Public can read projects"
  on public.projects
  for select
  to anon, authenticated
  using (true);

create policy "Authenticated can insert projects"
  on public.projects
  for insert
  to authenticated
  with check (true);

create policy "Authenticated can update projects"
  on public.projects
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can delete projects"
  on public.projects
  for delete
  to authenticated
  using (true);


-- ── posts policies ────────────────────────────────────────────────────────────

-- Public visitors see only published posts
create policy "Public can read published posts"
  on public.posts
  for select
  to anon
  using (published = true);

-- Authenticated users (admin) can see ALL posts including drafts
create policy "Authenticated can read all posts"
  on public.posts
  for select
  to authenticated
  using (true);

create policy "Authenticated can insert posts"
  on public.posts
  for insert
  to authenticated
  with check (true);

create policy "Authenticated can update posts"
  on public.posts
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can delete posts"
  on public.posts
  for delete
  to authenticated
  using (true);


-- ── 6. STORAGE BUCKETS ───────────────────────────────────────────────────────
--
-- Creates a public "portfolio-images" bucket for project cover images.
-- Files uploaded here are served via:
--   https://<project>.supabase.co/storage/v1/object/public/portfolio-images/<path>
--
-- NOTE: Storage bucket creation via SQL requires the storage schema.
-- If this fails, create the bucket manually in:
--   Dashboard → Storage → New bucket → Name: "portfolio-images" → Public: ON

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-images',
  'portfolio-images',
  true,                        -- public bucket — URLs are accessible without auth
  5242880,                     -- 5 MB per file limit
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
on conflict (id) do nothing;   -- idempotent — safe to re-run

-- Storage RLS: anyone can view public images
create policy "Public can view portfolio images"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'portfolio-images');

-- Only authenticated users can upload
create policy "Authenticated can upload portfolio images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'portfolio-images');

-- Only authenticated users can update (replace) images
create policy "Authenticated can update portfolio images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'portfolio-images');

-- Only authenticated users can delete images
create policy "Authenticated can delete portfolio images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'portfolio-images');


-- ── 7. SEED DATA (optional) ───────────────────────────────────────────────────
-- Remove or comment out this entire section if you don't want sample data.

-- experiences
insert into public.experiences
  (company, role, description, start_date, end_date, is_current, location, company_url, tags)
values
  (
    'Acme Corp',
    'Senior Software Engineer',
    'Led full-stack development of the core SaaS product. Scaled the REST API from 10k to 1M requests per day, reduced p95 latency by 60%, and mentored three junior engineers through code review and pair programming.',
    '2023-01-15',
    null,
    true,
    'San Francisco, CA',
    'https://acme.example.com',
    array['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'PostgreSQL']
  ),
  (
    'Startup XYZ',
    'Software Engineer',
    'Built the consumer-facing React application and internal analytics dashboard from scratch. Implemented a real-time notification system using Supabase Realtime and reduced time-to-interactive by 40% through code splitting.',
    '2021-03-01',
    '2022-12-31',
    false,
    'Remote',
    'https://startupxyz.example.com',
    array['React', 'Node.js', 'PostgreSQL', 'Redis', 'Docker']
  ),
  (
    'Agency Co',
    'Frontend Developer',
    'Delivered pixel-perfect implementations for 12 client projects across e-commerce, fintech, and media verticals. Introduced component-driven development with Storybook, cutting design-to-code time by 30%.',
    '2019-06-01',
    '2021-02-28',
    false,
    'New York, NY',
    null,
    array['React', 'Vue.js', 'SCSS', 'Figma', 'Webpack']
  )
on conflict do nothing;


-- projects
insert into public.projects
  (slug, title, description, url, repo_url, image_url, tags, featured, year)
values
  (
    'project-alpha',
    'Project Alpha',
    'A clean, opinionated SaaS dashboard built with Next.js App Router and Supabase. Features real-time data, row-level security, and a fully type-safe API layer generated from the database schema.',
    'https://alpha.example.com',
    'https://github.com/you/project-alpha',
    null,
    array['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],
    true,
    '2024'
  ),
  (
    'open-source-cli',
    'Open Source CLI',
    'A fast developer CLI tool for scaffolding opinionated project structures. Reached 2,000+ GitHub stars in three months. Written in Rust for sub-10ms startup time.',
    null,
    'https://github.com/you/cli-tool',
    null,
    array['Rust', 'CLI', 'Open Source'],
    true,
    '2023'
  ),
  (
    'design-system',
    'Design System',
    'An internal component library built on Radix UI primitives with full Storybook documentation. Adopted across four product teams, reducing UI inconsistency bugs by 80%.',
    null,
    'https://github.com/you/design-system',
    null,
    array['React', 'TypeScript', 'Storybook', 'Radix UI'],
    false,
    '2022'
  ),
  (
    'api-library',
    'API Client Library',
    'A typed TypeScript SDK for a popular third-party API. Handles authentication, retries with exponential back-off, and rate limiting transparently. Downloaded 50k+ times on npm.',
    'https://npmjs.com/package/your-sdk',
    'https://github.com/you/api-sdk',
    null,
    array['TypeScript', 'Node.js', 'npm'],
    false,
    '2022'
  )
on conflict (slug) do nothing;


-- posts
insert into public.posts
  (slug, title, excerpt, content, tags, published, published_at, reading_time)
values
  (
    'building-personal-cms-nextjs-supabase',
    'Building a personal CMS with Next.js and Supabase',
    'How I built the content management backend for this portfolio — covering Server Actions, Row Level Security, and the admin dashboard architecture.',
    E'# Building a personal CMS with Next.js and Supabase\n\nWhen I decided to rebuild my portfolio, I had one core requirement: I wanted to manage all my content — blog posts, projects, work experience — from a clean admin interface, without paying for a third-party CMS.\n\n## The Architecture\n\nThe solution I landed on uses:\n- **Next.js 14 App Router** for both the public site and the admin dashboard\n- **Supabase** for the database, auth, and file storage\n- **Server Actions** for all mutations (create, update, delete)\n\n## Row Level Security\n\nThe key insight is that Supabase''s Row Level Security does the heavy lifting. Public visitors can only read published posts. The admin account can read and write everything.\n\n```sql\ncreate policy "Public can read published posts"\n  on public.posts for select to anon\n  using (published = true);\n```\n\n## Server Actions\n\nServer Actions make the CRUD layer almost trivial. A create action looks like:\n\n```typescript\nasync function createPost(data: PostInput) {\n  "use server";\n  const supabase = createClient();\n  const { error } = await supabase.from("posts").insert(data);\n  if (error) throw new Error(error.message);\n  revalidatePath("/blog");\n}\n```\n\nThe `revalidatePath` call invalidates the Next.js cache so the public blog page reflects the change immediately.\n\n## What I Learned\n\nThe biggest gotcha was session management across Server Components and the Edge Runtime (middleware). The `@supabase/ssr` package handles this correctly by reading and writing cookies on both the request and response objects.',
    array['Next.js', 'Supabase', 'TypeScript', 'Architecture'],
    true,
    '2024-04-10 09:00:00+00',
    9
  ),
  (
    'case-for-typed-routes-nextjs-14',
    'The case for typed routes in Next.js 14',
    'Why I enable the typedRoutes experimental flag in every project now, and how it catches an entire class of bugs at compile time.',
    E'# The case for typed routes in Next.js 14\n\nOne of the most underrated features in Next.js 14 is the `typedRoutes` experimental flag. Enable it with one line in `next.config.ts`:\n\n```typescript\nexperimental: { typedRoutes: true }\n```\n\nOnce enabled, every `<Link href="...">`, `useRouter().push(...)`, and `redirect(...)` call becomes type-checked against your actual file system routes.\n\n## The Problem It Solves\n\nWithout typed routes, you can ship broken links silently:\n\n```typescript\n// This compiles fine but 404s at runtime\n<Link href="/experiance">Experience</Link>\n//             ↑ typo\n```\n\nWith typed routes enabled, that line becomes a compile error. The DX is similar to tRPC for API calls — your editor tells you immediately when a route doesn''t exist.\n\n## The Tradeoff\n\nThe only cost is a slightly slower initial build as Next.js generates the route type manifest. On a project with ~30 routes, this adds roughly 2 seconds to `next build`. Worth it.',
    array['Next.js', 'TypeScript', 'DX'],
    true,
    '2024-03-22 09:00:00+00',
    5
  ),
  (
    'rls-patterns-multi-tenant',
    'Row Level Security patterns for multi-tenant apps',
    'A deep-dive into Supabase RLS policies for SaaS products — covering per-org isolation, admin bypass patterns, and testing strategies.',
    E'# Row Level Security patterns for multi-tenant apps\n\nRow Level Security is Supabase''s superpower for multi-tenant applications. Done right, it means you literally cannot accidentally serve one tenant''s data to another — the database enforces the boundary, not your application code.\n\n## The Core Pattern\n\nEvery table that contains tenant-scoped data gets an `org_id` column and a policy:\n\n```sql\ncreate policy "Users see only their org data"\n  on public.items\n  for select\n  to authenticated\n  using (\n    org_id = (auth.jwt() ->> ''org_id'')::uuid\n  );\n```\n\nThe `auth.jwt()` function returns the current user''s JWT payload. You can embed any claim you need — including `org_id` — using Supabase Auth hooks.\n\n## Admin Bypass\n\nFor an admin dashboard that needs to see all data, use the service role key server-side (never expose it to the client) and it bypasses RLS entirely:\n\n```typescript\nconst supabase = createClient(\n  process.env.SUPABASE_URL,\n  process.env.SUPABASE_SERVICE_KEY // bypasses RLS\n);\n```\n\n## Testing Policies\n\nAlways test policies by impersonating different roles in the SQL editor:\n\n```sql\nset role anon;\nselect * from posts; -- should only see published rows\nreset role;\n```',
    array['Supabase', 'PostgreSQL', 'Security', 'SaaS'],
    true,
    '2024-02-05 09:00:00+00',
    12
  ),
  (
    'thoughts-on-server-components',
    'Thoughts on React Server Components after 6 months',
    'My honest assessment of React Server Components in production — what works, what doesn''t, and the mental model shift required.',
    E'# Draft content — publish when ready\n\nThis post is still being written.',
    array['React', 'Next.js', 'Architecture'],
    false,
    null,
    1
  )
on conflict (slug) do nothing;


-- ── VERIFICATION QUERIES ──────────────────────────────────────────────────────
-- Run these after setup to confirm everything looks correct:
--
--   select count(*) from public.experiences;   -- expect 3
--   select count(*) from public.projects;      -- expect 4
--   select count(*) from public.posts;         -- expect 4 (3 published, 1 draft)
--
--   -- Confirm RLS is on
--   select tablename, rowsecurity
--   from pg_tables
--   where schemaname = 'public'
--   and tablename in ('experiences', 'projects', 'posts');
--
--   -- List all policies
--   select tablename, policyname, cmd, roles
--   from pg_policies
--   where schemaname = 'public'
--   order by tablename, policyname;
-- ============================================================================
