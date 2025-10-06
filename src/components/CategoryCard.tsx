import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import * as Icons from "lucide-react";
import type { Category, UnitCategory } from "../types";

export function CategoryCard({ category, onClick }: { category: Category; onClick: () => void }) {
  const Icon = (Icons as any)[category.icon ?? "LayoutGrid"] ?? Icons.LayoutGrid;
  const unitCount = (category as UnitCategory).units ? (category as UnitCategory).units.length : undefined;
  return (
    <button onClick={onClick} className="text-left cursor-pointer">
      <Card className="h-full transition hover:shadow-md cursor-pointer">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <span className="inline-flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary"><Icon className="size-4" /></span>
            {category.name}
          </CardTitle>
          {unitCount ? <Badge variant="secondary" className="rounded-full">{unitCount}</Badge> : null}
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2">{category.description}</p>
        </CardContent>
      </Card>
    </button>
  );
}
