
-- ============= ENUMS =============
create type public.app_role as enum (
  'rmq', 'top_management', 'process_owner',
  'auditor_internal', 'auditor_external', 'contributor'
);

create type public.audit_status as enum (
  'planned', 'in_progress', 'reporting', 'closed', 'cancelled'
);

create type public.finding_type as enum (
  'major_nc', 'minor_nc', 'observation', 'ofi', 'conformity'
);

create type public.finding_status as enum (
  'open', 'action_in_progress', 'awaiting_verification', 'closed'
);

create type public.checklist_result as enum (
  'pending', 'conform', 'minor_nc', 'major_nc', 'observation', 'ofi', 'na'
);

create type public.notification_kind as enum (
  'action_due', 'review_due', 'audit_scheduled', 'audit_starting',
  'signature_requested', 'kpi_failed', 'finding_assigned', 'mention'
);

create type public.signature_intent as enum (
  'approve', 'reject', 'review', 'release', 'witness'
);

-- ============= ORGANIZATIONS =============
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sector text,
  country text,
  scope_statement text,
  standard_code text default 'ISO9001',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.organizations enable row level security;

-- ============= PROFILES =============
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text not null,
  job_title text,
  organization_id uuid references public.organizations on delete set null,
  onboarded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- ============= USER ROLES =============
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  organization_id uuid not null references public.organizations on delete cascade,
  role public.app_role not null,
  scope_process_id uuid,
  granted_at timestamptz not null default now(),
  granted_by uuid references auth.users,
  unique (user_id, organization_id, role, scope_process_id)
);
alter table public.user_roles enable row level security;
create index on public.user_roles(user_id);
create index on public.user_roles(organization_id);

-- ============= SECURITY HELPERS =============
create or replace function public.current_org()
returns uuid language sql stable security definer set search_path = public as $$
  select organization_id from public.profiles where id = auth.uid()
$$;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.user_roles
    where user_id = _user_id and role = _role
      and organization_id = public.current_org())
$$;

