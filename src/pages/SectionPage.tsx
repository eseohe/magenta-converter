import type { Section } from "../data/sections";
import { CategoryGrid } from "../components/CategoryGrid";

interface SectionPageProps {
  section: Section;
  onSelect: (categoryId: string) => void;
}

export default function SectionPage({ section, onSelect }: SectionPageProps) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight flex items-center justify-center gap-3">
          <span className="text-3xl">{section.icon}</span>
          {section.name}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {section.description}
        </p>
        <div className="text-sm text-muted-foreground">
          {section.categories.length} {section.categories.length === 1 ? 'converter' : 'converters'} available
        </div>
      </div>
      
      <CategoryGrid categories={section.categories} onSelect={onSelect} />
    </div>
  );
}