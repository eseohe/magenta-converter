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
  // SEO: List all categories and calculators/converters
  // Import sections and allCategories
  // (import at top: import { sections } from "../data/sections"; import { allCategories } from "../data/categories";)

  // Helper: get all categories grouped by section
  // Each section has categories, each category has name/id
  // For custom categories, use .custom === true

  // Render SEO grid below main cards
  const renderSEOGrid = () => (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6 text-center">All Converters & Calculators</h2>
      <div className="space-y-8">
        {sections.map(section => (
          <div key={section.id} className="">
            <h3 className="text-xl font-semibold mb-2">{section.icon} {section.name}</h3>
            <div className="text-muted-foreground mb-2">{section.description}</div>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {section.categories.map(cat => (
                <a
                  key={cat.id}
                  href={`/${cat.id}`}
                  className="block p-3 rounded-lg border bg-background hover:bg-primary/5 transition shadow-sm"
                  style={{ textDecoration: "none" }}
                >
                  <div className="font-semibold text-base mb-1">{cat.name}</div>
                  <div className="text-xs text-muted-foreground">{cat.description}</div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
  return (
    <div className="space-y-8 flex justify-center">
      {/* Left Ad Space */}
      <div className="hidden xl:block w-[120px]" />
      {/* Main Content */}
      <div className="w-full max-w-4xl mx-auto">
      <div className="mx-auto max-w-3xl text-center space-y-3">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">Free Magenta Converter/Calculator</h1>
        <p className="text-muted-foreground text-lg">Free online unit converter & calculator tool - Convert length, weight, temperature, currency, color, time zones, and more. Scientific calculator, percentage calculator, fraction calculator, and advanced math tools all in one place.</p>
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

        {/* SEO: List all categories and calculators/converters below main cards */}
        {renderSEOGrid()}
      </div>
      {/* Right Ad Space */}
      <div className="hidden xl:block w-[120px]" />
    </div>
  );
}
