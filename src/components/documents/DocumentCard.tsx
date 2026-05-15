import { ArrowRight, FileCheck, FileText, ScrollText, FolderTree } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";

type DocType = "procedure" | "form" | "instruction" | "record" | "policy";

interface ChildDoc { id: string; code: string; title: string; type?: DocType }

interface DocumentCardProps {
  code: string;
  title: string;
  description?: string;
  status: "draft" | "active" | "archived";
  type: DocType;
  linkedCount: number;
  children: ChildDoc[];
  onClick: () => void;
  index?: number;
}

const TYPE_META: Record<DocType, { label: string; icon: typeof FileText; aura: string; tint: string; chip: string }> = {
  procedure:   { label: "Procedure",   icon: FileCheck,   aura: "var(--process)",     tint: "text-process",     chip: "bg-process/10 text-process ring-process/20" },
  form:        { label: "Form",        icon: FileText,    aura: "var(--primary)",     tint: "text-primary",     chip: "bg-primary/8 text-primary ring-primary/15" },
  instruction: { label: "Instruction", icon: ScrollText,  aura: "var(--accent)",      tint: "text-accent",      chip: "bg-accent/10 text-accent ring-accent/20" },
  record:      { label: "Record",      icon: FolderTree,  aura: "var(--info)",        tint: "text-info",        chip: "bg-info/10 text-info ring-info/20" },
  policy:      { label: "Policy",      icon: FileCheck,   aura: "var(--audit)",       tint: "text-audit",       chip: "bg-audit/10 text-audit ring-audit/20" },
};

export function DocumentCard({
  code, title, description, status, type, linkedCount, children, onClick, index = 0,
}: DocumentCardProps) {
  const meta = TYPE_META[type];
  const Icon = meta.icon;
  return (
    <button
      onClick={onClick}
      className="tile-depth tile-depth-hover aura-radial group relative w-full text-left p-5 animate-fade-in"
      style={{ ["--aura" as never]: meta.aura, animationDelay: `${index * 40}ms` }}
    >
      <div className="absolute inset-0 pattern-dots opacity-40 pointer-events-none rounded-2xl" />
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl bg-gradient-to-r from-transparent via-current to-transparent opacity-30" style={{ color: `hsl(${meta.aura})` }} />

      <div className="relative flex items-start gap-3">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ring-1", meta.chip)}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={cn("font-mono text-xs font-medium", meta.tint)}>{code}</span>
            <StatusBadge status={status} />
            <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ring-1", meta.chip)}>
              {meta.label}
            </span>
          </div>
          <h3 className="font-semibold leading-snug truncate">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{description}</p>
          )}
        </div>
        <ArrowRight className="w-5 h-5 text-muted-foreground shrink-0 mt-1 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>

      {linkedCount > 0 && (
        <div className="relative mt-4 pt-4 border-t border-border/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Linked items</span>
            <span className="font-mono text-xs tabular-nums text-foreground/80">{linkedCount}</span>
          </div>
          <ul className="space-y-1">
            {children.slice(0, 4).map((c) => (
              <li key={c.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
                <span className="font-mono text-foreground/70">{c.code}</span>
                <span className="truncate">— {c.title}</span>
              </li>
            ))}
            {linkedCount > 4 && (
              <li className="text-xs text-muted-foreground/80 pl-3">+ {linkedCount - 4} more</li>
            )}
          </ul>
        </div>
      )}
    </button>
  );
}
