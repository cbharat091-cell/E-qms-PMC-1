// ISO 9001:2015 — Enriched Requirement Guidance
// Statements are faithful paraphrases of the standard's wording (the ISO text
// itself is copyrighted and is not reproduced verbatim). Each requirement now
// carries a suggested record template — the columns the implementing record
// should expose — plus an explicit approval/signature rule indicating who must
// validate it (or that it is not subject to formal approval).

export interface RequirementRecordColumn {
  /** Column name as it would appear in the record. */
  name: string;
  /** Short description of what the column captures. */
  description?: string;
}

export interface RequirementRecordApproval {
  /** True when the record needs a formal sign-off before being considered valid. */
  required: boolean;
  /** Role expected to approve / sign the record. Omit when required = false. */
  approver?: string;
  /** Free-text note clarifying the signature regime (e.g. dual signature, periodicity). */
  note?: string;
}

export interface RequirementRecordTemplate {
  /** Suggested record / form name. */
  name: string;
  /** Columns / fields the record should expose. */
  columns: RequirementRecordColumn[];
  /** Approval / signature rule for the record. */
  approval: RequirementRecordApproval;
  /** Suggested minimum retention period. */
  retention?: string;
}

export interface RequirementGuidance {
  clauseNumber: string;
  clauseTitle: string;
  /** Faithful paraphrase of the ISO 9001:2015 clause requirement. */
  statement: string;
  typicalAllocation: string[];
  howToSatisfy: {
    practices: string[];
    controls: string[];
    evidenceExamples: string[];
  };
  supportingEvidence: {
    documents: string[];
    records: string[];
    other: string[];
  };
  /** Suggested record / form layout to demonstrate compliance. */
  recordTemplate: RequirementRecordTemplate;
}

export interface StandardClauseGroup {
  clauseNumber: string;
  clauseTitle: string;
  requirements: RequirementGuidance[];
}

export interface StandardDefinition {
  id: string;
  name: string;
  version: string;
  clauseGroups: StandardClauseGroup[];
}

