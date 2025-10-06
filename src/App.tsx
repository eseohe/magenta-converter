import { useMemo, useState } from "react";
import { AppShell } from "./components/AppShell";
import HomePage from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import { allCategories } from "./data/categories";
import type { Category } from "./types";
import { Search } from "lucide-react";
import { Input } from "./components/ui/input";
import { CategoryGrid } from "./components/CategoryGrid";
import { CategoryBreadcrumb } from "./components/CategoryBreadcrumb";

export default function App() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const categories = allCategories;
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return categories;
    return categories.filter((c) => {
      const inName = c.name.toLowerCase().includes(q) || (c.description?.toLowerCase().includes(q) ?? false);
      const inUnits = (c as any).units?.some((u: any) => u.label.toLowerCase().includes(q) || (u.symbol ?? "").toLowerCase().includes(q));
      return inName || inUnits;
    });
  }, [categories, query]);

  const selected: Category | undefined = selectedId ? categories.find((c) => c.id === selectedId) : undefined;

  return (
    <AppShell onHome={() => setSelectedId(null)} title={selected ? selected.name : "Magenta Converter"}>
      <div className="mb-6 grid gap-4 sm:grid-cols-[1fr,auto] sm:items-center">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search conversions, e.g. km to mi" className="pl-9" />
        </div>

      </div>

      {!selected && <HomePage categories={filtered} onSelect={setSelectedId} />}
      {selected && (
        <>
          <CategoryBreadcrumb label={selected.name} onHome={() => setSelectedId(null)} />
          <CategoryPage category={selected} />
        </>
      )}

      {!selected && filtered.length === 0 && (
        <div className="text-center text-muted-foreground">No categories match your search.</div>
      )}

      {!selected && filtered.length > 0 && query && (
        <div className="mt-8">
          <h3 className="mb-3 text-sm uppercase tracking-wide text-muted-foreground">All matches</h3>
          <CategoryGrid categories={filtered} onSelect={setSelectedId} />
        </div>
      )}
    </AppShell>
  );
}
