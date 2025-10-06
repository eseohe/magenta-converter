export type UnitFn = (x: number) => number;

export type Unit = {
  id: string;
  label: string;
  symbol?: string;
  toBase: UnitFn;
  fromBase: UnitFn;
};

export type UnitCategory = {
  id: string;
  group: "Measurement" | "Digital" | "Science" | "Transport" | "Other" | "Finance";
  name: string;
  description?: string;
  icon?: string; // lucide-react icon name
  baseUnit: string;
  units: Unit[];
  popularPairs?: [string, string][];
};

export type CustomCategory = {
  id: string;
  group: UnitCategory["group"];
  name: string;
  description?: string;
  icon?: string;
  custom: true;
};

export type Category = UnitCategory | CustomCategory;

export function isCustomCategory(c: Category): c is CustomCategory {
  return (c as CustomCategory).custom === true;
}
