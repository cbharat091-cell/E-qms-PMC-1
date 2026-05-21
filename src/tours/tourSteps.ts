// react-joyride v2 Step shape (typed loosely to avoid `export =` interop issues)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Step = any;

export type TourKey =
  | "dashboard"
  | "processes"
  | "processDetail"
  | "issues"
  | "issueForm"
  | "issueDetail"
  | "actions"
  | "actionForm"
  | "actionDetail"
  | "documents"
  | "documentForm"
  | "documentDetail"
  | "audits"
  | "auditDetail"
  | "tools"
  | "toolWorkspace"
  | "cb"
  | "cbWorkspace"
  | "standardRequirements"
  | "settings"
  | "userDetails"
  | "activityLog"
  | "help"
  | "onboarding"
  | "auth";

export interface TourDef {
  key: TourKey;
  title: string;
  description: string;
  steps: Step[];
}

const commonStepOpts: Partial<Step> = {
  disableBeacon: true,
  spotlightPadding: 6,
};

const make = (steps: Step[]): Step[] =>
  steps.map((s) => ({ ...commonStepOpts, ...s }));

// Reusable safe targets that always exist inside the authenticated app shell.
const HEADER = '[data-tour="page-header"]';
const SIDENAV = '[data-tour="sidenav"]';
const NOTIFICATIONS = '[data-tour="notifications"]';
const USER_MENU = '[data-tour="user-menu"]';

const centered = (title: string, content: string): Step => ({
  target: "body",
  placement: "center",
  title,
  content,
});

