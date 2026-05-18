
# Foundation Overhaul — Auth, Persistence, Signatures, Audits, Notifications

This replaces the in-memory mock layer with a real backend while preserving the existing UI, design system, and service-interface architecture. Mock adapters stay for tests; runtime switches to Cloud adapters.

## 1. Lovable Cloud + Authentication

- Enable Lovable Cloud (provisions Postgres, Auth, Storage, Edge Functions).
- Auth methods: email/password, Google OAuth, plus invite-only flow (admin creates user via edge function; user sets password on first login).
- `/auth` page (sign-in + sign-up tabs, Google button).
- `/reset-password` page (required for password reset flow).
- `AuthProvider` with `onAuthStateChange` listener set up **before** `getSession()`.
- All app routes wrapped in `<RequireAuth>`; `/auth` and `/reset-password` are public.
- `emailRedirectTo: window.location.origin` on every signup.

## 2. Roles & Profiles (minimal)

Following the project's security rule — roles live in a dedicated table, never on profiles.

```sql
create type app_role as enum (
  'rmq',              -- super-admin
  'top_management',
  'process_owner',
  'auditor_internal',
  'auditor_external', -- read-only scoped
  'contributor'
);

create table profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text not null,
  job_title text,
  organization_id uuid references organizations,
  created_at timestamptz default now()
);

create table user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  role app_role not null,
  scope_process_id uuid,   -- optional: scoped to one process
  unique (user_id, role, scope_process_id)
);

-- SECURITY DEFINER function to avoid RLS recursion
create function has_role(_user_id uuid, _role app_role) returns boolean ...
create function is_rmq(_user_id uuid) returns boolean ...
```

- Trigger on `auth.users` insert → auto-create `profiles` row.
- First user in an org auto-gets `rmq` role.

## 3. Persistence Layer — Database Schema

Tables (all with `tenant_id`, `created_at`, `updated_at`, `created_by`, `archived_at`, RLS enabled):

| Table | Purpose |
|---|---|
| `organizations` | Multi-tenant root |
| `processes` | Process register |
| `process_activities` | Sequenced activities incl. immutable governance |
| `risks` | Risk register with 3×3 matrix |
| `risk_evaluations` | Append-only versions |
| `actions` | Action plans (universal improvement object) |
| `kpis` | KPI definitions (immutable config) |
| `kpi_values` | Append-only measurements |
| `documents` | Procedures, forms, instructions |
| `document_versions` | Versioned binaries in Storage |
| `iso_clauses` | Reference data (seeded) |
| `process_clause_links` | Fulfillment mapping |
| `signatures` | E-signature audit trail |
| `audit_log` | Append-only system audit |
| `notifications` | In-app inbox items |
| `audits` | Internal audit plans |
| `audit_checklist_items` | Checklist per audit |
| `audit_findings` | NCs, observations, OFIs |
| `audit_evidence` | Evidence file refs |

### RLS strategy
- `tenant_id = current_org()` for all reads.
- Writes gated by `has_role()` per entity (e.g., only `process_owner` of that process or `rmq` can edit a process).
- External auditors get `SELECT`-only policies scoped via `user_roles.scope_process_id`.

### Service-adapter refactor
- Existing `*Service` interfaces in `src/domains/*` keep their contracts.
- Add `src/integrations/cloud/adapters/*.ts` implementing each interface against Supabase client.
- `src/services/index.ts` switches the default export from mock → cloud adapter behind a `USE_CLOUD` flag (default true).

## 4. E-Signature Workflow

When a record requires approval (per existing `recordTemplate.approval` metadata):

```sql
create table signatures (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null,
  entity_type text not null,        -- 'action' | 'document' | 'audit_finding' | ...
  entity_id uuid not null,
  entity_version int not null,      -- snapshot version signed
  signer_id uuid references auth.users not null,
  signer_role app_role not null,
  signer_display_name text not null,
  signed_at timestamptz default now() not null,
  intent text not null,             -- 'approve' | 'review' | 'reject'
  comment text,
  payload_hash text not null,       -- SHA-256 of entity snapshot
  ip_address inet,
  user_agent text
);
```