create or replace function public.is_rmq(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role(_user_id, 'rmq')
$$;

create or replace function public.is_org_member(_user_id uuid, _org uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = _user_id and organization_id = _org)
$$;

-- ============= AUTO-CREATE PROFILE ON SIGNUP =============
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', new.email));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============= UPDATED_AT TRIGGER =============
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger touch_organizations before update on public.organizations
  for each row execute function public.touch_updated_at();
create trigger touch_profiles before update on public.profiles
  for each row execute function public.touch_updated_at();

-- ============= CORE QMS ENTITIES =============
create table public.processes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations on delete cascade,
  reference_code text,
  name text not null,
  typology text,
  description text,
  owner_user_id uuid references auth.users,
  scope text,
  archived_at timestamptz,
  created_by uuid references auth.users,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.processes enable row level security;
create index on public.processes(organization_id);
create trigger touch_processes before update on public.processes
  for each row execute function public.touch_updated_at();

create table public.risks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations on delete cascade,
  process_id uuid references public.processes on delete set null,
  reference_code text,
  title text not null,
  description text,
  probability smallint not null default 1 check (probability between 1 and 3),
  severity smallint not null default 1 check (severity between 1 and 3),
  priority text,
  status text default 'open',
  archived_at timestamptz,
  created_by uuid references auth.users,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.risks enable row level security;
create trigger touch_risks before update on public.risks
  for each row execute function public.touch_updated_at();

create table public.actions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations on delete cascade,
  process_id uuid references public.processes on delete set null,
  source_type text,           -- 'risk' | 'kpi' | 'internal_audit' | 'finding' | ...
  source_id uuid,
  reference_code text,
  title text not null,
  description text,
  assignee_user_id uuid references auth.users,
  due_date date,
  status text default 'open',
  effectiveness text,
  closed_at timestamptz,
  requires_signature boolean default false,
  approved_at timestamptz,
  archived_at timestamptz,
  created_by uuid references auth.users,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.actions enable row level security;
create index on public.actions(organization_id, due_date);
create trigger touch_actions before update on public.actions
  for each row execute function public.touch_updated_at();

create table public.kpis (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations on delete cascade,
  process_id uuid references public.processes on delete set null,
  reference_code text,
  name text not null,
  unit text,
  target_value numeric,
  comparator text default '>=',     -- '>=' | '<=' | '=='
  frequency text default 'monthly',
  archived_at timestamptz,
  created_by uuid references auth.users,
  created_at timestamptz not null default now()
);
alter table public.kpis enable row level security;

-- Append-only KPI values
create table public.kpi_values (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations on delete cascade,
  kpi_id uuid not null references public.kpis on delete cascade,
  period_label text not null,
  value numeric not null,
  passed boolean,
  recorded_by uuid references auth.users,
  recorded_at timestamptz not null default now()
);
alter table public.kpi_values enable row level security;

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations on delete cascade,
  reference_code text,
  title text not null,
  doc_type text,
  current_version int default 1,
  storage_path text,
  approved_at timestamptz,
  archived_at timestamptz,
  created_by uuid references auth.users,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.documents enable row level security;
create trigger touch_documents before update on public.documents
  for each row execute function public.touch_updated_at();

-- ============= INTERNAL AUDITS =============
create table public.audits (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations on delete cascade,
  reference_code text,
  title text not null,
  scope_description text,
  scope_process_ids uuid[] default '{}',
  scope_clause_codes text[] default '{}',
  lead_auditor_id uuid references auth.users,
  team_user_ids uuid[] default '{}',
  planned_start date,
  planned_end date,
  actual_start date,
  actual_end date,
  status public.audit_status not null default 'planned',
  summary text,
  archived_at timestamptz,
  created_by uuid references auth.users,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.audits enable row level security;
create trigger touch_audits before update on public.audits
  for each row execute function public.touch_updated_at();

create table public.audit_checklist_items (
  id uuid primary key default gen_random_uuid(),
  audit_id uuid not null references public.audits on delete cascade,
  organization_id uuid not null references public.organizations on delete cascade,
  sequence int not null default 0,
  clause_code text,
  question text not null,
  expected_evidence text,
  result public.checklist_result not null default 'pending',
  notes text,
  process_id uuid references public.processes on delete set null,
  checked_by uuid references auth.users,
  checked_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.audit_checklist_items enable row level security;
create index on public.audit_checklist_items(audit_id);

create table public.audit_findings (
  id uuid primary key default gen_random_uuid(),
  audit_id uuid not null references public.audits on delete cascade,
  organization_id uuid not null references public.organizations on delete cascade,
  checklist_item_id uuid references public.audit_checklist_items on delete set null,
  reference_code text,
  finding_type public.finding_type not null,
  process_id uuid references public.processes on delete set null,
  clause_code text,
  statement text not null,
  evidence text,
  root_cause text,
  status public.finding_status not null default 'open',
  action_id uuid references public.actions on delete set null,
  closed_at timestamptz,
  created_by uuid references auth.users,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.audit_findings enable row level security;
create index on public.audit_findings(audit_id);
create trigger touch_findings before update on public.audit_findings
  for each row execute function public.touch_updated_at();

create table public.audit_evidence (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations on delete cascade,
  audit_id uuid references public.audits on delete cascade,
  finding_id uuid references public.audit_findings on delete cascade,
  checklist_item_id uuid references public.audit_checklist_items on delete cascade,
  label text not null,
  storage_path text,
  external_url text,
  uploaded_by uuid references auth.users,
  uploaded_at timestamptz not null default now()
);
alter table public.audit_evidence enable row level security;

-- ============= SIGNATURES (append-only) =============
create table public.signatures (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations on delete cascade,
  entity_type text not null,
  entity_id uuid not null,
  entity_version int not null default 1,
  signer_id uuid not null references auth.users,
  signer_role public.app_role not null,
  signer_display_name text not null,
  intent public.signature_intent not null,
  comment text,
  payload_hash text not null,
  ip_address inet,
  user_agent text,
  signed_at timestamptz not null default now()
);
alter table public.signatures enable row level security;
create index on public.signatures(entity_type, entity_id);

-- ============= NOTIFICATIONS =============
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  organization_id uuid not null references public.organizations on delete cascade,
  kind public.notification_kind not null,
  title text not null,
  body text,
  entity_type text,
  entity_id uuid,
  link_path text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.notifications enable row level security;
create index on public.notifications(user_id, read_at);

-- ============= AUDIT LOG (append-only) =============
create table public.audit_log (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations on delete set null,
  actor_id uuid references auth.users,
  action text not null,
  entity_type text,
  entity_id uuid,
  payload jsonb,
  ip_address inet,
  created_at timestamptz not null default now()
);
alter table public.audit_log enable row level security;
create index on public.audit_log(organization_id, created_at desc);

-- ============= RLS POLICIES =============

-- Organizations: members can read, RMQ can update
create policy "members read org" on public.organizations
  for select to authenticated using (id = public.current_org());
create policy "rmq update org" on public.organizations
  for update to authenticated using (id = public.current_org() and public.is_rmq(auth.uid()));
create policy "authenticated create org" on public.organizations
  for insert to authenticated with check (true);

-- Profiles
create policy "read own and org profiles" on public.profiles
  for select to authenticated
  using (id = auth.uid() or organization_id = public.current_org());
create policy "update own profile" on public.profiles
  for update to authenticated using (id = auth.uid());
create policy "rmq update org profiles" on public.profiles
  for update to authenticated
  using (organization_id = public.current_org() and public.is_rmq(auth.uid()));

-- User roles
create policy "read roles in org" on public.user_roles
  for select to authenticated using (organization_id = public.current_org());
create policy "rmq manage roles" on public.user_roles
  for all to authenticated
  using (organization_id = public.current_org() and public.is_rmq(auth.uid()))
  with check (organization_id = public.current_org() and public.is_rmq(auth.uid()));
create policy "self grant first rmq" on public.user_roles
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and role = 'rmq'
    and not exists(select 1 from public.user_roles ur where ur.organization_id = user_roles.organization_id)
  );

-- Generic helper: tenant-scoped CRUD for org members
-- Processes
create policy "org read processes" on public.processes
  for select to authenticated using (organization_id = public.current_org());
create policy "org write processes" on public.processes
  for insert to authenticated with check (organization_id = public.current_org());
create policy "owner or rmq update processes" on public.processes
  for update to authenticated
  using (organization_id = public.current_org()
    and (owner_user_id = auth.uid() or public.is_rmq(auth.uid()) or public.has_role(auth.uid(), 'top_management')));
create policy "rmq delete processes" on public.processes
  for delete to authenticated
  using (organization_id = public.current_org() and public.is_rmq(auth.uid()));

-- Risks / Actions / KPIs / Documents share same simple pattern
create policy "org read risks" on public.risks for select to authenticated using (organization_id = public.current_org());
create policy "org write risks" on public.risks for insert to authenticated with check (organization_id = public.current_org());
create policy "org update risks" on public.risks for update to authenticated using (organization_id = public.current_org());

create policy "org read actions" on public.actions for select to authenticated using (organization_id = public.current_org());
create policy "org write actions" on public.actions for insert to authenticated with check (organization_id = public.current_org());
create policy "org update actions" on public.actions for update to authenticated using (organization_id = public.current_org());

create policy "org read kpis" on public.kpis for select to authenticated using (organization_id = public.current_org());
create policy "org write kpis" on public.kpis for insert to authenticated with check (organization_id = public.current_org());
create policy "org update kpis" on public.kpis for update to authenticated using (organization_id = public.current_org());

create policy "org read kpi values" on public.kpi_values for select to authenticated using (organization_id = public.current_org());
create policy "org append kpi values" on public.kpi_values for insert to authenticated with check (organization_id = public.current_org());
-- No update / no delete on kpi_values (append-only)

create policy "org read documents" on public.documents for select to authenticated using (organization_id = public.current_org());
create policy "org write documents" on public.documents for insert to authenticated with check (organization_id = public.current_org());
create policy "org update documents" on public.documents for update to authenticated using (organization_id = public.current_org());

-- Audits
create policy "org read audits" on public.audits for select to authenticated using (organization_id = public.current_org());
create policy "auditor write audits" on public.audits for insert to authenticated
  with check (organization_id = public.current_org()
    and (public.is_rmq(auth.uid()) or public.has_role(auth.uid(), 'top_management') or public.has_role(auth.uid(), 'auditor_internal')));
create policy "auditor update audits" on public.audits for update to authenticated
  using (organization_id = public.current_org()
    and (public.is_rmq(auth.uid()) or public.has_role(auth.uid(), 'top_management') or public.has_role(auth.uid(), 'auditor_internal')));

create policy "org read checklist" on public.audit_checklist_items for select to authenticated using (organization_id = public.current_org());
create policy "auditor write checklist" on public.audit_checklist_items for insert to authenticated
  with check (organization_id = public.current_org());
create policy "auditor update checklist" on public.audit_checklist_items for update to authenticated
  using (organization_id = public.current_org());

create policy "org read findings" on public.audit_findings for select to authenticated using (organization_id = public.current_org());
create policy "auditor write findings" on public.audit_findings for insert to authenticated
  with check (organization_id = public.current_org());
create policy "auditor update findings" on public.audit_findings for update to authenticated
  using (organization_id = public.current_org());

create policy "org read evidence" on public.audit_evidence for select to authenticated using (organization_id = public.current_org());
create policy "org write evidence" on public.audit_evidence for insert to authenticated with check (organization_id = public.current_org());

-- Signatures (append-only)
create policy "org read signatures" on public.signatures for select to authenticated using (organization_id = public.current_org());
create policy "self sign" on public.signatures for insert to authenticated
  with check (organization_id = public.current_org() and signer_id = auth.uid());

-- Notifications
create policy "own notifications read" on public.notifications for select to authenticated using (user_id = auth.uid());
create policy "own notifications update" on public.notifications for update to authenticated using (user_id = auth.uid());
create policy "system insert notifications" on public.notifications for insert to authenticated
  with check (organization_id = public.current_org());

-- Audit log
create policy "rmq read audit log" on public.audit_log for select to authenticated
  using (organization_id = public.current_org() and (public.is_rmq(auth.uid()) or public.has_role(auth.uid(), 'top_management')));
create policy "system insert audit log" on public.audit_log for insert to authenticated
  with check (organization_id = public.current_org() and actor_id = auth.uid());

-- ============= STORAGE BUCKETS =============
insert into storage.buckets (id, name, public)
values ('qms-evidence', 'qms-evidence', false),
       ('qms-documents', 'qms-documents', false)
on conflict do nothing;

create policy "org read evidence files" on storage.objects for select to authenticated
  using (bucket_id = 'qms-evidence' and (storage.foldername(name))[1] = public.current_org()::text);
create policy "org upload evidence files" on storage.objects for insert to authenticated
  with check (bucket_id = 'qms-evidence' and (storage.foldername(name))[1] = public.current_org()::text);

create policy "org read doc files" on storage.objects for select to authenticated
  using (bucket_id = 'qms-documents' and (storage.foldername(name))[1] = public.current_org()::text);
create policy "org upload doc files" on storage.objects for insert to authenticated
  with check (bucket_id = 'qms-documents' and (storage.foldername(name))[1] = public.current_org()::text);
