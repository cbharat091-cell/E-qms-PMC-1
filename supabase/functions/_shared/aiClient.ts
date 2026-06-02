import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

export { corsHeaders };

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";
const DEFAULT_MODEL = "google/gemini-3-flash-preview";

export interface AIMessage {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
}

export interface AITool {
  type: "function";
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

export interface CallOptions {
  model?: string;
  messages: AIMessage[];
  tools?: AITool[];
  toolChoice?: { type: "function"; function: { name: string } };
  stream?: boolean;
}

export class AIGatewayError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function callGateway(opts: CallOptions): Promise<Response> {
  const key = Deno.env.get("LOVABLE_API_KEY");
  if (!key) throw new AIGatewayError(500, "LOVABLE_API_KEY is not configured");

  const body: Record<string, unknown> = {
    model: opts.model ?? DEFAULT_MODEL,
    messages: opts.messages,
    stream: opts.stream ?? false,
  };
  if (opts.tools) body.tools = opts.tools;
  if (opts.toolChoice) body.tool_choice = opts.toolChoice;

  const resp = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const t = await resp.text();
    console.error("AI gateway error:", resp.status, t);
    if (resp.status === 429) throw new AIGatewayError(429, "Rate limit reached. Please try again in a moment.");
    if (resp.status === 402) throw new AIGatewayError(402, "AI credits exhausted. Add credits in Workspace settings.");
    throw new AIGatewayError(500, "AI gateway error");
  }
  return resp;
}

/** Non-streaming JSON call that returns the first tool call arguments parsed. */
export async function callForStructured<T = unknown>(opts: CallOptions): Promise<T> {
  const resp = await callGateway({ ...opts, stream: false });
  const data = await resp.json();
  const call = data.choices?.[0]?.message?.tool_calls?.[0];
  if (!call?.function?.arguments) {
    throw new AIGatewayError(500, "AI did not return a structured result");
  }
  try {
    return JSON.parse(call.function.arguments) as T;
  } catch {
    throw new AIGatewayError(500, "AI returned malformed structured result");
  }
}

export function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

export function errorResponse(err: unknown): Response {
  if (err instanceof AIGatewayError) {
    return jsonResponse({ error: err.message }, err.status);
  }
  console.error("Edge function error:", err);
  return jsonResponse({ error: err instanceof Error ? err.message : "Unknown error" }, 500);
}

export function handleOptions(req: Request): Response | null {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  return null;
}
