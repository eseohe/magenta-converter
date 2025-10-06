import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb";
import { Home, ChevronRight } from "lucide-react";
import type { Section } from "../data/sections";

interface CategoryBreadcrumbProps {
  label: string;
  onHome: () => void;
  section?: Section;
  onSectionClick?: () => void;
}

export function CategoryBreadcrumb({ label, onHome, section, onSectionClick }: CategoryBreadcrumbProps) {
  return (
    <div className="mb-6 rounded-lg border border-primary/20 bg-primary/10 px-4 py-3">
      <Breadcrumb>
        <BreadcrumbList className="text-primary">
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <button onClick={onHome} className="inline-flex items-center gap-2 font-medium hover:underline cursor-pointer">
                <Home className="size-4" />
                Home
              </button>
            </BreadcrumbLink>
          </BreadcrumbItem>
          
          {section && (
            <>
              <BreadcrumbSeparator>
                <ChevronRight className="size-4" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <button 
                    onClick={onSectionClick} 
                    className="inline-flex items-center gap-2 font-medium hover:underline cursor-pointer"
                  >
                    <span>{section.icon}</span>
                    {section.name}
                  </button>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </>
          )}
          
          <BreadcrumbSeparator>
            <ChevronRight className="size-4" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-foreground">{label}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