const ISO9001_GUIDANCE: RequirementGuidance[] = [
  // ── Clause 4 — Context of the organization ──────────────────────────────
  {
    clauseNumber: "4.1",
    clauseTitle: "Understanding the organization and its context",
    statement:
      "The organization shall determine external and internal issues that are relevant to its purpose and strategic direction and that affect its ability to achieve the intended result(s) of its quality management system. The organization shall monitor and review information about these external and internal issues.",
    typicalAllocation: ["Context Analysis", "QMS Governance"],
    howToSatisfy: {
      practices: [
        "Conduct a periodic SWOT / PESTEL analysis",
        "Review market, regulatory, technological and competitive trends",
        "Assess internal capabilities, culture and performance",
      ],
      controls: ["Annual context review cycle", "Trigger-based review on significant change"],
      evidenceExamples: ["SWOT matrix", "Context analysis document", "Strategic planning minutes"],
    },
    supportingEvidence: {
      documents: ["Context analysis procedure", "Strategic plan"],
      records: ["SWOT matrix", "External / internal issues log"],
      other: ["Industry benchmarking reports"],
    },
    recordTemplate: {
      name: "Context Issues Register",
      columns: [
        { name: "Ref.", description: "Sequential identifier (e.g. CTX/25/001)" },
        { name: "Origin", description: "Internal or External" },
        { name: "Category", description: "PESTEL / SWOT axis" },
        { name: "Issue description" },
        { name: "Impact on QMS" },
        { name: "Affected interested parties" },
        { name: "Owner" },
        { name: "Review date" },
        { name: "Status", description: "Active / Monitored / Closed" },
      ],
      approval: {
        required: true,
        approver: "Top Management",
        note: "Validated at Management Review; signed by the Quality Manager and acknowledged by Top Management.",
      },
      retention: "Minimum 1 review cycle (typically 3 years).",
    },
  },
  {
    clauseNumber: "4.2",
    clauseTitle: "Understanding the needs and expectations of interested parties",
    statement:
      "Due to their effect or potential effect on the organization's ability to consistently provide products and services that meet customer and applicable statutory and regulatory requirements, the organization shall determine the interested parties relevant to the QMS, their relevant requirements, and which of these requirements will be addressed through the QMS.",
    typicalAllocation: ["Interested Parties Assessment", "QMS Governance"],
    howToSatisfy: {
      practices: [
        "Identify all relevant stakeholders",
        "Document their needs, expectations and obligations",
        "Review periodically and on change of context",
      ],
      controls: ["Stakeholder register reviewed at Management Review", "Change-trigger reassessment"],
      evidenceExamples: ["Stakeholder register", "Needs & expectations log"],
    },
    supportingEvidence: {
      documents: ["Stakeholder analysis procedure"],
      records: ["Stakeholder register", "Needs assessment records"],
      other: ["Customer feedback summaries"],
    },
    recordTemplate: {
      name: "Interested Parties Register",
      columns: [
        { name: "Ref." },
        { name: "Interested party" },
        { name: "Type", description: "Customer / Regulator / Supplier / Employee / Society / Owner" },
        { name: "Needs & expectations" },
        { name: "Statutory / regulatory?" },
        { name: "Addressed in QMS?" },
        { name: "Linked process(es)" },
        { name: "Review date" },
        { name: "Owner" },
      ],
      approval: {
        required: true,
        approver: "Quality Manager",
        note: "Reviewed annually and at Management Review; signed by the Quality Manager.",
      },
      retention: "3 years rolling.",
    },
  },
  {
    clauseNumber: "4.3",
    clauseTitle: "Determining the scope of the quality management system",
    statement:
      "The organization shall determine the boundaries and applicability of the QMS to establish its scope, considering external and internal issues, requirements of relevant interested parties, and its products and services. The scope shall be available and maintained as documented information stating the products and services covered and providing justification for any requirement that the organization determines is not applicable.",
    typicalAllocation: ["QMS Governance"],
    howToSatisfy: {
      practices: [
        "Define physical, organizational and product/service boundaries",
        "Identify applicable clauses and any exclusions with justification",
      ],
      controls: ["Scope reviewed at Management Review", "Change control on scope modifications"],
      evidenceExamples: ["Scope statement", "QMS manual scope section"],
    },
    supportingEvidence: {
      documents: ["QMS scope document", "QMS manual"],
      records: ["Scope review records"],
      other: ["Organization chart"],
    },
    recordTemplate: {
      name: "QMS Scope Statement",
      columns: [
        { name: "Version" },
        { name: "Effective date" },
        { name: "Sites covered" },
        { name: "Products / services in scope" },
        { name: "Excluded clauses" },
        { name: "Justification for exclusion" },
        { name: "Author" },
        { name: "Approver" },
      ],
      approval: {
        required: true,
        approver: "Top Management",
        note: "Documented information signed by Top Management; any change requires re-approval.",
      },
      retention: "Permanent (current + previous version retained).",
    },
  },
  {
    clauseNumber: "4.4",
    clauseTitle: "Quality management system and its processes",
    statement:
      "The organization shall establish, implement, maintain and continually improve a QMS, including the processes needed and their interactions. It shall determine the inputs and expected outputs, sequence and interaction, criteria and methods, resources, responsibilities, risks and opportunities, evaluation and improvement of these processes, and maintain / retain documented information to the extent necessary.",
    typicalAllocation: ["Process Design", "QMS Governance"],
    howToSatisfy: {
      practices: [
        "Map all QMS processes (process landscape)",
        "Define inputs, outputs, sequence and interactions",
        "Assign process owners and KPIs",
      ],
      controls: ["Process performance monitoring", "Periodic process review"],
      evidenceExamples: ["Process map", "Interaction matrix", "Turtle diagrams"],
    },
    supportingEvidence: {
      documents: ["QMS process map", "Process descriptions"],
      records: ["Process performance data"],
      other: ["Interaction diagrams"],
    },
    recordTemplate: {
      name: "Process Identity Card",
      columns: [
        { name: "Process code" },
        { name: "Process name" },
        { name: "Type", description: "Management / Operational / Support" },
        { name: "Pilot (owner)" },
        { name: "Inputs" },
        { name: "Outputs" },
        { name: "Suppliers / Customers" },
        { name: "Activities" },
        { name: "Resources" },
        { name: "KPIs & targets" },
        { name: "Risks & opportunities" },
        { name: "Linked documents" },
      ],
      approval: {
        required: true,
        approver: "Process Owner + Quality Manager",
        note: "Dual signature: Process Owner authors, Quality Manager validates.",
      },
      retention: "Living document; previous version archived on revision.",
    },
  },

  // ── Clause 5 — Leadership ───────────────────────────────────────────────
  {
    clauseNumber: "5.1",
    clauseTitle: "Leadership and commitment",
    statement:
      "Top management shall demonstrate leadership and commitment with respect to the QMS by taking accountability for its effectiveness, ensuring the quality policy and quality objectives are established and compatible with the strategic direction, ensuring integration of QMS requirements into business processes, promoting the process approach and risk-based thinking, ensuring resources are available, communicating the importance of effective quality management, and supporting other relevant management roles.",
    typicalAllocation: ["Leadership", "Management Review"],
    howToSatisfy: {
      practices: [
        "Active participation of Top Management in QMS planning",
        "Resource allocation aligned with QMS priorities",
        "Regular communication of quality importance",
      ],
      controls: ["Management Review meetings", "Quality performance on executive agenda"],
      evidenceExamples: ["Management Review minutes", "Commitment statements", "Resource allocation records"],
    },
    supportingEvidence: {
      documents: ["Quality policy", "Management commitment statement"],
      records: ["Management Review minutes", "Resource plans"],
      other: ["Communication records to staff"],
    },
    recordTemplate: {
      name: "Leadership Commitment Log",
      columns: [
        { name: "Date" },
        { name: "Forum", description: "Mgt Review / Exec Committee / Town Hall" },
        { name: "Commitment / decision" },
        { name: "Resources committed" },
        { name: "Linked objective(s)" },
        { name: "Owner" },
        { name: "Due date" },
        { name: "Status" },
      ],
      approval: {
        required: true,
        approver: "Top Management",
        note: "Each entry signed by Top Management (or recorded in signed Management Review minutes).",
      },
      retention: "5 years.",
    },
  },
  {
    clauseNumber: "5.2",
    clauseTitle: "Quality policy",
    statement:
      "Top management shall establish, implement and maintain a quality policy that is appropriate to the purpose and context of the organization and supports its strategic direction, provides a framework for setting quality objectives, includes a commitment to satisfy applicable requirements and a commitment to continual improvement of the QMS. The policy shall be available as documented information, communicated, understood and applied within the organization, and available to relevant interested parties.",
    typicalAllocation: ["Leadership", "Quality Policy activity"],
    howToSatisfy: {
      practices: [
        "Draft policy aligned with strategic direction and context",
        "Communicate to all levels and interested parties",
        "Review periodically for continued suitability",
      ],
      controls: ["Periodic policy review", "Communication-effectiveness check"],
      evidenceExamples: ["Quality policy document", "Communication records", "Acknowledgement forms"],
    },
    supportingEvidence: {
      documents: ["Quality policy"],
      records: ["Policy communication records", "Review records"],
      other: ["Posted policy displays", "Intranet publications"],
    },
    recordTemplate: {
      name: "Quality Policy Document",
      columns: [
        { name: "Version" },
        { name: "Issue date" },
        { name: "Policy axes", description: "e.g. Customer focus, Compliance, Improvement" },
        { name: "Commitment statements" },
        { name: "Communication channels" },
        { name: "Author" },
        { name: "Approver" },
      ],
      approval: {
        required: true,
        approver: "Top Management (CEO / General Manager)",
        note: "Mandatory signature by Top Management; re-signed at every revision.",
      },
      retention: "Permanent (all versions archived).",
    },
  },
  {
    clauseNumber: "5.3",
    clauseTitle: "Organizational roles, responsibilities and authorities",
    statement:
      "Top management shall ensure that the responsibilities and authorities for relevant roles are assigned, communicated and understood within the organization, including responsibility for ensuring conformity to the standard, reporting on QMS performance, promoting customer focus, and maintaining QMS integrity when changes are planned and implemented.",
    typicalAllocation: ["HR", "Organizational Governance"],
    howToSatisfy: {
      practices: ["Define role descriptions", "Build RACI matrices", "Communicate authority assignments"],
      controls: ["Periodic role review", "Onboarding for role clarity"],
      evidenceExamples: ["Org chart", "Role descriptions", "RACI matrices"],
    },
    supportingEvidence: {
      documents: ["Organization chart", "Job descriptions"],
      records: ["Authority assignment records"],
      other: ["RACI matrices"],
    },
    recordTemplate: {
      name: "Roles, Responsibilities & Authorities Matrix",
      columns: [
        { name: "Role / Position" },
        { name: "Holder" },
        { name: "Process(es) involved" },
        { name: "Responsibility (R/A/C/I)" },
        { name: "Authority / decision rights" },
        { name: "Backup" },
        { name: "Communication channel" },
      ],
      approval: {
        required: true,
        approver: "Top Management + HR",
        note: "Approved by Top Management; HR maintains; signature collected from each role holder upon assignment.",
      },
      retention: "Until superseded; archived for 5 years after change.",
    },
  },

  // ── Clause 6 — Planning ─────────────────────────────────────────────────
  {
    clauseNumber: "6.1",
    clauseTitle: "Actions to address risks and opportunities",
    statement:
      "When planning the QMS, the organization shall consider the issues of 4.1 and the requirements of 4.2 and determine the risks and opportunities that need to be addressed to give assurance the QMS can achieve its intended results, enhance desirable effects, prevent or reduce undesired effects, and achieve improvement. The organization shall plan actions to address these risks and opportunities, integrate and implement them in QMS processes, and evaluate their effectiveness.",
    typicalAllocation: ["Risk Assessment", "Risk Treatment planning"],
    howToSatisfy: {
      practices: [
        "Risk identification workshops per process",
        "Severity × Likelihood scoring methodology",
        "Opportunity assessment linked to objectives",
      ],
      controls: ["Risk register review cycle", "Risk treatment plan follow-up"],
      evidenceExamples: ["Risk register", "Treatment plans", "Risk scoring records"],
    },
    supportingEvidence: {
      documents: ["Risk management procedure"],
      records: ["Risk register", "Risk assessment reports"],
      other: ["Risk heat maps"],
    },
    recordTemplate: {
      name: "Risk & Opportunity Register",
      columns: [
        { name: "Ref.", description: "e.g. RISK/25/001" },
        { name: "Process" },
        { name: "Type", description: "Risk / Opportunity" },
        { name: "Description" },
        { name: "Cause" },
        { name: "Potential effect" },
        { name: "Severity (1-3)" },
        { name: "Likelihood (1-3)" },
        { name: "Gross score" },
        { name: "Priority", description: "P01 / P02 / P03 (auto-mapped)" },
        { name: "Treatment decision" },
        { name: "Action plan ref." },
        { name: "Residual score" },
        { name: "Owner" },
        { name: "Review date" },
      ],
      approval: {
        required: true,
        approver: "Process Owner + Quality Manager",
        note: "Each evaluation signed by the Process Owner and validated by the Quality Manager (append-only versioning).",
      },
      retention: "5 years; previous evaluations preserved (immutable history).",
    },
  },
  {
    clauseNumber: "6.2",
    clauseTitle: "Quality objectives and planning to achieve them",
    statement:
      "The organization shall establish quality objectives at relevant functions, levels and processes needed for the QMS. Objectives shall be consistent with the quality policy, measurable, take applicable requirements into account, be relevant to conformity of products and services and to enhancement of customer satisfaction, be monitored, communicated and updated as appropriate. The organization shall determine what will be done, what resources will be required, who will be responsible, when it will be completed, and how the results will be evaluated.",
    typicalAllocation: ["Objective Setting", "Strategic Planning"],
    howToSatisfy: {
      practices: ["Set SMART objectives", "Cascade to process level", "Define KPIs and targets"],
      controls: ["Periodic objective review", "Progress tracking against plans"],
      evidenceExamples: ["Objective table", "KPI definitions", "Action plans"],
    },
    supportingEvidence: {
      documents: ["Quality objectives register"],
      records: ["KPI tracking data", "Objective review records"],
      other: ["Balanced scorecards"],
    },
    recordTemplate: {
      name: "Quality Objectives Plan",
      columns: [
        { name: "Objective ref." },
        { name: "Linked policy axis" },
        { name: "Process / function" },
        { name: "Statement (SMART)" },
        { name: "KPI" },
        { name: "Target" },
        { name: "Baseline" },
        { name: "Resources" },
        { name: "Responsible" },
        { name: "Due date" },
        { name: "Evaluation method" },
        { name: "Status" },
      ],
      approval: {
        required: true,
        approver: "Top Management",
        note: "Approved by Top Management at Management Review; Process Owner signs commitment.",
      },
      retention: "Year-on-year archive (minimum 3 years).",
    },
  },
  {
    clauseNumber: "6.3",
    clauseTitle: "Planning of changes",
    statement:
      "When the organization determines the need for changes to the QMS, the changes shall be carried out in a planned manner. The organization shall consider the purpose of the changes and their potential consequences, the integrity of the QMS, the availability of resources, and the allocation or reallocation of responsibilities and authorities.",
    typicalAllocation: ["Change Control", "QMS Governance"],
    howToSatisfy: {
      practices: ["Formal change request process", "Impact assessment before implementation", "Stakeholder communication"],
      controls: ["Change approval workflow", "Post-change effectiveness review"],
      evidenceExamples: ["Change requests", "Impact assessments", "Approval records"],
    },
    supportingEvidence: {
      documents: ["Change management procedure"],
      records: ["Change request log", "Impact assessment records"],
      other: ["Approval evidence"],
    },
    recordTemplate: {
      name: "QMS Change Request",
      columns: [
        { name: "Change ref." },
        { name: "Requester" },
        { name: "Date raised" },
        { name: "Purpose of change" },
        { name: "Scope / processes affected" },
        { name: "Potential consequences" },
        { name: "Resources required" },
        { name: "Responsibility reallocation" },
        { name: "Risk assessment" },
        { name: "Decision", description: "Approved / Rejected / Deferred" },
        { name: "Approver" },
        { name: "Effectiveness review date" },
      ],
      approval: {
        required: true,
        approver: "Quality Manager (and Top Management for major changes)",
        note: "All changes signed by the Quality Manager; major / strategic changes additionally signed by Top Management.",
      },
      retention: "5 years from closure.",
    },
  },

  // ── Clause 7 — Support ──────────────────────────────────────────────────
  {
    clauseNumber: "7.1",
    clauseTitle: "Resources",
    statement:
      "The organization shall determine and provide the resources needed for the establishment, implementation, maintenance and continual improvement of the QMS — including people, infrastructure, environment for the operation of processes, monitoring and measuring resources, and organizational knowledge.",
    typicalAllocation: ["Resource Planning", "Budget Management"],
    howToSatisfy: {
      practices: ["Resource needs assessment", "Budget planning aligned with QMS", "Gap analysis"],
      controls: ["Annual resource review", "Budget tracking"],
      evidenceExamples: ["Resource plans", "Budget logs", "Allocation records"],
    },
    supportingEvidence: {
      documents: ["Resource management procedure"],
      records: ["Resource allocation records", "Budget reports"],
      other: ["Staffing plans"],
    },
    recordTemplate: {
      name: "Resource Allocation Plan",
      columns: [
        { name: "Resource type", description: "People / Infrastructure / Environment / Measurement / Knowledge" },
        { name: "Description" },
        { name: "Process / activity served" },
        { name: "Required quantity" },
        { name: "Allocated quantity" },
        { name: "Gap" },
        { name: "Budget" },
        { name: "Responsible" },
        { name: "Period" },
      ],
      approval: {
        required: true,
        approver: "Top Management / Finance Director",
        note: "Annual plan signed by Top Management; in-year revisions signed by Finance + Quality Manager.",
      },
      retention: "Current fiscal year + 3 years.",
    },
  },
  {
    clauseNumber: "7.2",
    clauseTitle: "Competence",
    statement:
      "The organization shall determine the necessary competence of person(s) doing work under its control that affects the performance and effectiveness of the QMS, ensure they are competent on the basis of appropriate education, training, or experience, take actions to acquire the necessary competence where applicable, evaluate the effectiveness of the actions taken, and retain appropriate documented information as evidence of competence.",
    typicalAllocation: ["Training", "HR"],
    howToSatisfy: {
      practices: ["Competence needs analysis per role", "Training plans", "Effectiveness evaluation"],
      controls: ["Annual training review", "Competence assessment cycle"],
      evidenceExamples: ["Training plans", "Skills matrices", "Certificates"],
    },
    supportingEvidence: {
      documents: ["Training procedure", "Competence matrix"],
      records: ["Training records", "Certificates", "Evaluation records"],
      other: ["Skills gap analysis"],
    },
    recordTemplate: {
      name: "Competence Matrix & Training Record",
      columns: [
        { name: "Employee" },
        { name: "Role" },
        { name: "Required competence" },
        { name: "Current level (1-4)" },
        { name: "Evidence", description: "Diploma / experience / training" },
        { name: "Gap" },
        { name: "Action planned" },
        { name: "Trainer / provider" },
        { name: "Completion date" },
        { name: "Effectiveness evaluation" },
      ],
      approval: {
        required: true,
        approver: "Line Manager + HR",
        note: "Each entry signed by line manager; effectiveness evaluation co-signed by HR.",
      },
      retention: "Duration of employment + 5 years.",
    },
  },
  {
    clauseNumber: "7.3",
    clauseTitle: "Awareness",
    statement:
      "The organization shall ensure that persons doing work under its control are aware of the quality policy, relevant quality objectives, their contribution to the effectiveness of the QMS (including the benefits of improved performance), and the implications of not conforming with QMS requirements.",
    typicalAllocation: ["Communication", "HR", "Onboarding"],
    howToSatisfy: {
      practices: ["Induction programs", "Regular quality communications", "Visual management"],
      controls: ["Awareness surveys", "Induction records"],
      evidenceExamples: ["Awareness communications", "Induction records", "Survey results"],
    },
    supportingEvidence: {
      documents: ["Communication plan"],
      records: ["Induction records", "Awareness survey data"],
      other: ["Notice boards", "Intranet communications"],
    },
    recordTemplate: {
      name: "Awareness Session Log",
      columns: [
        { name: "Session date" },
        { name: "Topic", description: "Policy / Objectives / Contribution / Non-conformity implications" },
        { name: "Audience" },
        { name: "Facilitator" },
        { name: "Attendance list" },
        { name: "Materials ref." },
        { name: "Effectiveness check", description: "Quiz / survey / observation" },
      ],
      approval: {
        required: false,
        note: "Operational record — not subject to formal approval. Attendance signed by participants for traceability.",
      },
      retention: "3 years.",
    },
  },
  {
    clauseNumber: "7.4",
    clauseTitle: "Communication",
    statement:
      "The organization shall determine the internal and external communications relevant to the QMS, including: on what it will communicate, when to communicate, with whom to communicate, how to communicate, and who communicates.",
    typicalAllocation: ["Communication Planning", "QMS Governance"],
    howToSatisfy: {
      practices: ["Communication matrix (what / when / who / how)", "Regular meeting cadence", "External communication protocols"],
      controls: ["Communication plan review", "Feedback mechanisms"],
      evidenceExamples: ["Communication logs", "Meeting schedules", "Communication matrix"],
    },
    supportingEvidence: {
      documents: ["Communication procedure", "Communication matrix"],
      records: ["Communication logs", "Meeting minutes"],
      other: ["Email trails", "Newsletter archives"],
    },
    recordTemplate: {
      name: "Communication Matrix",
      columns: [
        { name: "Subject (What)" },
        { name: "Trigger / frequency (When)" },
        { name: "Audience (With whom)" },
        { name: "Direction", description: "Internal / External" },
        { name: "Channel (How)" },
        { name: "Issuer (Who)" },
        { name: "Expected response" },
        { name: "Evidence kept" },
      ],
      approval: {
        required: true,
        approver: "Quality Manager",
        note: "Matrix approved by the Quality Manager; reviewed annually.",
      },
      retention: "Current + 1 previous version.",
    },
  },
  {
    clauseNumber: "7.5",
    clauseTitle: "Documented information",
    statement:
      "The QMS shall include documented information required by ISO 9001 and determined by the organization as being necessary for the effectiveness of the QMS. Documented information shall be appropriately identified, formatted, reviewed and approved for suitability and adequacy. It shall be controlled to ensure availability where needed and adequate protection (loss of confidentiality, improper use, loss of integrity), addressing distribution, access, retrieval and use, storage and preservation, control of changes, retention and disposition.",
    typicalAllocation: ["Document Control", "Records Management"],
    howToSatisfy: {
      practices: ["Document numbering and version control", "Approval workflows", "Access control and distribution"],
      controls: ["Document review cycle", "Obsolete document control", "Backup and recovery"],
      evidenceExamples: ["Document register", "Change logs", "Version control records"],
    },
    supportingEvidence: {
      documents: ["Document control procedure"],
      records: ["Document register", "Distribution records"],
      other: ["Electronic document management system"],
    },
    recordTemplate: {
      name: "Master Document Register",
      columns: [
        { name: "Doc. code" },
        { name: "Title" },
        { name: "Type", description: "Procedure / Form / Instruction / Manual" },
        { name: "Linked process(es)" },
        { name: "Linked clause(s)" },
        { name: "Version" },
        { name: "Issue date" },
        { name: "Author" },
        { name: "Reviewer" },
        { name: "Approver" },
        { name: "Status", description: "Draft / Active / Archived" },
        { name: "Retention period" },
      ],
      approval: {
        required: true,
        approver: "Author → Reviewer → Approver chain (typically Quality Manager / Process Owner)",
        note: "Three-step electronic workflow: drafted, reviewed, approved before publication. Each role signs in the EDMS.",
      },
      retention: "Per document retention rule; minimum current + 1 archived version.",
    },
  },

  // ── Clause 8 — Operation ────────────────────────────────────────────────
  {
    clauseNumber: "8.1",
    clauseTitle: "Operational planning and control",
    statement:
      "The organization shall plan, implement and control the processes needed to meet the requirements for the provision of products and services and to implement the actions determined in clause 6, by determining requirements for the products and services, establishing criteria for the processes and acceptance of products and services, determining the resources needed, implementing control of the processes, and retaining documented information sufficient to demonstrate that processes have been carried out as planned.",
    typicalAllocation: ["Operational Control", "Production Planning"],
    howToSatisfy: {
      practices: ["Define process criteria and controls", "Work instructions for critical operations", "Acceptance criteria for outputs"],
      controls: ["Process monitoring", "Output verification"],
      evidenceExamples: ["SOPs", "Flowcharts", "Work instructions"],
    },
    supportingEvidence: {
      documents: ["Operating procedures", "Work instructions"],
      records: ["Process control records"],
      other: ["Control plans"],
    },
    recordTemplate: {
      name: "Operational Control Plan",
      columns: [
        { name: "Process / step" },
        { name: "Criterion" },
        { name: "Control method" },
        { name: "Acceptance limits" },
        { name: "Frequency" },
        { name: "Resource / equipment" },
        { name: "Responsible" },
        { name: "Record produced" },
        { name: "Reaction on deviation" },
      ],
      approval: {
        required: true,
        approver: "Process Owner + Quality Manager",
        note: "Co-signed by the Process Owner and the Quality Manager before deployment.",
      },
      retention: "Lifetime of the product / service + 3 years.",
    },
  },
  {
    clauseNumber: "8.2",
    clauseTitle: "Requirements for products and services",
    statement:
      "The organization shall establish processes for communication with customers, determine the requirements for products and services to be offered, and review the requirements before committing to supply — ensuring requirements are defined (including any considered necessary by the organization, statutory and regulatory requirements), differences between contract and previously expressed are resolved, and the organization can meet the claims it makes.",
    typicalAllocation: ["Sales", "Order Management", "Customer Communication"],
    howToSatisfy: {
      practices: ["Customer requirement review before acceptance", "Contract review process", "Customer communication channels"],
      controls: ["Order review checklist", "Requirement change management"],
      evidenceExamples: ["Requirement review logs", "Contract review records", "Customer communication records"],
    },
    supportingEvidence: {
      documents: ["Contract review procedure"],
      records: ["Requirement review records", "Order confirmations"],
      other: ["Customer correspondence"],
    },
    recordTemplate: {
      name: "Contract / Order Review Form",
      columns: [
        { name: "Customer" },
        { name: "Order / contract ref." },
        { name: "Date received" },
        { name: "Requirements stated" },
        { name: "Statutory / regulatory" },
        { name: "Implicit requirements" },
        { name: "Capability check" },
        { name: "Differences resolved?" },
        { name: "Reviewer" },
        { name: "Acceptance decision" },
        { name: "Confirmation sent date" },
      ],
      approval: {
        required: true,
        approver: "Sales Manager (and Technical / Production lead for non-standard orders)",
        note: "Each order signed off before commitment; non-standard orders require dual signature.",
      },
      retention: "Contract duration + 5 years.",
    },
  },
  {
    clauseNumber: "8.3",
    clauseTitle: "Design and development of products and services",
    statement:
      "The organization shall establish, implement and maintain a design and development process appropriate to ensure subsequent provision of products and services. It shall determine the stages and controls (planning, inputs, controls, outputs and changes) considering the nature, duration and complexity of activities, required process stages including reviews, verification and validation, responsibilities and authorities, and documented information needed to demonstrate that requirements have been met.",
    typicalAllocation: ["Product Design", "R&D"],
    howToSatisfy: {
      practices: ["Design planning with stages and gates", "Input / output definition", "Verification and validation activities"],
      controls: ["Design reviews at planned stages", "Change control for design"],
      evidenceExamples: ["Design plans", "Verification records", "Validation records"],
    },
    supportingEvidence: {
      documents: ["Design and development procedure"],
      records: ["Design input/output records", "Review records", "V&V records"],
      other: ["Prototypes", "Test reports"],
    },
    recordTemplate: {
      name: "Design & Development Dossier",
      columns: [
        { name: "Project ref." },
        { name: "Stage", description: "Planning / Inputs / Reviews / Verification / Validation / Outputs / Changes" },
        { name: "Inputs" },
        { name: "Outputs" },
        { name: "Review date" },
        { name: "Reviewers" },
        { name: "Verification method & result" },
        { name: "Validation method & result" },
        { name: "Change ref." },
        { name: "Decision (gate)" },
      ],
      approval: {
        required: true,
        approver: "Design Authority + Quality Manager",
        note: "Stage-gate sign-off: each stage signed by the Design Authority and the Quality Manager before progressing.",
      },
      retention: "Product life + 10 years (or as required by regulation).",
    },
  },
  {
    clauseNumber: "8.4",
    clauseTitle: "Control of externally provided processes, products and services",
    statement:
      "The organization shall ensure that externally provided processes, products and services conform to requirements. It shall determine and apply criteria for the evaluation, selection, monitoring of performance and re-evaluation of external providers, and ensure adequate communication of requirements (including processes, products and services to be provided, approval of products / methods / processes / equipment, competence and qualification, interactions with the QMS, control and monitoring of performance, and verification activities).",
    typicalAllocation: ["Supplier Evaluation", "Purchasing"],
    howToSatisfy: {
      practices: ["Supplier qualification process", "Incoming inspection", "Performance monitoring"],
      controls: ["Approved supplier list", "Supplier audit program", "Receiving inspection"],
      evidenceExamples: ["Supplier evaluation records", "Contracts", "Inspection records"],
    },
    supportingEvidence: {
      documents: ["Purchasing procedure", "Supplier evaluation criteria"],
      records: ["Supplier evaluation records", "Inspection records"],
      other: ["Approved supplier list"],
    },
    recordTemplate: {
      name: "Approved Supplier Register & Evaluation",
      columns: [
        { name: "Supplier" },
        { name: "Goods / services provided" },
        { name: "Criticality" },
        { name: "Selection criteria & score" },
        { name: "Approval date" },
        { name: "Performance KPIs", description: "Quality / Delivery / Service" },
        { name: "Monitoring period" },
        { name: "Performance score" },
        { name: "Status", description: "Approved / Conditional / Suspended" },
        { name: "Re-evaluation date" },
      ],
      approval: {
        required: true,
        approver: "Purchasing Manager + Quality Manager",
        note: "New supplier approval co-signed by Purchasing and Quality; periodic re-evaluation signed at each cycle.",
      },
      retention: "Active + 5 years after deactivation.",
    },
  },
  {
    clauseNumber: "8.5",
    clauseTitle: "Production and service provision",
    statement:
      "The organization shall implement production and service provision under controlled conditions, including availability of documented information defining characteristics of products / services and results to be achieved, availability and use of suitable monitoring and measuring resources, implementation of monitoring and measurement at appropriate stages, use of suitable infrastructure and environment, appointment of competent persons, validation of processes where outputs cannot be verified, implementation of actions to prevent human error, and implementation of release, delivery and post-delivery activities. It shall also use suitable means to identify outputs, identify their status, control unique identification when traceability is required, exercise care with property belonging to customers / external providers, preserve outputs, meet post-delivery requirements, and control changes.",
    typicalAllocation: ["Production", "Service Delivery"],
    howToSatisfy: {
      practices: ["Controlled conditions for all operations", "Traceability systems", "Preservation methods"],
      controls: ["In-process inspection", "Traceability records", "Change control"],
      evidenceExamples: ["Process sheets", "Inspection reports", "Traceability logs"],
    },
    supportingEvidence: {
      documents: ["Production procedures", "Service delivery procedures"],
      records: ["Production records", "Traceability records", "Inspection records"],
      other: ["Equipment calibration records"],
    },
    recordTemplate: {
      name: "Production / Service Delivery Record",
      columns: [
        { name: "Batch / job ref." },
        { name: "Product / service" },
        { name: "Date" },
        { name: "Operator (competent)" },
        { name: "Equipment used" },
        { name: "Measurement results" },
        { name: "Identification / status" },
        { name: "Traceability data" },
        { name: "Customer property handled" },
        { name: "Preservation conditions" },
        { name: "Change ref. (if any)" },
      ],
      approval: {
        required: true,
        approver: "Production / Service Supervisor",
        note: "Operator signs activities; supervisor signs the completed batch / job record.",
      },
      retention: "Product life + 5 years (or per regulation).",
    },
  },
  {
    clauseNumber: "8.6",
    clauseTitle: "Release of products and services",
    statement:
      "The organization shall implement planned arrangements at appropriate stages to verify that the product and service requirements have been met. The release of products and services shall not proceed until the planned arrangements have been satisfactorily completed, unless otherwise approved by a relevant authority and, as applicable, by the customer. The organization shall retain documented information on the release of products and services, including evidence of conformity with the acceptance criteria and traceability to the person(s) authorizing the release.",
    typicalAllocation: ["Quality Control", "Release Authorization"],
    howToSatisfy: {
      practices: ["Final inspection and testing", "Release authorization process", "Conformity evidence"],
      controls: ["Hold-point verification", "Release authority delegation"],
      evidenceExamples: ["Testing records", "Release certificates", "Conformity declarations"],
    },
    supportingEvidence: {
      documents: ["Inspection and testing procedure"],
      records: ["Test reports", "Release records"],
      other: ["Certificates of conformity"],
    },
    recordTemplate: {
      name: "Release Authorization Record",
      columns: [
        { name: "Batch / order ref." },
        { name: "Acceptance criteria" },
        { name: "Verification results" },
        { name: "Conformity statement", description: "Conform / Concession" },
        { name: "Concession ref. (if any)" },
        { name: "Customer approval (if required)" },
        { name: "Release authority" },
        { name: "Release date / time" },
      ],
      approval: {
        required: true,
        approver: "Authorized Release Authority (QC Manager / designated authority)",
        note: "Mandatory traceable signature of the release authority; concessions additionally signed by the customer when applicable.",
      },
      retention: "Product life + 10 years (or per regulation).",
    },
  },
  {
    clauseNumber: "8.7",
    clauseTitle: "Control of nonconforming outputs",
    statement:
      "The organization shall ensure that outputs that do not conform to their requirements are identified and controlled to prevent their unintended use or delivery. It shall take appropriate action based on the nature of the nonconformity and its effect on conformity (correction, segregation, containment, return or suspension of provision of products and services, informing the customer, obtaining authorization for acceptance under concession), and shall verify conformity to requirements when nonconforming outputs are corrected. Documented information shall be retained describing the nonconformity, the actions taken, any concessions obtained, and the authority deciding the action.",
    typicalAllocation: ["NCR Handling", "Quality Control"],
    howToSatisfy: {
      practices: ["Nonconformity identification and segregation", "Disposition decisions", "Notification to relevant parties"],
      controls: ["NCR workflow", "Rework / reject authority", "Customer notification when applicable"],
      evidenceExamples: ["NCR log", "Containment actions", "Disposition records"],
    },
    supportingEvidence: {
      documents: ["Nonconformity procedure"],
      records: ["NCR register", "Disposition records"],
      other: ["Corrective action links"],
    },
    recordTemplate: {
      name: "Nonconforming Output Record (NCR)",
      columns: [
        { name: "NCR ref." },
        { name: "Date detected" },
        { name: "Detected by" },
        { name: "Product / process" },
        { name: "Description of nonconformity" },
        { name: "Quantity affected" },
        { name: "Containment action" },
        { name: "Disposition", description: "Rework / Regrade / Scrap / Concession / Return" },
        { name: "Concession authority" },
        { name: "Customer notified?" },
        { name: "Re-verification result" },
        { name: "Linked corrective action ref." },
        { name: "Closed by / date" },
      ],
      approval: {
        required: true,
        approver: "Quality Manager (and Customer for concessions)",
        note: "Disposition signed by the Quality Manager; concessions additionally signed by the customer when their requirements are affected.",
      },
      retention: "5 years from closure.",
    },
  },

  // ── Clause 9 — Performance evaluation ───────────────────────────────────
  {
    clauseNumber: "9.1",
    clauseTitle: "Monitoring, measurement, analysis and evaluation",
    statement:
      "The organization shall determine what needs to be monitored and measured, the methods for monitoring, measurement, analysis and evaluation needed to ensure valid results, when monitoring and measuring shall be performed, and when the results shall be analysed and evaluated. It shall evaluate the performance and effectiveness of the QMS, monitor customer perceptions of the degree to which their needs and expectations have been fulfilled, and analyse and evaluate appropriate data and information arising from monitoring and measurement.",
    typicalAllocation: ["KPI Tracking", "Process Monitoring"],
    howToSatisfy: {
      practices: ["Define KPIs per process", "Data collection methods", "Trend analysis", "Customer satisfaction measurement"],
      controls: ["Dashboard reviews", "Periodic performance meetings"],
      evidenceExamples: ["KPI dashboards", "Measurement logs", "Analysis reports", "Customer satisfaction surveys"],
    },
    supportingEvidence: {
      documents: ["Monitoring and measurement procedure"],
      records: ["KPI data", "Analysis reports"],
      other: ["Dashboards", "Statistical charts"],
    },
    recordTemplate: {
      name: "KPI / Measurement Sheet",
      columns: [
        { name: "KPI code" },
        { name: "Process" },
        { name: "Definition / formula" },
        { name: "Measurement method" },
        { name: "Frequency" },
        { name: "Target" },
        { name: "Period" },
        { name: "Value" },
        { name: "Status", description: "Achieved / At risk / Not achieved" },
        { name: "Analysis & comment" },
        { name: "Action triggered (if not achieved)" },
        { name: "Recorded by" },
      ],
      approval: {
        required: true,
        approver: "Process Owner",
        note: "KPI configuration is immutable once approved; values are append-only and signed by the Process Owner each period.",
      },
      retention: "5 years; historical values preserved (immutable).",
    },
  },
  {
    clauseNumber: "9.2",
    clauseTitle: "Internal audit",
    statement:
      "The organization shall conduct internal audits at planned intervals to provide information on whether the QMS conforms to the organization's own requirements and the requirements of ISO 9001 and is effectively implemented and maintained. The organization shall plan, establish, implement and maintain an audit programme, define the audit criteria and scope for each audit, select auditors and conduct audits to ensure objectivity and impartiality, ensure that the results of the audits are reported to relevant management, take appropriate correction and corrective actions without undue delay, and retain documented information as evidence.",
    typicalAllocation: ["Audit Program", "Internal Audit"],
    howToSatisfy: {
      practices: ["Annual audit programme", "Trained and independent auditors", "Systematic audit methodology"],
      controls: ["Audit schedule adherence", "Finding follow-up", "Auditor competence verification"],
      evidenceExamples: ["Audit schedule", "Audit reports", "Finding closure records"],
    },
    supportingEvidence: {
      documents: ["Internal audit procedure", "Audit programme"],
      records: ["Audit reports", "Finding logs", "Corrective action records"],
      other: ["Auditor qualification records"],
    },
    recordTemplate: {
      name: "Internal Audit Report",
      columns: [
        { name: "Audit ref." },
        { name: "Audit date(s)" },
        { name: "Scope & criteria" },
        { name: "Process(es) audited" },
        { name: "Auditor(s)" },
        { name: "Auditee(s)" },
        { name: "Findings", description: "Conformity / Nonconformity / Observation / Opportunity" },
        { name: "Evidence" },
        { name: "Linked corrective action ref." },
        { name: "Reported to" },
        { name: "Closure date" },
      ],
      approval: {
        required: true,
        approver: "Lead Auditor + Audited Process Owner",
        note: "Report signed by the Lead Auditor; findings acknowledged (signed) by the audited Process Owner.",
      },
      retention: "Minimum 3 audit cycles (typically 5 years).",
    },
  },
  {
    clauseNumber: "9.3",
    clauseTitle: "Management review",
    statement:
      "Top management shall review the organization's QMS at planned intervals to ensure its continuing suitability, adequacy, effectiveness and alignment with the strategic direction of the organization. The review shall be planned and carried out taking into consideration the status of actions from previous reviews, changes in external and internal issues, information on the performance and effectiveness of the QMS (including customer satisfaction, extent to which objectives have been met, process performance and conformity, nonconformities and corrective actions, monitoring and measurement results, audit results, and the performance of external providers), the adequacy of resources, the effectiveness of actions taken to address risks and opportunities, and opportunities for improvement.",
    typicalAllocation: ["Management Review"],
    howToSatisfy: {
      practices: ["Scheduled management review meetings", "Structured agenda covering all required inputs", "Action item tracking"],
      controls: ["Review frequency adherence", "Action item follow-up"],
      evidenceExamples: ["Review minutes", "Action follow-ups", "Decision records"],
    },
    supportingEvidence: {
      documents: ["Management review procedure"],
      records: ["Meeting minutes", "Action logs"],
      other: ["Presentation materials", "Performance summaries"],
    },
    recordTemplate: {
      name: "Management Review Minutes",
      columns: [
        { name: "Review date" },
        { name: "Attendees" },
        { name: "Inputs reviewed", description: "Previous actions, context changes, KPIs, customer satisfaction, audits, NCs, providers, risks, resources" },
        { name: "Discussion / analysis" },
        { name: "Decisions on improvement opportunities" },
        { name: "Decisions on QMS changes" },
        { name: "Resource needs decided" },
        { name: "Action plan ref." },
        { name: "Owner & due date" },
        { name: "Next review date" },
      ],
      approval: {
        required: true,
        approver: "Top Management (chair)",
        note: "Minutes signed by the chair (Top Management) and the Quality Manager; circulated to all attendees.",
      },
      retention: "5 years; historical reviews preserved.",
    },
  },

  // ── Clause 10 — Improvement ─────────────────────────────────────────────
  {
    clauseNumber: "10.1",
    clauseTitle: "Improvement (general)",
    statement:
      "The organization shall determine and select opportunities for improvement and implement any necessary actions to meet customer requirements and enhance customer satisfaction. This shall include improving products and services to meet requirements as well as to address future needs and expectations, correcting, preventing or reducing undesired effects, and improving the performance and effectiveness of the QMS.",
    typicalAllocation: ["Improvement Planning", "QMS Governance"],
    howToSatisfy: {
      practices: ["Improvement opportunity identification", "Prioritization methodology", "Implementation tracking"],
      controls: ["Improvement log review", "Effectiveness verification"],
      evidenceExamples: ["Improvement logs", "Lessons learned", "Benefit tracking"],
    },
    supportingEvidence: {
      documents: ["Continual improvement procedure"],
      records: ["Improvement register", "Lessons learned log"],
      other: ["Kaizen records", "Innovation proposals"],
    },
    recordTemplate: {
      name: "Improvement Opportunity Register",
      columns: [
        { name: "Ref." },
        { name: "Source", description: "Audit / NC / KPI / Customer / Suggestion / Mgt Review" },
        { name: "Description" },
        { name: "Expected benefit" },
        { name: "Priority" },
        { name: "Owner" },
        { name: "Action plan ref." },
        { name: "Target date" },
        { name: "Effectiveness evaluation" },
        { name: "Status" },
      ],
      approval: {
        required: true,
        approver: "Quality Manager",
        note: "Selection and prioritization signed by the Quality Manager; significant initiatives endorsed at Management Review.",
      },
      retention: "3 years from closure.",
    },
  },
  {
    clauseNumber: "10.2",
    clauseTitle: "Nonconformity and corrective action",
    statement:
      "When a nonconformity occurs, including any arising from complaints, the organization shall react to the nonconformity (take action to control and correct it, deal with the consequences), evaluate the need for action to eliminate the cause(s) so it does not recur or occur elsewhere (review and analyse the nonconformity, determine its causes, determine if similar nonconformities exist or could occur), implement any action needed, review the effectiveness of any corrective action taken, update risks and opportunities determined during planning if necessary, and make changes to the QMS if necessary. Documented information shall be retained as evidence of the nature of the nonconformities and any subsequent actions taken, and the results of any corrective action.",
    typicalAllocation: ["NCR / CAPA Process", "Corrective Action"],
    howToSatisfy: {
      practices: ["Root cause analysis methodology", "Corrective action planning", "Effectiveness verification"],
      controls: ["CAPA workflow with deadlines", "Recurrence monitoring"],
      evidenceExamples: ["CAPA records", "Root cause analysis", "Effectiveness checks"],
    },
    supportingEvidence: {
      documents: ["Corrective action procedure"],
      records: ["CAPA register", "Root cause analysis records"],
      other: ["Effectiveness verification evidence"],
    },
    recordTemplate: {
      name: "Corrective Action Record (CAPA)",
      columns: [
        { name: "CAPA ref." },
        { name: "Source NC / complaint" },
        { name: "Description & consequences" },
        { name: "Immediate correction" },
        { name: "Root cause analysis", description: "5-Whys / Ishikawa / etc." },
        { name: "Similar NC check" },
        { name: "Corrective action(s)" },
        { name: "Owner" },
        { name: "Due date" },
        { name: "Implementation evidence" },
        { name: "Effectiveness evaluation", description: "Method, date, result" },
        { name: "Risk register updated?" },
        { name: "QMS change required?" },
        { name: "Closed by / date" },
      ],
      approval: {
        required: true,
        approver: "Quality Manager (and Process Owner of impacted area)",
        note: "Action plan signed by the Process Owner; closure (after effectiveness evaluation) signed by the Quality Manager.",
      },
      retention: "5 years from closure.",
    },
  },
  {
    clauseNumber: "10.3",
    clauseTitle: "Continual improvement",
    statement:
      "The organization shall continually improve the suitability, adequacy and effectiveness of the QMS. The organization shall consider the results of analysis and evaluation, and the outputs from management review, to determine if there are needs or opportunities that shall be addressed as part of continual improvement.",
    typicalAllocation: ["Strategic QMS Improvement", "Management Review"],
    howToSatisfy: {
      practices: ["Trend analysis of performance data", "Benchmarking", "Improvement project selection"],
      controls: ["Strategic improvement plan review", "Management review action tracking"],
      evidenceExamples: ["Trend analyses", "Improvement plans", "Benchmarking reports"],
    },
    supportingEvidence: {
      documents: ["Continual improvement procedure"],
      records: ["Improvement plans", "Trend analysis records"],
      other: ["Performance dashboards"],
    },
    recordTemplate: {
      name: "Continual Improvement Plan",
      columns: [
        { name: "Plan ref. & period" },
        { name: "Strategic axis" },
        { name: "Improvement initiative" },
        { name: "Justification", description: "Trend / Mgt Review output / Benchmark" },
        { name: "Expected impact on QMS" },
        { name: "Resources" },
        { name: "Sponsor" },
        { name: "Milestones" },
        { name: "KPI of success" },
        { name: "Status / outcome" },
      ],
      approval: {
        required: true,
        approver: "Top Management",
        note: "Plan approved at Management Review and signed by Top Management; outcomes reported at the next review.",
      },
      retention: "Permanent (rolling plans archived year-on-year).",
    },
  },
];

// Group requirements by main clause number
function groupByClauses(guidance: RequirementGuidance[]): StandardClauseGroup[] {
  const clauseMap = new Map<string, { title: string; reqs: RequirementGuidance[] }>();

  const clauseTitles: Record<string, string> = {
    "4": "Context of the Organization",
    "5": "Leadership",
    "6": "Planning",
    "7": "Support",
    "8": "Operation",
    "9": "Performance Evaluation",
    "10": "Improvement",
  };

  for (const req of guidance) {
    const mainClause = req.clauseNumber.split(".")[0];
    if (!clauseMap.has(mainClause)) {
      clauseMap.set(mainClause, { title: clauseTitles[mainClause] || mainClause, reqs: [] });
    }
    clauseMap.get(mainClause)!.reqs.push(req);
  }

  return Array.from(clauseMap.entries()).map(([num, { title, reqs }]) => ({
    clauseNumber: num,
    clauseTitle: title,
    requirements: reqs,
  }));
}

export const ISO9001_STANDARD: StandardDefinition = {
  id: "iso-9001-2015",
  name: "ISO 9001",
  version: "2015",
  clauseGroups: groupByClauses(ISO9001_GUIDANCE),
};
