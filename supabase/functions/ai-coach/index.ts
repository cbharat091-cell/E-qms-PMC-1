import {
  callForStructured,
  errorResponse,
  handleOptions,
  jsonResponse,
  type AITool,
} from "../_shared/aiClient.ts";

const SYSTEM_PROMPT = `You are the QMS Coach. You watch the user's current screen and propose 1 to 3 concrete next actions, grounded in ISO 9001:2015 (clauses 4–10) and the app's modules (Processes, Issues, Risks, Action Plans, KPIs, Documents, Internal Audits, Management Review, Standard Requirements).

Rules:
- Only suggest actions that are clearly justified by the contextSummary you are given. If the system already looks healthy on this scope, return zero suggestions.
- Each suggestion must reference an ISO clause when relevant.
- ctaRoute must be an absolute in-app path (e.g. "/risks", "/audits", "/processes/<id>").
- Be terse: titles under 8 words, rationale under 30 words.
- Never invent records or counts not present in the contextSummary.`;

const tool: AITool = {
  type: "function",
  function: {
    name: "emit_suggestions",
    description: "Return between 0 and 3 coaching suggestions for the current screen.",
    parameters: {
      type: "object",
      properties: {
        suggestions: {
          type: "array",
          maxItems: 3,
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              rationale: { type: "string" },
              isoClause: { type: "string", description: "e.g. 'Clause 6.1' or empty string" },
              ctaLabel: { type: "string" },
              ctaRoute: { type: "string" },
              suggestionKey: { type: "string", description: "stable key for dismissal dedupe" },
            },
            required: ["title", "rationale", "ctaLabel", "ctaRoute", "suggestionKey"],
            additionalProperties: false,
          },
        },
      },
      required: ["suggestions"],
      additionalProperties: false,
    },
  },
};

Deno.serve(async (req) => {
  const pre = handleOptions(req);
  if (pre) return pre;

  try {
    const { scope, contextSummary } = await req.json();
    if (typeof scope !== "string") return jsonResponse({ error: "scope required" }, 400);

    const result = await callForStructured<{ suggestions: unknown[] }>({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Scope: ${scope}\nContext summary (JSON):\n${JSON.stringify(contextSummary ?? {}, null, 2)}`,
        },
      ],
      tools: [tool],
      toolChoice: { type: "function", function: { name: "emit_suggestions" } },
    });

    return jsonResponse(result);
  } catch (e) {
    return errorResponse(e);
  }
});
