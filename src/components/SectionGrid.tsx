import type { Section } from "../data/sections";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";

interface SectionGridProps {
  sections: Section[];
  onSelect: (sectionId: string) => void;
}

export function SectionGrid({ sections, onSelect }: SectionGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sections.map((section) => (
        <Card 
          key={section.id} 
          className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] border-border/50 hover:border-primary/30"
          onClick={() => onSelect(section.id)}
        >
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-3 text-lg">
              <span className="text-2xl">{section.icon}</span>
              <span className="group-hover:text-primary transition-colors">
                {section.name}
              </span>
            </CardTitle>
            <CardDescription className="text-sm">
              {section.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-sm text-muted-foreground">
              {section.categories.length} {section.categories.length === 1 ? 'converter' : 'converters'}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}