import type { Category } from "../types";
import { CategoryGrid } from "../components/CategoryGrid";

export default function HomePage({ categories, onSelect }: { categories: Category[]; onSelect: (id: string) => void }) {
  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-3xl text-center space-y-3">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">Free Magenta Converter</h1>
        <p className="text-muted-foreground text-lg">Magenta-themed converter that handles everyday and advanced units: Convert anything to anything else.</p>
      </div>
      <CategoryGrid categories={categories} onSelect={onSelect} />
    </div>
  );
}
