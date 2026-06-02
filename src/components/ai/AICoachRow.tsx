import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { AICoachCard, type CoachSuggestion } from "./AICoachCard";

interface Props {
  scope: string;
  contextSummary: Record<string, unknown>;
}

const dismissalKey = (userId: string, scope: string) => `aiCoach:dismissed:${userId}:${scope}`;
const cacheKey = (userId: string, scope: string, hash: string) => `aiCoach:cache:${userId}:${scope}:${hash}`;

function hashContext(c: unknown): string {
  try {
    const s = JSON.stringify(c);
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return String(h);
  } catch {
    return "0";
  }
}

export function AICoachRow({ scope, contextSummary }: Props) {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<CoachSuggestion[]>([]);
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ctxHash = useMemo(() => hashContext(contextSummary), [contextSummary]);

  useEffect(() => {
    if (!user) return;
    try {
      const raw = localStorage.getItem(dismissalKey(user.id, scope));
      setDismissed(raw ? JSON.parse(raw) : []);
    } catch {
      setDismissed([]);
    }
  }, [user, scope]);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    // Cache: 10 minutes
    const ck = cacheKey(user.id, scope, ctxHash);
    try {
      const cached = localStorage.getItem(ck);
      if (cached) {
        const parsed = JSON.parse(cached) as { ts: number; data: CoachSuggestion[] };
        if (Date.now() - parsed.ts < 10 * 60 * 1000) {
          setSuggestions(parsed.data);
          return;
        }
      }
    } catch { /* ignore */ }

    setLoading(true);
    setError(null);
    supabase.functions
      .invoke("ai-coach", { body: { scope, contextSummary } })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          setError(error.message);
          setSuggestions([]);
          return;
        }
        const list = (data?.suggestions ?? []) as CoachSuggestion[];
        setSuggestions(list);
        try {
          localStorage.setItem(ck, JSON.stringify({ ts: Date.now(), data: list }));
        } catch { /* ignore */ }
      })
      .finally(() => !cancelled && setLoading(false));

    return () => { cancelled = true; };
  }, [user, scope, ctxHash, contextSummary]);

  const onDismiss = useCallback((key: string) => {
    if (!user) return;
    setDismissed((prev) => {
      const next = [...prev, key];
      try { localStorage.setItem(dismissalKey(user.id, scope), JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, [user, scope]);

  const visible = suggestions.filter((s) => !dismissed.includes(s.suggestionKey));

  if (loading && visible.length === 0) {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground px-1">
        <Loader2 className="h-3 w-3 animate-spin" />
        <span>Coach is reading your system…</span>
      </div>
    );
  }

  if (error) return null; // silent fail — never block the user
  if (visible.length === 0) return null;

  return (
    <section className="animate-fade-in" style={{ animationDelay: "30ms" }}>
      <h2 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.18em] mb-3 px-1 flex items-center gap-1">
        <Sparkles className="h-3 w-3" /> AI Coach
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {visible.map((s) => (
          <AICoachCard key={s.suggestionKey} suggestion={s} onDismiss={onDismiss} />
        ))}
      </div>
    </section>
  );
}
