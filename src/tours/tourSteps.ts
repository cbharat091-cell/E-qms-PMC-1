// react-joyride v2 Step shape (typed loosely to avoid `export =` interop issues)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Step = any;

export type TourKey =
  | "dashboard"
  | "processes"
  | "processDetail"
  | "issues"
  | "actions"
  | "documents"
  | "audits"
  | "standardRequirements"
  | "settings";

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

export const TOURS: Record<TourKey, TourDef> = {
  dashboard: {
    key: "dashboard",
    title: "Dashboard tour",
    description: "Get oriented with your management system home.",
    steps: make([
      {
        target: 'body',
        placement: "center",
        title: "Welcome to your QMS",
        content:
          "This quick tour shows how to navigate your quality management system. You can restart it anytime from your profile menu.",
      },
      {
        target: '[data-tour="sidenav"]',
        content:
          "Use the side navigation to jump between the main modules: Processes, Audits, Tools, Documents and more.",
      },
      {
        target: '[data-tour="hero"]',
        content:
          "The hero band summarizes your active standard, compliance, processes, open risks and overdue actions.",
      },
      {
        target: '[data-tour="signals"]',
        content:
          "System signals: compliance coverage, process health and risk/action status. Click any card to drill down.",
      },
      {
        target: '[data-tour="modules"]',
        content: "Open a module to manage its records.",
      },
      {
        target: '[data-tour="notifications"]',
        content: "Notifications: due actions, audits and reviews land here.",
      },
      {
        target: '[data-tour="user-menu"]',
        content:
          "Your profile, roles, settings and the tour relauncher live here.",
      },
    ]),
  },
  processes: {
    key: "processes",
    title: "Processes",
    description: "How to manage organizational processes.",
    steps: make([
      {
        target: 'body',
        placement: "center",
        title: "Processes",
        content:
          "Define each process with activities, ownership, KPIs and links to standard requirements.",
      },
      {
        target: '[data-tour="page-header"]',
        content:
          "Use the page header to search, filter or create a new process.",
      },
      {
        target: '[data-tour="list"]',
        content: "Click a process card to open its detail view.",
        placement: "top",
      },
    ]),
  },
  processDetail: {
    key: "processDetail",
    title: "Process detail",
    description: "Tabs, activities and inline editing.",
    steps: make([
      {
        target: 'body',
        placement: "center",
        title: "Process detail",
        content:
          "Switch between Overview, Activities and KPIs & Objectives. Most fields are inline-editable with local save.",
      },
    ]),
  },
  issues: {
    key: "issues",
    title: "Context & Issues",
    description: "Capture SWOT, risks and opportunities.",
    steps: make([
      {
        target: 'body',
        placement: "center",
        title: "Context & Issues",
        content:
          "Identify internal/external issues, risks and opportunities. Risks evaluate on a 3x3 matrix and can spawn actions.",
      },
    ]),
  },
  actions: {
    key: "actions",
    title: "Action Plan",
    description: "Improvement and corrective actions.",
    steps: make([
      {
        target: 'body',
        placement: "center",
        title: "Action Plan",
        content:
          "Every action is traceable to its source (risk, audit finding, KPI failure). Track owner, due date and efficiency.",
      },
    ]),
  },
  documents: {
    key: "documents",
    title: "Documents",
    description: "Procedures, forms and records.",
    steps: make([
      {
        target: 'body',
        placement: "center",
        title: "Documents",
        content:
          "Link documents to processes and ISO 9001 clauses. Versioning is automatic.",
      },
    ]),
  },
  audits: {
    key: "audits",
    title: "Internal Audits",
    description: "Plan, conduct and follow up audits.",
    steps: make([
      {
        target: 'body',
        placement: "center",
        title: "Internal Audits",
        content:
          "Plan audits, build checklists, record findings and convert non-conformities into actions. Closure requires e-signature.",
      },
    ]),
  },
  standardRequirements: {
    key: "standardRequirements",
    title: "Standard requirements",
    description: "Browse the ISO 9001 inventory.",
    steps: make([
      {
        target: 'body',
        placement: "center",
        title: "Standard requirements",
        content:
          "Each clause shows the exact text, suggested record columns and whether approval is required.",
      },
    ]),
  },
  settings: {
    key: "settings",
    title: "Settings",
    description: "Org-level configuration.",
    steps: make([
      {
        target: 'body',
        placement: "center",
        title: "Settings",
        content: "Configure your organization, users and standards.",
      },
    ]),
  },
};

export function tourKeyForPath(pathname: string): TourKey | null {
  if (pathname === "/" || pathname === "") return "dashboard";
  if (pathname.startsWith("/processes/")) return "processDetail";
  if (pathname.startsWith("/processes")) return "processes";
  if (pathname.startsWith("/issues")) return "issues";
  if (pathname.startsWith("/actions")) return "actions";
  if (pathname.startsWith("/documents")) return "documents";
  if (pathname.startsWith("/audits")) return "audits";
  if (pathname.startsWith("/settings/standard-requirements"))
    return "standardRequirements";
  if (pathname.startsWith("/settings")) return "settings";
  return null;
}
