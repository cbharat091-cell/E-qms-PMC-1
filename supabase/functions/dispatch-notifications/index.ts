// Dispatcher that scans for due actions, scheduled audits, and KPI failures,
// then inserts notifications for the relevant users. Idempotent per (entity, kind, day).
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const now = new Date();
  const horizon = new Date(now.getTime() + 7 * 24 * 3600 * 1000).toISOString().slice(0, 10);
  const auditHorizon = new Date(now.getTime() + 14 * 24 * 3600 * 1000).toISOString().slice(0, 10);
  const dispatched: string[] = [];

  // 1. Actions due within 7 days, not closed
  const { data: actions } = await supabase
    .from("actions")
    .select("id, organization_id, title, due_date, assignee_user_id")
    .lte("due_date", horizon)
    .is("closed_at", null)
    .not("assignee_user_id", "is", null);

  for (const a of actions ?? []) {
    if (!a.assignee_user_id) continue;
    const { data: existing } = await supabase
      .from("notifications")
      .select("id")
      .eq("user_id", a.assignee_user_id)
      .eq("entity_id", a.id)
      .eq("kind", "action_due")
      .gte("created_at", new Date(now.getTime() - 24 * 3600 * 1000).toISOString())
      .maybeSingle();
    if (existing) continue;
    await supabase.from("notifications").insert({
      user_id: a.assignee_user_id,
      organization_id: a.organization_id,
      kind: "action_due",
      title: `Action due: ${a.title}`,
      body: `Due ${a.due_date}`,
      entity_type: "action",
      entity_id: a.id,
      link_path: `/actions/${a.id}`,
    });
    dispatched.push(`action:${a.id}`);
  }

  // 2. Audits starting within 14 days
  const { data: audits } = await supabase
    .from("audits")
    .select("id, organization_id, title, planned_start, lead_auditor_id, team_user_ids")
    .lte("planned_start", auditHorizon)
    .gte("planned_start", now.toISOString().slice(0, 10))
    .eq("status", "planned");

  for (const au of audits ?? []) {
    const recipients = [au.lead_auditor_id, ...(au.team_user_ids ?? [])].filter(Boolean);
    for (const uid of recipients) {
      const { data: existing } = await supabase
        .from("notifications")
        .select("id")
        .eq("user_id", uid)
        .eq("entity_id", au.id)
        .eq("kind", "audit_starting")
        .gte("created_at", new Date(now.getTime() - 7 * 24 * 3600 * 1000).toISOString())
        .maybeSingle();
      if (existing) continue;
      await supabase.from("notifications").insert({
        user_id: uid,
        organization_id: au.organization_id,
        kind: "audit_starting",
        title: `Upcoming audit: ${au.title}`,
        body: `Starts ${au.planned_start}`,
        entity_type: "audit",
        entity_id: au.id,
        link_path: `/audits/${au.id}`,
      });
      dispatched.push(`audit:${au.id}`);
    }
  }

  return new Response(JSON.stringify({ dispatched: dispatched.length, items: dispatched }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
