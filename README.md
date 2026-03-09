# Skynet — AIRMAN Academy EPR System

A mini Electronic Progress & Performance Record (EPR) web application for Flight Training Organisations. Built as a full-stack assessment project demonstrating data modelling, REST API design, and a polished React UI.

---

## What Is Implemented

### Level 1 — Core EPR App (Complete)

- **Data Model & Migrations** — PostgreSQL tables for `users`, `courses`, `enrollments`, and `epr_records` with enums, foreign keys, CHECK constraints, and indexes. Auto-updating `updated_at` triggers.
- **Backend APIs** (Supabase Edge Functions)
  - `GET /api/people` — List people with optional `role` and `search` filters. Returns enrollment info for students and EPR-written count for instructors.
  - `GET /api/epr?personId=` — List all EPR records for a person, ordered by period descending.
  - `GET /api/epr?id=` — Single EPR detail view.
  - `POST /api/epr` — Create a new EPR with server-side validation (ratings 1–5, date logic, FK existence).
  - `PATCH /api/epr?id=` — Update ratings, remarks, and status.
- **Frontend UI**
  - People Directory — left sidebar with Students/Instructors toggle tabs and search input.
  - Person Detail pane — name, role badge, course info, enrollment status.
  - EPR list with period labels, star ratings, and status badges.
  - EPR detail/edit modal with rating sliders, remarks textarea, status dropdown, and save.
  - "New EPR" button to create records via form.
  - Loading skeleton states and toast error handling.
  - Fully responsive mobile layout with slide-out sidebar.

### Level 2 — Advanced Features (All Three Completed)

- **Option A: Progress Summary & Analytics**
  - `GET /api/epr/summary?personId=` — Returns average ratings, EPR count, and last 3 periods.
  - Frontend Performance Dashboard with gauge cards, radar chart, donut pie chart, and area trend chart (Recharts).

- **Option B: Role-Based UX**
  - Supabase Row-Level Security (RLS) policies enforce access control at the database level.
  - Students can only view their own EPRs (read-only). Instructors/Admins can create and edit EPRs.
  - Auth flow with email/password sign-in and sign-up with role selection.
  - Frontend guards hide the "New EPR" button and directory for students.

- **Option C: AI Assistant Stub**
  - `POST /api/epr/assist` — Rule-based endpoint that generates suggested remarks based on ratings.
  - "AI Suggest" button in the EPR form auto-fills the remarks textarea.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Recharts |
| Backend | Supabase Edge Functions (Deno runtime) |
| Database | PostgreSQL (Supabase hosted) |
| Auth | Supabase Auth (email/password) |
| State Management | TanStack React Query |
| Routing | React Router v6 |

---

## Project Structure

```
src/
├── components/         # UI components
│   ├── PersonList.tsx       # People directory list
│   ├── PersonDetails.tsx    # Selected person info card
│   ├── EPRList.tsx          # EPR records list
│   ├── EPRModal.tsx         # EPR create/edit modal (includes AI Suggest)
│   ├── PerformanceSummary.tsx  # Analytics dashboard (Level 2A)
│   └── ui/                  # shadcn/ui primitives
├── hooks/
│   ├── use-auth.ts          # Auth state & session management
│   └── use-people.ts        # React Query hooks for API calls
├── integrations/supabase/
│   ├── client.ts            # Supabase client setup
│   └── types.ts             # Auto-generated DB types
├── lib/
│   ├── api.ts               # All API call functions
│   └── utils.ts             # Utility helpers
├── pages/
│   ├── Auth.tsx             # Login / Sign-up page
│   ├── Index.tsx            # Main app layout (directory + detail)
│   └── NotFound.tsx         # 404 page
└── App.tsx                  # Root component with routing

supabase/
├── migrations/              # SQL migration files
│   ├── 20260308041747_*.sql     # Schema: tables, indexes, triggers, initial RLS
│   └── 20260308073311_*.sql     # Auth integration, role-based RLS policies
└── functions/               # Edge Functions (backend API)
    ├── api-people/              # GET /api/people
    ├── api-epr/                 # GET/POST/PATCH /api/epr
    ├── api-epr-summary/         # GET /api/epr/summary (Level 2A)
    └── api-epr-assist/          # POST /api/epr/assist (Level 2C)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project (free tier works)

### 1. Clone & Install

```bash
git clone <repo-url>
cd Skynet
npm install
```

### 2. Supabase Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** and run the two migration files in order:
   - `supabase/migrations/20260308041747_*.sql` — Creates all tables, indexes, enums, triggers, and initial policies.
   - `supabase/migrations/20260308073311_*.sql` — Adds auth integration, role-based RLS policies.
3. Copy your project's **URL** and **anon/public key** from **Settings → API**.

### 3. Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

### 4. Deploy Edge Functions

Install the Supabase CLI and deploy the backend functions:

```bash
npx supabase login
npx supabase link --project-ref your-project-id
npx supabase functions deploy api-people
npx supabase functions deploy api-epr
npx supabase functions deploy api-epr-summary
npx supabase functions deploy api-epr-assist
```

### 5. Seed Data (Optional)

Insert sample data via the Supabase SQL Editor:

```sql
-- Instructors
INSERT INTO public.users (name, email, role) VALUES
  ('Capt. Sarah Mitchell', 'sarah@airman.academy', 'instructor'),
  ('Capt. James Okonkwo', 'james@airman.academy', 'instructor'),
  ('Maj. Elena Vasquez', 'elena@airman.academy', 'instructor');

