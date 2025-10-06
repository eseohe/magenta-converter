import { useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useParams, useLocation } from "react-router-dom";
import { AppShell } from "./components/AppShell";
import HomePage from "./pages/Home";
import SectionPage from "./pages/SectionPage";
import CategoryPage from "./pages/CategoryPage";
import { allCategories } from "./data/categories";
import { sections, getSectionById, getSectionByCategory } from "./data/sections";
import type { Category } from "./types";
import { Search } from "lucide-react";
import { Input } from "./components/ui/input";
import { CategoryGrid } from "./components/CategoryGrid";
import { CategoryBreadcrumb } from "./components/CategoryBreadcrumb";

// Main routing component
function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
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

  const handleHome = () => {
    navigate('/');
  };

  const handleSectionSelect = (sectionId: string) => {
    navigate(`/section/${sectionId}`);
  };

  const handleCategorySelect = (categoryId: string) => {
    navigate(`/${categoryId}`);
  };

  const handleBackToSection = (sectionId: string) => {
    navigate(`/section/${sectionId}`);
  };

  // Determine title based on current route
  const getTitle = () => {
    if (location.pathname === '/') return "Magenta Converter";
    
    const pathParts = location.pathname.split('/').filter(Boolean);
    if (pathParts[0] === 'section') {
      const section = getSectionById(pathParts[1]);
      return section?.name || "Magenta Converter";
    } else {
      const category = categories.find(c => c.id === pathParts[0]);
      return category?.name || "Magenta Converter";
    }
  };

  return (
    <AppShell onHome={handleHome} title={getTitle()}>
      <div className="mb-6 grid gap-4 sm:grid-cols-[1fr,auto] sm:items-center">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Search conversions, e.g. km to mi" 
            className="pl-9" 
          />
        </div>
      </div>

      <Routes>
        {/* Home page */}
        <Route path="/" element={
          <HomePage 
            categories={filtered} 
            onSelect={handleCategorySelect} 
            onSectionSelect={handleSectionSelect}
            searchQuery={query}
          />
        } />
        
        {/* Section pages */}
        <Route path="/section/:sectionId" element={<SectionPageRoute onSelect={handleCategorySelect} onHome={handleHome} />} />
        
        {/* Category pages */}
        <Route path="/:categoryId" element={<CategoryPageRoute onHome={handleHome} onBackToSection={handleBackToSection} />} />
      </Routes>

      {/* Search results when there's a query and we're on home page */}
      {location.pathname === '/' && filtered.length === 0 && query && (
        <div className="text-center text-muted-foreground mt-8">No categories match your search.</div>
      )}

      {location.pathname === '/' && filtered.length > 0 && query && (
        <div className="mt-8">
          <h3 className="mb-3 text-sm uppercase tracking-wide text-muted-foreground">All matches</h3>
          <CategoryGrid categories={filtered} onSelect={handleCategorySelect} />
        </div>
      )}
    </AppShell>
  );
}

// Section page route component
function SectionPageRoute({ onSelect, onHome }: { onSelect: (categoryId: string) => void; onHome: () => void; }) {
  const { sectionId } = useParams<{ sectionId: string }>();
  const section = sectionId ? getSectionById(sectionId) : undefined;
  
  if (!section) {
    return <div className="text-center text-muted-foreground">Section not found.</div>;
  }

  return (
    <>
      <CategoryBreadcrumb 
        label={section.name} 
        onHome={onHome} 
      />
      <SectionPage 
        section={section} 
        onSelect={onSelect} 
      />
    </>
  );
}

// Category page route component  
function CategoryPageRoute({ onHome, onBackToSection }: { onHome: () => void; onBackToSection: (sectionId: string) => void; }) {
  const { categoryId } = useParams<{ categoryId: string }>();
  const category = categoryId ? allCategories.find(c => c.id === categoryId) : undefined;
  const currentCategorySection = category ? getSectionByCategory(category.id) : undefined;
  
  if (!category) {
    return <div className="text-center text-muted-foreground">Category not found.</div>;
  }

  const handleBackToSection = () => {
    if (currentCategorySection) {
      onBackToSection(currentCategorySection.id);
    }
  };

  return (
    <>
      <CategoryBreadcrumb 
        label={category.name} 
        onHome={onHome}
        section={currentCategorySection}
        onSectionClick={handleBackToSection}
      />
      <CategoryPage category={category} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
