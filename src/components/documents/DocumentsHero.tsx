import { FileText, FileCheck, ScrollText, Archive, Files } from "lucide-react";
import { cn } from "@/lib/utils";

interface DocumentsHeroProps {
  procedureCount: number;
  formCount: number;
  instructionCount: number;
  archivedCount: number;
}

const TONE: Record<string, { text: string; bg: string; ring: string }> = {
  process: { text: "text-process", bg: "bg-process/10", ring: "ring-process/20" },
  primary: { text: "text-primary", bg: "bg-primary/8", ring: "ring-primary/15" },
  accent:  { text: "text-accent",  bg: "bg-accent/10",  ring: "ring-accent/20" },
  muted:   { text: "text-muted-foreground", bg: "bg-muted", ring: "ring-border" },
};

export function DocumentsHero({ procedureCount, formCount, instructionCount, archivedCount }: DocumentsHeroProps) {
  return (
    <section
      className="tile-depth tile-sweep aura-radial p-6 md:p-8 animate-fade-in"
      style={{ ["--aura" as never]: "var(--process)" }}
    >
      <div className="absolute inset-0 pattern-grid opacity-50 pointer-events-none rounded-2xl" />
      <div className="relative grid gap-6 md:grid-cols-[1.2fr_2fr] md:items-center">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/8 text-primary text-[11px] font-medium uppercase tracking-widest">
            <Files className="w-3.5 h-3.5" />
            Controlled documentation
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Documents
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
            Procedures, forms and controlled records — anchored to processes and ISO 9001 clauses.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Pill icon={FileCheck}  label="Procedures"   value={procedureCount}   tone="process" />
          <Pill icon={FileText}   label="Forms"        value={formCount}        tone="primary" />
          <Pill icon={ScrollText} label="Instructions" value={instructionCount} tone="accent" />
          <Pill icon={Archive}    label="Archived"     value={archivedCount}    tone="muted" />
        </div>
      </div>
    </section>
  );
}

function Pill({
  icon: Icon, label, value, tone,
}: { icon: typeof FileText; label: string; value: number; tone: keyof typeof TONE }) {
  const t = TONE[tone];
  return (
    <div className={cn("flex items-center gap-3 px-3 py-2.5 rounded-xl bg-card/70 backdrop-blur-sm ring-1", t.ring)}>
      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", t.bg)}>
        <Icon className={cn("w-4 h-4", t.text)} />
      </div>
      <div className="min-w-0">
        <div className={cn("font-mono text-xl font-bold leading-none tabular-nums", t.text)}>{value}</div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1 truncate">{label}</div>
      </div>
    </div>
  );
}