-- Admin
INSERT INTO public.users (name, email, role) VALUES
  ('Admin User', 'admin@airman.academy', 'admin');

-- Students
INSERT INTO public.users (name, email, role) VALUES
  ('Alex Turner', 'alex@student.airman', 'student'),
  ('Priya Sharma', 'priya@student.airman', 'student'),
  ('Liam Chen', 'liam@student.airman', 'student'),
  ('Fatou Diallo', 'fatou@student.airman', 'student'),
  ('Noah Kim', 'noah@student.airman', 'student'),
  ('Isabella Rossi', 'isabella@student.airman', 'student'),
  ('Ethan Brooks', 'ethan@student.airman', 'student'),
  ('Sofia Andersen', 'sofia@student.airman', 'student');

-- Courses
INSERT INTO public.courses (name, license_type, total_required_hours) VALUES
  ('PPL Course', 'PPL', 45),
  ('CPL Integrated', 'CPL', 200);

-- Enrollments (link students to courses)
INSERT INTO public.enrollments (student_id, course_id, status)
SELECT u.id, c.id, 'active'
FROM public.users u, public.courses c
WHERE u.role = 'student' AND c.name = 'PPL Course'
LIMIT 4;

INSERT INTO public.enrollments (student_id, course_id, status)
SELECT u.id, c.id, 'active'
FROM public.users u, public.courses c
WHERE u.role = 'student' AND c.name = 'CPL Integrated'
  AND u.id NOT IN (SELECT student_id FROM public.enrollments)
LIMIT 4;

-- Sample EPR records
INSERT INTO public.epr_records (person_id, evaluator_id, role_type, period_start, period_end, overall_rating, technical_skills_rating, non_technical_skills_rating, remarks, status)
SELECT
  s.id, i.id, 'student',
  '2025-01-01', '2025-03-31',
  4, 4, 3,
  'Shows solid progress in core manoeuvres. CRM skills developing well.',
  'submitted'
FROM public.users s, public.users i
WHERE s.role = 'student' AND i.role = 'instructor'
LIMIT 1;

INSERT INTO public.epr_records (person_id, evaluator_id, role_type, period_start, period_end, overall_rating, technical_skills_rating, non_technical_skills_rating, remarks, status)
SELECT
  s.id, i.id, 'student',
  '2025-04-01', '2025-06-30',
  5, 5, 4,
  'Excellent progress. Ready for solo flight assessment.',
  'submitted'
FROM public.users s, public.users i
WHERE s.role = 'student' AND i.role = 'instructor'
LIMIT 1;
```

### 6. Run the App

```bash
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser. Sign up with an email and role to get started.

### Other Commands

```bash
npm run build      # Production build
npm run lint       # ESLint check
npm run test       # Run tests
```

---

## How I Used AI in This Project

- **GitHub Copilot / ChatGPT** — Used for scaffolding boilerplate (shadcn/ui component setup, Supabase Edge Function templates), drafting SQL migration scripts, and generating seed data queries.
- **AI-assisted debugging** — Used to troubleshoot Supabase RLS policy configurations and Edge Function CORS headers.
- **Code review** — All AI-generated code was reviewed, tested, and adapted to fit the project's architecture and requirements.
- **Documentation** — AI helped draft parts of this README.

All code was understood, reviewed, and validated before inclusion.