- Edge function `sign-record`: validates user has required role, hashes the canonical JSON of the entity at the current version, inserts the signature, writes to `audit_log`, marks entity `approved_at`.
- UI: `<SignaturePad>` dialog — re-enters password OR types full name + ticks affirmation, shows hash preview, posts to function.
- Signed records become immutable for that version; further edits create a new version requiring re-signature.
- Surfaces in: Action plans (approval-required), Documents (release/approval), Audit findings (closure), Management Review minutes.

## 5. Internal Audit Module

New top-level module at `/audits`.

- **Audit Plan**: scope (processes + ISO clauses), period, lead auditor, team, dates.
- **Checklist**: auto-generated from selected clauses (pulls from `iso9001-guidance`); editable.
- **Conduct**: per-item result (Conform / Minor NC / Major NC / OFI / Observation), evidence (file upload via Storage), notes.
- **Findings**: auto-spawned from non-conform checklist items; converts to `actions` with `source = 'internal_audit'` and back-link.
- **Follow-up**: re-audit cycle; finding closure requires e-signature from auditor + process owner.
- **Report**: printable view (existing print-friendly pattern); future PDF export hook.

## 6. Notifications + In-App Inbox

```sql
create table notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  tenant_id uuid not null,
  kind text not null,              -- 'action_due' | 'review_due' | 'audit_scheduled' | 'signature_requested' | 'kpi_failed'
  title text not null,
  body text,
  entity_type text,
  entity_id uuid,
  read_at timestamptz,
  created_at timestamptz default now()
);
```

- Edge function `dispatch-notifications` runs on cron (pg_cron, hourly):
  - Actions with `due_date <= now() + 7d` and no recent notification.
  - Management reviews / KPI reviews due.
  - Scheduled audits starting within 14 days.
  - KPI value below target → notify process owner.
- UI: bell icon in header with unread badge; `<InboxPanel>` slide-out grouped by kind, with deep links to records.
- Mark-as-read on click; mark-all-read action.
- Email delivery is a Phase 2 follow-up (the table + dispatcher are ready for it).

## 7. Onboarding Wizard

Triggered on first login when org is empty:

1. **Profile** — confirm name + job title.
2. **Organization** — name, sector, country.
3. **Standard** — ISO 9001 (only option for now; UI ready for more).
4. **Scope** — text (the QMS scope statement).
5. **First Process** — minimal creation (name + typology + owner).
6. **Done** — lands on Dashboard.

## 8. UI & Routing Changes

- Header: replaces user-icon explanation with real **profile menu** (display name, role pill, settings, sign out) + notifications bell.
- `<RequireAuth>` + `<RequireRole roles={[...]}>` guards.
- "Approve" / "Sign" buttons render based on role + record state.
- Empty-state copy across list views ("No processes yet — Create your first") replaces seeded demo data.
- All entity reads scroll-reset (existing pattern preserved).

## 9. Files Touched (approx.)

- **New**: ~12 migration SQL blocks, 4 edge functions (`sign-record`, `dispatch-notifications`, `invite-user`, `auth-helpers`), `AuthProvider`, `RequireAuth`, `RequireRole`, `/auth` + `/reset-password` pages, `OnboardingWizard`, `SignaturePad`, `InboxPanel`, `NotificationsBell`, `AuditList`, `AuditDetail`, `AuditChecklist`, `FindingCard`, ~12 cloud adapters in `src/integrations/cloud/adapters/`.
- **Edited**: `src/App.tsx` (routing + providers), `src/components/layout/Header.tsx` (profile menu + bell), `src/services/index.ts` (adapter switch), each existing service interface caller (typed-safe — most won't need changes thanks to the abstract interface).

## 10. Out of Scope (deliberately, to keep this shippable)

- Email delivery of notifications (table ready; cron hook ready; SMTP wiring later).
- PDF report exports.
- i18n.
- Test suite.
- Document file viewer/preview (uploads work; preview is link-only for now).

---

After your approval I will: enable Cloud → apply migrations → write edge functions → build auth + onboarding → swap service adapters → build signatures, audits, inbox in that order, then verify with a build check.
