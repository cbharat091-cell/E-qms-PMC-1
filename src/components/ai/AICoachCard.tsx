import { useNavigate } from "react-router-dom";
import { Sparkles, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface CoachSuggestion {
  title: string;
  rationale: string;
  isoClause?: string;
  ctaLabel: string;
  ctaRoute: string;
  suggestionKey: string;
}

interface Props {
  suggestion: CoachSuggestion;
  onDismiss: (key: string) => void;
}

export function AICoachCard({ suggestion, onDismiss }: Props) {
  const navigate = useNavigate();
  return (
    <Card className="group relative p-4 bg-gradient-to-br from-primary/5 via-card to-card border-primary/20 hover:border-primary/40 transition-colors">
      <button
        onClick={() => onDismiss(suggestion.suggestionKey)}
        className="absolute top-2 right-2 p-1 rounded-md text-muted-foreground/50 hover:text-foreground hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Dismiss suggestion"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 shrink-0 rounded-lg bg-primary/10 text-primary grid place-items-center">
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-semibold leading-tight">{suggestion.title}</h3>
            {suggestion.isoClause && (
              <Badge variant="outline" className="text-[10px] font-mono">
                {suggestion.isoClause}
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{suggestion.rationale}</p>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs text-primary hover:text-primary hover:bg-primary/10"
            onClick={() => navigate(suggestion.ctaRoute)}
          >
            {suggestion.ctaLabel}
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