export const TOURS: Record<TourKey, TourDef> = {
  // ───────────────────────────── Dashboard
  dashboard: {
    key: "dashboard",
    title: "Dashboard tour",
    description: "Get oriented with your management system home.",
    steps: make([
      centered(
        "Welcome to your QMS",
        "This quick tour shows how to navigate your quality management system. You can restart it anytime from your profile menu — every screen has its own tour.",
      ),
      {
        target: SIDENAV,
        content:
          "The side navigation lets you jump between Processes, Internal Audits, Tools, Certification Body and Documents.",
      },
      {
        target: '[data-tour="hero"]',
        content:
          "The hero band summarizes your active standard, compliance level, processes, open risks and overdue actions at a glance.",
      },
      {
        target: '[data-tour="signals"]',
        content:
          "System signals: compliance coverage, process health and risk/action status. Click any card to drill into the underlying records.",
      },
      {
        target: '[data-tour="modules"]',
        content:
          "Module shortcuts. Open a module to manage its records, evidence and KPIs.",
      },
      {
        target: NOTIFICATIONS,
        content:
          "Notifications inbox — due actions, upcoming audits and pending reviews land here in real time.",
      },
      {
        target: USER_MENU,
        content:
          "Your profile, roles, settings, sign-out and the tour relauncher live here. Pick “Take a tour of this page” on any screen.",
      },
    ]),
  },

  // ───────────────────────────── Processes (list)
  processes: {
    key: "processes",
    title: "Processes",
    description: "How to manage organizational processes.",
    steps: make([
      centered(
        "Processes",
        "Each process is a unit of work with activities, an owner, KPIs, objectives, risks and links to standard requirements.",
      ),
      {
        target: HEADER,
        content:
          "Search, filter and create new processes from the page header. URL parameters keep your filters across navigations.",
      },
      centered(
        "Cards",
        "Click a process card to open its detail view with three tabs: Overview, Activities, and KPIs & Objectives.",
      ),
      centered(
        "Health badges",
        "Each card shows process health: KPI status, open risks and the count of linked ISO clauses fulfilled.",
      ),
    ]),
  },

  // ───────────────────────────── Process detail
  processDetail: {
    key: "processDetail",
    title: "Process detail",
    description: "Tabs, activities and inline editing.",
    steps: make([
      centered(
        "Process detail",
        "Switch between Overview, Activities and KPIs & Objectives. Each tab is a workspace dedicated to that aspect.",
      ),
      centered(
        "Overview tab",
        "Edit purpose, scope, inputs/outputs and revision history. The Immutable Governance activity (sequence 0) is generated automatically and cannot be deleted.",
      ),
      centered(
        "Activities tab",
        "Activities are ordered steps. Click one to open a slide-out panel with its description, owner, requirements and evidence.",
      ),
      centered(
        "KPIs & Objectives",
        "Define measurable KPIs with thresholds and link them to objectives. KPI failures automatically trigger improvement actions.",
      ),
      centered(
        "Inline editing",
        "Most fields are edited in place — click the pencil to edit, then Save or Cancel locally without leaving the page.",
      ),
    ]),
  },

  // ───────────────────────────── Issues
  issues: {
    key: "issues",
    title: "Context & Issues",
    description: "Capture SWOT, risks and opportunities.",
    steps: make([
      centered(
        "Context & Issues",
        "Identify internal/external issues, risks and opportunities. This is your ISO 4.1 evidence trail.",
      ),
      {
        target: HEADER,
        content:
          "Use the filter bar to narrow by type (risk, opportunity, SWOT), source process or status.",
      },
      centered(
        "Risk evaluation",
        "Risks are scored on a 3×3 likelihood × severity matrix and auto-mapped to Priority P01–P03. Evaluations are append-only for traceability.",
      ),
      centered(
        "From issue to action",
        "Any risk or issue can spawn an improvement action with one click — the link is preserved as evidence both ways.",
      ),
    ]),
  },
  issueForm: {
    key: "issueForm",
    title: "New / edit issue",
    description: "Capture an issue with full context.",
    steps: make([
      centered(
        "Issue form",
        "Describe the issue, classify it (risk, opportunity, SWOT) and link it to the originating process.",
      ),
      centered(
        "Risk scoring",
        "If the issue is a risk, the 3×3 matrix appears. Pick likelihood and severity — the system computes the priority for you.",
      ),
      centered(
        "Save behaviour",
        "Saving creates a new immutable version; nothing is ever overwritten in the history.",
      ),
    ]),
  },
  issueDetail: {
    key: "issueDetail",
    title: "Issue detail",
    description: "Review, evaluate and act on an issue.",
    steps: make([
      centered(
        "Issue detail",
        "Read the full description, see its origin, version history and any linked actions.",
      ),
      centered(
        "Convert to action",
        "Use the action button to spawn a corrective or preventive action — the issue stays linked as the source of truth.",
      ),
    ]),
  },

  // ───────────────────────────── Actions
  actions: {
    key: "actions",
    title: "Action plan",
    description: "Improvement and corrective actions.",
    steps: make([
      centered(
        "Action plan",
        "Every action is traceable to its source (risk, audit finding, KPI failure or management review).",
      ),
      {
        target: HEADER,
        content:
          "Filter by owner, status, due date or source. Overdue items are highlighted in red.",
      },
      centered(
        "Lifecycle",
        "Actions move from Planned → In progress → Implemented → Verified. Closing requires an efficiency evaluation.",
      ),
      {
        target: NOTIFICATIONS,
        content:
          "You'll be notified here when an action you own is due or overdue.",
      },
    ]),
  },
  actionForm: {
    key: "actionForm",
    title: "New / edit action",
    description: "Define an action with owner and due date.",
    steps: make([
      centered(
        "Action form",
        "Set the description, owner, due date and link the originating issue, finding or KPI.",
      ),
      centered(
        "Evidence",
        "Add planned verification criteria now so the efficiency check later is unambiguous.",
      ),
    ]),
  },
  actionDetail: {
    key: "actionDetail",
    title: "Action detail",
    description: "Track progress and close the loop.",
    steps: make([
      centered(
        "Action detail",
        "Update progress, attach evidence and record the efficiency evaluation when closing.",
      ),
      centered(
        "Audit trail",
        "Every change is logged with timestamp and user — perfect for ISO 10.2 corrective action evidence.",
      ),
    ]),
  },

  // ───────────────────────────── Documents
  documents: {
    key: "documents",
    title: "Documents",
    description: "Procedures, forms and records.",
    steps: make([
      centered(
        "Documents",
        "Procedures, forms and records linked to processes and ISO 9001 clauses.",
      ),
      {
        target: HEADER,
        content:
          "Filter by type, process, clause or status. Use the new-document button to upload a new controlled document.",
      },
      centered(
        "Versioning",
        "Each save creates a new version. Older versions stay accessible but are flagged as superseded.",
      ),
      centered(
        "Approvals",
        "Documents flagged as approval-required need an e-signature before they become effective.",
      ),
    ]),
  },
  documentForm: {
    key: "documentForm",
    title: "New / edit document",
    description: "Capture metadata and link clauses.",
    steps: make([
      centered(
        "Document form",
        "Provide title, type and the process(es) and ISO clauses this document supports.",
      ),
      centered(
        "Approval flag",
        "If the document type requires approval, the e-signature step will be requested on save.",
      ),
    ]),
  },
  documentDetail: {
    key: "documentDetail",
    title: "Document detail",
    description: "Review, approve and supersede.",
    steps: make([
      centered(
        "Document detail",
        "Read the content, see the version history and download previous versions.",
      ),
      centered(
        "E-signature",
        "Approving a new version requires typing your name and confirms identity, timestamp and a SHA-256 hash of the payload.",
      ),
    ]),
  },

  // ───────────────────────────── Audits
  audits: {
    key: "audits",
    title: "Internal audits",
    description: "Plan, conduct and follow up audits.",
    steps: make([
      centered(
        "Internal audits",
        "Plan internal audits, build checklists, record findings and convert non-conformities into actions.",
      ),
      {
        target: HEADER,
        content:
          "Create a new audit, filter by status (planned, in progress, closed) or by lead auditor.",
      },
      centered(
        "Schedule",
        "Upcoming audits are surfaced in your notifications inbox and on the dashboard.",
      ),
    ]),
  },
  auditDetail: {
    key: "auditDetail",
    title: "Audit detail",
    description: "Run an audit end to end.",
    steps: make([
      centered(
        "Audit detail",
        "Plan, conduct and close an audit from this single workspace.",
      ),
      centered(
        "Checklist",
        "Build checklists from process activities and standard clauses. Marking an item as Non-Conformity spawns a finding automatically.",
      ),
      centered(
        "Findings",
        "Each finding can be converted into a corrective action with one click; the link is preserved both ways.",
      ),
      centered(
        "Closure",
        "Closing an audit requires an e-signature from the lead auditor — identity, timestamp and payload hash are stored immutably.",
      ),
    ]),
  },

  // ───────────────────────────── Tools
  tools: {
    key: "tools",
    title: "Tools",
    description: "Cross-cutting QMS tools.",
    steps: make([
      centered(
        "Tools",
        "Tools group cross-cutting QMS workflows: management review, leadership, objectives, KPI registry and more.",
      ),
      centered(
        "Catalog",
        "Each card opens a dedicated workspace. Tools share the same scaffolded patterns — tables, inline editing and signatures.",
      ),
    ]),
  },
  toolWorkspace: {
    key: "toolWorkspace",
    title: "Tool workspace",
    description: "Work inside a single tool.",
    steps: make([
      centered(
        "Tool workspace",
        "A tool workspace bundles tabs, editable tables and a signature panel where applicable.",
      ),
      centered(
        "Editable tables",
        "Add or edit rows inline. Critical associations require explicit Save — minor edits autosave locally.",
      ),
      centered(
        "Signatures",
        "Records flagged as approval-required get an e-signature card at the bottom — sign to lock the record.",
      ),
    ]),
  },

  // ───────────────────────────── Certification Body
  cb: {
    key: "cb",
    title: "Certification Body",
    description: "ISO/IEC 17021-1 workspace.",
    steps: make([
      centered(
        "Certification Body",
        "If your organization is a Certification Body, this module covers the ISO/IEC 17021-1 lifecycle: clients, programs, audits, certificates, impartiality and complaints.",
      ),
      centered(
        "Tools",
        "Each tile opens a dedicated tool. Records are isolated from QMS records and prefixed with cb_.",
      ),
    ]),
  },
  cbWorkspace: {
    key: "cbWorkspace",
    title: "CB tool workspace",
    description: "Run a CB tool end to end.",
    steps: make([
      centered(
        "CB tool",
        "Each CB tool follows the ISO/IEC 17021-1 lifecycle with a stepper, record list and a slide-out drawer for details.",
      ),
      centered(
        "Impartiality",
        "Conflict-of-interest checks are enforced automatically — the system blocks assignments that violate the separation of duties.",
      ),
    ]),
  },

  // ───────────────────────────── Standard Requirements
  standardRequirements: {
    key: "standardRequirements",
    title: "Standard requirements",
    description: "Browse the ISO 9001 inventory.",
    steps: make([
      centered(
        "Standard requirements",
        "The complete ISO 9001 clause inventory — 50 clauses with full text, suggested record columns and approval flags.",
      ),
      centered(
        "Accordion",
        "Click any clause to expand its details. The list is top-anchored so the active clause stays in view.",
      ),
      centered(
        "Fulfillment",
        "Coverage is inferred from your linked processes, documents and records — no manual mapping required.",
      ),
    ]),
  },

  // ───────────────────────────── Settings
  settings: {
    key: "settings",
    title: "Settings",
    description: "Org-level configuration.",
    steps: make([
      centered(
        "Settings",
        "Configure your organization profile, users and the standards you operate under.",
      ),
      centered(
        "Users & roles",
        "Invite teammates and assign roles: RMQ, Top Management, Process Owner, Auditor. Roles drive what they can see and approve.",
      ),
      centered(
        "Standards",
        "Activate ISO 9001, ISO 14001 or ISO/IEC 17021-1. The UI adapts to the active standard's clause set automatically.",
      ),
    ]),
  },
  userDetails: {
    key: "userDetails",
    title: "User details",
    description: "Manage a user's profile and roles.",
    steps: make([
      centered(
        "User details",
        "Edit a user's display name, job title and assigned roles. Role changes take effect on their next page load.",
      ),
    ]),
  },

  // ───────────────────────────── Activity & Help
  activityLog: {
    key: "activityLog",
    title: "Activity log",
    description: "Audit trail for the whole system.",
    steps: make([
      centered(
        "Activity log",
        "Every create / update / signature event is recorded here with user, timestamp and the affected record. Append-only.",
      ),
      centered(
        "Filtering",
        "Filter by user, action type or record to reconstruct any change for an audit.",
      ),
    ]),
  },
  help: {
    key: "help",
    title: "Help",
    description: "In-product guidance.",
    steps: make([
      centered(
        "Help center",
        "Find guidance on every module, ISO clause mapping and answers to common questions.",
      ),
    ]),
  },

  // ───────────────────────────── Auth & Onboarding
  onboarding: {
    key: "onboarding",
    title: "Onboarding wizard",
    description: "Set up your organization.",
    steps: make([
      centered(
        "Welcome",
        "Four short steps to set up your QMS: your name, your organization, your scope, then you're in.",
      ),
      centered(
        "Defaults",
        "Don't worry about getting everything right — you can edit organization details anytime from Settings.",
      ),
    ]),
  },
  auth: {
    key: "auth",
    title: "Sign in",
    description: "Authentication options.",
    steps: make([
      centered(
        "Sign in",
        "Sign in with email + password or Google. Invite-only users receive a setup link by email.",
      ),
    ]),
  },
};

