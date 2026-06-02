import {
  callForStructured,
  errorResponse,
  handleOptions,
  jsonResponse,
  type AITool,
} from "../_shared/aiClient.ts";

/**
 * Unified drafting endpoint. Pass { kind, input } and receive a structured draft.
 * Supported kinds:
 *   - "quality-policy"   input: { sector, country, scopeStatement }
 *   - "scope-statement"  input: { sector, country, orgName }
 *   - "process"          input: { name, type, sector }
 *   - "risks-for-process" input: { processName, processType, sector }
 *   - "action-from-finding" input: { findingStatement, clauseCode, processName }
 *   - "onboarding-seed"  input: { sector, country, scopeStatement }
 */

const BASE_SYSTEM = `You are the QMS Drafting Assistant. Produce concise, audit-ready first drafts grounded in ISO 9001:2015. Never invent specific people, dates, or numeric KPI targets unless explicitly asked. Keep language neutral and professional. Drafts are starting points the user will edit.`;

type Kind =
  | "quality-policy"
  | "scope-statement"
  | "process"
  | "risks-for-process"
  | "action-from-finding"
  | "onboarding-seed";

const tools: Record<Kind, AITool> = {
  "quality-policy": {
    type: "function",
    function: {
      name: "emit_quality_policy",
      description: "Return a Quality Policy aligned with ISO 9001 Clause 5.2.",
      parameters: {
        type: "object",
        properties: {
          preamble: { type: "string" },
          axes: {
            type: "array",
            minItems: 4,
            maxItems: 6,
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                statement: { type: "string" },
              },
              required: ["title", "statement"],
              additionalProperties: false,
            },
          },
          commitment: { type: "string" },
        },
        required: ["preamble", "axes", "commitment"],
        additionalProperties: false,
      },
    },
  },
  "scope-statement": {
    type: "function",
    function: {
      name: "emit_scope_statement",
      description: "Return a QMS scope statement per ISO 9001 Clause 4.3.",
      parameters: {
        type: "object",
        properties: { scope: { type: "string" } },
        required: ["scope"],
        additionalProperties: false,
      },
    },
  },
  process: {
    type: "function",
    function: {
      name: "emit_process",
      description: "Return a process starter pack.",
      parameters: {
        type: "object",
        properties: {
          purpose: { type: "string" },
          inputs: { type: "array", items: { type: "string" } },
          outputs: { type: "array", items: { type: "string" } },
          activities: {
            type: "array",
            items: {
              type: "object",
              properties: { name: { type: "string" }, description: { type: "string" } },
              required: ["name"],
              additionalProperties: false,
            },
          },
          suggestedKpis: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                unit: { type: "string" },
                comparator: { type: "string", enum: [">=", "<=", "=", ">", "<"] },
                frequency: { type: "string" },
              },
              required: ["name"],
              additionalProperties: false,
            },
          },
          suggestedRisks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
              },
              required: ["title"],
              additionalProperties: false,
            },
          },
        },
        required: ["purpose", "activities"],
        additionalProperties: false,
      },
    },
  },
  "risks-for-process": {
    type: "function",
    function: {
      name: "emit_risks",
      description: "Return a starter risk register for a process per Clause 6.1.",
      parameters: {
        type: "object",
        properties: {
          risks: {
            type: "array",
            minItems: 3,
            maxItems: 8,
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                severity: { type: "integer", minimum: 1, maximum: 3 },
                probability: { type: "integer", minimum: 1, maximum: 3 },
              },
              required: ["title", "description", "severity", "probability"],
              additionalProperties: false,
            },
          },
        },
        required: ["risks"],
        additionalProperties: false,
      },
    },
  },
  "action-from-finding": {
    type: "function",
    function: {
      name: "emit_action",
      description: "Return a corrective action draft from an audit finding (Clause 10.2).",
      parameters: {
        type: "object",
        properties: {
          rootCauseHypothesis: { type: "string" },
          containment: { type: "string" },
          correctiveAction: { type: "string" },
          efficiencyCriteria: { type: "string" },
        },
        required: ["rootCauseHypothesis", "correctiveAction", "efficiencyCriteria"],
        additionalProperties: false,
      },
    },
  },
  "onboarding-seed": {
    type: "function",
    function: {
      name: "emit_seed",
      description: "Return a starter QMS pack: process map, policy, KPIs, risks.",
      parameters: {
        type: "object",
        properties: {
          qualityPolicy: { type: "string" },
          processes: {
            type: "array",
            minItems: 3,
            maxItems: 6,
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                type: { type: "string", enum: ["management", "operational", "support"] },
                purpose: { type: "string" },
                suggestedKpi: { type: "string" },
                suggestedRisk: { type: "string" },
              },
              required: ["name", "type", "purpose"],
              additionalProperties: false,
            },
          },
        },
        required: ["qualityPolicy", "processes"],
        additionalProperties: false,
      },
    },
  },
};

function userPromptFor(kind: Kind, input: Record<string, unknown>): string {
  return `Drafting kind: ${kind}\nInputs (JSON):\n${JSON.stringify(input ?? {}, null, 2)}\n\nReturn the structured result via the provided tool only.`;
}

Deno.serve(async (req) => {
  const pre = handleOptions(req);
  if (pre) return pre;

  try {
    const { kind, input } = await req.json();
    if (!kind || !(kind in tools)) {
      return jsonResponse({ error: `Unknown draft kind: ${kind}` }, 400);
    }
    const tool = tools[kind as Kind];
    const result = await callForStructured({
      messages: [
        { role: "system", content: BASE_SYSTEM },
        { role: "user", content: userPromptFor(kind as Kind, input ?? {}) },
      ],
      tools: [tool],
      toolChoice: { type: "function", function: { name: tool.function.name } },
    });
    return jsonResponse(result);
  } catch (e) {
    return errorResponse(e);
  }
});
