import { useState, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FileText, Archive, Plus } from "lucide-react";
import { FilterBar, FilterConfig } from "@/components/ui/filter-bar";
import { AdaptiveContainer } from "@/components/layout/AdaptiveContainer";
import { AdaptiveGrid } from "@/components/layout/AdaptiveGrid";
import { EmptyState } from "@/components/ui/empty-state";
import { Fab } from "@/components/ui/fab";
import { useManagementSystem } from "@/context/ManagementSystemContext";
import { Button } from "@/components/ui/button";
import { DocumentsHero } from "@/components/documents/DocumentsHero";
import { DocumentCard } from "@/components/documents/DocumentCard";

function compareDocumentCodes(aCode: string, bCode: string): number {
  const tokenize = (code: string) =>
    code
      .replace(/^MS-/, "")
      .split("-")
      .flatMap((segment) => segment.split("."))
      .map((part) => {
        const n = Number(part);
        return Number.isFinite(n) ? n : part;
      });

  const left = tokenize(aCode);
  const right = tokenize(bCode);
  const max = Math.max(left.length, right.length);

  for (let index = 0; index < max; index += 1) {
    const l = left[index];
    const r = right[index];
    if (l === undefined) return -1;
    if (r === undefined) return 1;
    if (typeof l === "number" && typeof r === "number" && l !== r) return l - r;
    if (String(l) !== String(r)) return String(l).localeCompare(String(r));
  }

  return 0;
}


export default function DocumentList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { documents } = useManagementSystem();

  const statusParam = searchParams.get("status") || "active";
  const searchParam = searchParams.get("q") || "";

  const [filterValues, setFilterValues] = useState<Record<string, string>>({
    status: statusParam,
  });
  const [searchValue, setSearchValue] = useState(searchParam);

  const filterConfigs: FilterConfig[] = useMemo(
    () => [
      {
        id: "status",
        label: "Status",
        options: [
          { value: "all", label: "All" },
          { value: "draft", label: "Draft" },
          { value: "active", label: "Active" },
          { value: "archived", label: "Archived" },
        ],
        defaultValue: "active",
      },
    ],
    [],
  );

  const handleFilterChange = useCallback((filterId: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [filterId]: value }));
  }, []);

  const handleClearAll = useCallback(() => {
    setFilterValues({ status: "active" });
    setSearchValue("");
    setSearchParams({});
  }, [setSearchParams]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((d) => {
      if (filterValues.status !== "all" && d.status !== filterValues.status) return false;
      if (searchValue) {
        const query = searchValue.toLowerCase();
        if (!d.title.toLowerCase().includes(query) && !d.code.toLowerCase().includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [documents, filterValues.status, searchValue]);

  const procedures = filteredDocuments
    .filter((document) => document.type === "procedure")
    .sort((a, b) => compareDocumentCodes(a.code, b.code));
  const getProcedureChildren = (procedureId: string) =>
    filteredDocuments
      .filter((document) => document.parentProcedureId === procedureId)
      .sort((a, b) => compareDocumentCodes(a.code, b.code));

  const counts = useMemo(() => ({
    procedures: documents.filter(d => d.type === "procedure" && d.status !== "archived").length,
    forms: documents.filter(d => d.type === "form" && d.status !== "archived").length,
    instructions: documents.filter(d => d.type === "instruction" && d.status !== "archived").length,
    archived: documents.filter(d => d.status === "archived").length,
  }), [documents]);

  return (
    <div className="min-h-screen">
      <AdaptiveContainer className="pt-4 pb-2">
        <DocumentsHero
          procedureCount={counts.procedures}
          formCount={counts.forms}
          instructionCount={counts.instructions}
          archivedCount={counts.archived}
        />
      </AdaptiveContainer>

      <FilterBar
        filters={filterConfigs}
        searchPlaceholder="Search by title or code..."
        values={filterValues}
        searchValue={searchValue}
        onFilterChange={handleFilterChange}
        onSearchChange={setSearchValue}
        onClearAll={handleClearAll}
      />

      <AdaptiveContainer className="py-4 space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="default" onClick={() => navigate("/documents/new")} className="gap-2">
            <Plus className="w-4 h-4" /> Add document
          </Button>
          <Button variant="outline" onClick={() => navigate("/documents?status=archived")} className="gap-2">
            <Archive className="w-4 h-4" /> Archived
          </Button>
        </div>

        {procedures.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No procedures found"
            description="Procedures are the entry point of the document module. Each procedure can group forms, records and instructions."
            actionLabel="Create first procedure"
            onAction={() => navigate("/documents/new")}
          />
        ) : (
          <AdaptiveGrid cols="1-2-3" gap="md">
            {procedures.map((document, idx) => {
              const children = getProcedureChildren(document.id);
              return (
                <DocumentCard
                  key={document.id}
                  index={idx}
                  code={document.code}
                  title={document.title}
                  description={document.description}
                  status={document.status}
                  type={document.type}
                  linkedCount={children.length}
                  children={children}
                  onClick={() => navigate(`/documents/${document.id}`)}
                />
              );
            })}
          </AdaptiveGrid>
        )}
      </AdaptiveContainer>

      <Fab onClick={() => navigate("/documents/new")} label="Create document" />
    </div>
  );
}