export function tourKeyForPath(pathname: string): TourKey | null {
  if (pathname === "/" || pathname === "") return "dashboard";

  if (pathname.startsWith("/processes/")) return "processDetail";
  if (pathname.startsWith("/processes")) return "processes";

  if (pathname.startsWith("/issues/new") || /^\/issues\/[^/]+\/edit$/.test(pathname))
    return "issueForm";
  if (/^\/issues\/[^/]+$/.test(pathname)) return "issueDetail";
  if (pathname.startsWith("/issues")) return "issues";

  if (pathname.startsWith("/actions/new") || /^\/actions\/[^/]+\/edit$/.test(pathname))
    return "actionForm";
  if (/^\/actions\/[^/]+$/.test(pathname)) return "actionDetail";
  if (pathname.startsWith("/actions")) return "actions";

  if (pathname.startsWith("/documents/new") || /^\/documents\/[^/]+\/edit$/.test(pathname))
    return "documentForm";
  if (/^\/documents\/[^/]+$/.test(pathname)) return "documentDetail";
  if (pathname.startsWith("/documents")) return "documents";

  if (/^\/audits\/[^/]+$/.test(pathname)) return "auditDetail";
  if (pathname.startsWith("/audits")) return "audits";

  if (pathname.startsWith("/tools/")) return "toolWorkspace";
  if (pathname.startsWith("/tools")) return "tools";

  if (pathname.startsWith("/cb/")) return "cbWorkspace";
  if (pathname.startsWith("/cb")) return "cb";

  if (pathname.startsWith("/settings/standard-requirements"))
    return "standardRequirements";
  if (pathname.startsWith("/settings/user-details")) return "userDetails";
  if (pathname.startsWith("/settings")) return "settings";

  if (pathname.startsWith("/activity-log")) return "activityLog";
  if (pathname.startsWith("/help")) return "help";
  if (pathname.startsWith("/onboarding")) return "onboarding";
  if (pathname.startsWith("/auth")) return "auth";

  return null;
}
