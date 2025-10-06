import type { UnitCategory } from "../types";

export function getUnit(category: UnitCategory, id: string) {
  const u = category.units.find((u) => u.id === id);
  if (!u) throw new Error(`Unit ${id} not found in ${category.id}`);
  return u;
}

export function convert(value: number, category: UnitCategory, fromId: string, toId: string): number {
  const from = getUnit(category, fromId);
  const to = getUnit(category, toId);
  const base = from.toBase(value);
  return to.fromBase(base);
}
