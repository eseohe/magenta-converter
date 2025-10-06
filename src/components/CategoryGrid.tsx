import type { Category } from "../types";
import { CategoryCard } from "./CategoryCard";

export function CategoryGrid({ categories, onSelect }: { categories: Category[]; onSelect: (id: string) => void }) {
  const groups = Array.from(new Set(categories.map((c) => c.group)));
  return (
    <div className="space-y-8">
      {groups.map((g) => (
        <section key={g} className="space-y-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xl font-semibold tracking-tight">{g}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 cursor-pointer">
            {categories.filter((c) => c.group === g).map((c) => (
              <CategoryCard key={c.id} category={c} onClick={() => onSelect(c.id)} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
