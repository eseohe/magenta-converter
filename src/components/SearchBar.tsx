import { Input } from "./ui/input";
import { Search } from "lucide-react";

export function SearchBar({ value, onChange, placeholder = "Search conversions, e.g. km to mi" }: { value: string; onChange: (v: string) => void; placeholder?: string; }) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="pl-9" />
    </div>
  );
}
