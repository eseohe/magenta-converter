import type { Category } from "../types";
import { CategoryGrid } from "../components/CategoryGrid";
import { SectionGrid } from "../components/SectionGrid";
import { sections } from "../data/sections";

interface HomePageProps {
  categories: Category[];
  onSelect: (id: string) => void;
  onSectionSelect: (sectionId: string) => void;
  searchQuery?: string;
}

export default function HomePage({ categories, onSelect, onSectionSelect, searchQuery }: HomePageProps) {
  const showSections = !searchQuery || searchQuery.trim() === "";
  
  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-3xl text-center space-y-3">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">Free Magenta Converter/Calculator</h1>
        <p className="text-muted-foreground text-lg">Magenta-themed converter that handles everyday and advanced units: Convert anything to anything else.</p>
      </div>
      
      {showSections ? (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Choose a Category or type what you want in the search bar</h2>
            <p className="text-muted-foreground">Select a section to explore specific types of conversions</p>
          </div>
          <SectionGrid sections={sections} onSelect={onSectionSelect} />
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Search Results</h3>
          <CategoryGrid categories={categories} onSelect={onSelect} />
        </div>
      )}
    </div>
  );
}
