# Portfolio Architecture Overview

## Folder Structure

```
portfolio/
├── app/
│   ├── (public)/                     # Route group — no layout prefix
│   │   ├── layout.tsx                # Public layout (Navbar + Footer)
│   │   ├── page.tsx                  # / → Home (Hero + About snippet)
│   │   ├── experience/
│   │   │   └── page.tsx              # /experience → Timeline
│   │   ├── work/
│   │   │   └── page.tsx              # /work → Projects grid
│   │   ├── blog/
│   │   │   ├── page.tsx              # /blog → Articles list
│   │   │   └── [slug]/
│   │   │       └── page.tsx          # /blog/:slug → Article detail
│   │   └── contact/
│   │       └── page.tsx              # /contact → Contact form
│   ├── admin/
│   │   ├── login/
│   │   │   └── page.tsx              # /admin/login → Auth form
│   │   └── dashboard/
│   │       ├── layout.tsx            # Admin shell (sidebar + topbar)
│   │       ├── page.tsx              # /admin/dashboard → Overview
│   │       ├── experience/
│   │       │   └── page.tsx          # CRUD — experiences
│   │       ├── work/
│   │       │   └── page.tsx          # CRUD — projects
│   │       └── blog/
│   │           └── page.tsx          # CRUD — posts
│   ├── api/
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts          # Supabase Auth OAuth callback
│   ├── globals.css                   # Tailwind directives + CSS vars
│   └── layout.tsx                    # Root layout (ThemeProvider)
│
├── components/
│   ├── Navbar.tsx                    # ← Provided below
│   ├── Footer.tsx
│   ├── ThemeToggle.tsx               # ← Provided below
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   └── Card.tsx
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   └── ContactForm.tsx
│   └── admin/
│       ├── Sidebar.tsx
│       └── DataTable.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Browser Supabase client
│   │   └── server.ts                 # Server Supabase client (RSC)
│   ├── types.ts                      # Shared TypeScript types
│   └── utils.ts                      # cn() helper + misc utilities
│
├── hooks/
│   └── useSupabase.ts                # Client-side auth hook
│
├── middleware.ts                     # ← Provided below (route guard)
├── tailwind.config.ts                # ← Provided below
├── next.config.ts
└── .env.local                        # SUPABASE_URL, SUPABASE_ANON_KEY
```
