import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, X } from "lucide-react";

export function SearchBar({ value, onChange, placeholder = "Search conversions, e.g. km to mi" }: { value: string; onChange: (v: string) => void; placeholder?: string; }) {
  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder} 
        className={`pl-9 ${value ? 'pr-10' : ''}`}
      />
      {value && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
        >
          <X className="size-4 text-muted-foreground" />
        </Button>
      )}
    </div>
  );
}
