import type { Category } from "../types";
import { CategoryView } from "../components/CategoryView";

export default function CategoryPage({ category }: { category: Category }) {
  return (
    <div className="space-y-6">
      <CategoryView category={category} />
    </div>
  );
}
